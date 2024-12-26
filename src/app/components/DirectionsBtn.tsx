import React from "react";
import Link from "next/link";
import { FaDirections } from "react-icons/fa";

export default function DirectionsBtn({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  return (
    <Link
      href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
      target="_blank"
      className="bg-sky-500 text-white p-2 rounded-md"
    >
      <FaDirections />
    </Link>
  );
}
