import { EnrichedPrice } from "@/types/enriched_price";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  "https://brmufhutiividludfkbt.supabase.co",
  process.env.SUPABASE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date =
    searchParams.get("date") || new Date().toISOString().split("T")[0];
  console.log(date);
  const response = await supabase.from("prices").select("*").eq("date", date);

  if (response.error) {
    return NextResponse.json(
      { error: response.error.message },
      { status: 500 }
    );
  }

  if (response.data.length === 0) {
    return NextResponse.json(
      { message: "Still fetching prices" },
      { status: 202 }
    );
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
  const enrichedData: EnrichedPrice[] = response.data.map((priceItem) => ({
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
}
