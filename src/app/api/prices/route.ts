import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  "https://brmufhutiividludfkbt.supabase.co",
  process.env.SUPABASE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];
    const EXTERNAL_API = "http://spontaneouslambda-production.up.railway.app";

    const response = await supabase.from("prices").select("*").eq("date", date);
    if (response.error) {
      throw new Error("Failed to fetch prices");
    }

    if (response.data.length == 0) {
      const externalResponse = await fetch(`${EXTERNAL_API}?date=${date}`);
      const externalData = await externalResponse.json();
      await supabase.from("prices").insert(externalData.results);
      return NextResponse.json(externalData.results);
    }

    // Get unique resort_ids from the response data
    const resortIds = [...new Set(response.data.map((item) => item.resort_id))];

    console.log(resortIds);
    // Fetch links for all resort_ids
    const linksResponse = await supabase.rpc(
      "get_resort_links_location_state_region",
      {
        resort_ids: resortIds,
      }
    );

    console.log(linksResponse);
    if (linksResponse.error) {
      console.log(linksResponse.error);
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
    console.error("Error fetching prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
