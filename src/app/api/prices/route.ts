import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  "https://brmufhutiividludfkbt.supabase.co",
  process.env.SUPABASE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Ensure date is in YYYY-MM-DD format
    if (date) {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date format");
      }
      date = dateObj.toISOString().split("T")[0];
    }

    const EXTERNAL_API =
      "http://spontaneouslambda-production-7690.up.railway.app";

    let response = await supabase.from("prices").select("*").eq("date", date);
    if (response.error) {
      throw new Error("Failed to fetch prices");
    }

    if (!response.data || response.data.length === 0) {
      const externalResponse = await fetch(`${EXTERNAL_API}?date=${date}`);
      const externalData = await externalResponse.json();
      await supabase.from("prices").insert(externalData.results);
      response = await supabase.from("prices").select("*").eq("date", date);

      // Add null check after fetching from external API
      if (!response.data) {
        throw new Error("Failed to fetch prices after external API call");
      }
    }

    // Get unique resort_ids from the response data
    const resortIds = [...new Set(response.data.map((item) => item.resort_id))];

    // Fetch links for all resort_ids
    const linksResponse = await supabase.rpc(
      "get_resort_links_location_state_region",
      {
        resort_ids: resortIds,
      }
    );

    if (linksResponse.error) {
      throw new Error("Failed to fetch resort links");
    }

    // Combine the price data with resort links
    const enrichedData = response.data.map((priceItem) => ({
      ...priceItem,
      links: linksResponse.data.find(
        (resort: { id: number; link: string }) =>
          resort.id === priceItem.resort_id
      )?.link,
      location: linksResponse.data.find(
        (resort: { id: number; location: { lat: number; lng: number } }) =>
          resort.id === priceItem.resort_id
      )?.location,
      state: linksResponse.data.find(
        (resort: { id: number; state: string }) =>
          resort.id === priceItem.resort_id
      )?.state,
      region: linksResponse.data.find(
        (resort: { id: number; region: string }) =>
          resort.id === priceItem.resort_id
      )?.region,
    }));

    console.log(enrichedData);

    return NextResponse.json({ items: enrichedData });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch prices", message: error },
      { status: 500 }
    );
  }
}
