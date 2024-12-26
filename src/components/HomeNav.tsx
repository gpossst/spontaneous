import React from "react";
import Link from "next/link";
import Logo from "./Logo";
export default function HomeNav() {
  return (
    <div className="flex w-full justify-between items-center pt-4 px-4">
      <Logo />
      <Link
        className="text-lg border-2 font-roboto text-sky-500 border-sky-500 rounded-lg px-4 py-2 hover:bg-sky-300 hover:border-sky-300 hover:text-white transition-colors"
        href="/vote"
      >
        Vote
      </Link>
    </div>
  );
}
