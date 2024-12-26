import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://brmufhutiividludfkbt.supabase.co",
  process.env.SUPABASE_KEY!
);

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  const allowedDomains =
    process.env.NODE_ENV === "development" ? ["localhost:3000"] : ["ski.app"];

  if (
    !allowedDomains.some(
      (domain) => origin?.includes(domain) || referer?.includes(domain)
    )
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { resort_id } = await request.json();
    const { error } = await supabase.rpc("increment", {
      resort_id: resort_id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.error("Error in API route:", error); // Add this log
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
