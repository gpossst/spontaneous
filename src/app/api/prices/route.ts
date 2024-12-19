import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  "https://brmufhutiividludfkbt.supabase.co",
  process.env.SUPABASE_KEY!
);

const EXTERNAL_API = "http://spontaneouslambda-production-8d68.up.railway.app";

// Helper function to format the external API data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatExternalData(externalData: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    Object.entries(externalData.results)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map(([resort, data]: [string, any]) => {
        return {
          price:
            typeof data.price === "string"
              ? parseInt(data.price.replace("$", ""))
              : null,
          resort_name: resort,
          resort_id: data.id,
          date: today.toISOString(),
        };
      })
      .filter((item) => item.price !== null)
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const range = searchParams.get("range") || "50";

    // If location is provided, filter by distance
    if (lat && lng) {
      const { data: nearbyData, error: nearbyError } = await supabase.rpc(
        "nearby_resorts",
        {
          user_lat: parseFloat(lat),
          user_lng: parseFloat(lng),
          radius_km: parseFloat(range),
        }
      );

      if (nearbyError) throw nearbyError;

      // If no data found, fetch from external API and cache it
      if (!nearbyData || nearbyData.length === 0) {
        const response = await fetch(EXTERNAL_API);
        if (!response.ok) throw new Error("Failed to fetch from external API");

        const externalData = await response.json();
        const formattedData = formatExternalData(externalData);

        // Insert the new data into Supabase
        const { error: insertError } = await supabase
          .from("prices")
          .insert(formattedData);

        if (insertError) throw insertError;

        // Retry the nearby query with new data
        const { data: updatedData, error: retryError } = await supabase.rpc(
          "nearby_resorts",
          {
            user_lat: parseFloat(lat),
            user_lng: parseFloat(lng),
            radius_km: parseFloat(range),
          }
        );

        if (retryError) throw retryError;
        return NextResponse.json({ items: updatedData }, { status: 200 });
      }

      return NextResponse.json({ items: nearbyData }, { status: 200 });
    }

    // If no location provided, fetch all prices
    const { data, error } = await supabase.from("prices").select("*");

    if (error) throw error;

    // If no data found, fetch from external API and cache it
    if (!data || data.length === 0) {
      const response = await fetch(EXTERNAL_API);
      if (!response.ok) throw new Error("Failed to fetch from external API");

      const externalData = await response.json();
      const formattedData = formatExternalData(externalData);

      // Insert the new data into Supabase
      const { error: insertError } = await supabase
        .from("prices")
        .insert(formattedData);

      if (insertError) throw insertError;

      // Return the newly inserted data
      return NextResponse.json({ items: formattedData }, { status: 200 });
    }

    return NextResponse.json({ items: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
