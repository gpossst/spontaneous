import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://brmufhutiividludfkbt.supabase.co",
  process.env.SUPABASE_KEY!
);
export async function GET() {
  try {
    const { data, error } = await supabase.from("future_resorts").select("*");

    if (error) {
      throw error;
    }

    return NextResponse.json({ items: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch prices", message: error },
      { status: 500 }
    );
  }
}
