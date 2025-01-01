import React from "react";
import Link from "next/link";
import Logo from "./Logo";
export default function HomeNav() {
  return (
    <div className="flex w-full items-center pt-4 px-4">
      <div className="flex-1">
        <Logo />
      </div>
      <h1 className="flex-1 text-center text-3xl font-pacifico font-bold text-sky-500">
        Lifty
      </h1>
      <div className="flex gap-4 flex-1 justify-end">
        <Link
          className="text-lg font-roboto text-sky-500 rounded-lg px-4 py-2"
          href="/logs"
        >
          Logs
        </Link>
        <Link
          className="text-lg border-2 font-roboto text-sky-500 border-sky-500 rounded-lg px-4 py-2 hover:bg-sky-300 hover:border-sky-300 hover:text-white transition-colors"
          href="/vote"
        >
          Vote
        </Link>
      </div>
    </div>
  );
}
