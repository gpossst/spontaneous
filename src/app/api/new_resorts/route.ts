import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://brmufhutiividludfkbt.supabase.co",
  process.env.SUPABASE_KEY!
);
export async function GET() {
  try {
    const { data, error } = await supabase.from("future_resorts").select("*");

    console.log("Supabase Response:", { data, error }); // Add this log

    if (error) {
      console.error("Supabase Error:", error); // Add this log
      throw error;
    }

    return NextResponse.json({ items: data });
  } catch (error) {
    console.error("Error in API route:", error); // Add this log
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
