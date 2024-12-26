"use client";

import React, { useState, useEffect } from "react";
import { FaCaretUp } from "react-icons/fa";

export default function IncrementBtn({
  id,
  votes,
}: {
  id: string;
  votes: number;
}) {
  const [voteCount, setVoteCount] = useState(votes);
  const [clicked, setClicked] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    if (clicked) {
      setShowBackground(true);
    }
  }, [clicked]);

  const handleIncrement = (e: React.MouseEvent) => {
    if (!clicked) {
      const button = e.currentTarget.getBoundingClientRect();
      setCoords({
        x: e.clientX - button.left,
        y: e.clientY - button.top,
      });
      setVoteCount(voteCount + 1);
      setClicked(true);
      fetch(`/api/new_resorts/inc`, {
        method: "POST",
        body: JSON.stringify({ resort_id: id }),
      });
    }
  };

  return (
    <button
      onClick={handleIncrement}
      className={`px-2 py-1 border-2 rounded-md border-sky-500 flex flex-col items-center justify-center gap-0 min-w-[50px] transition-colors duration-100 relative overflow-hidden ${
        clicked
          ? "text-white"
          : "text-sky-500 hover:bg-sky-200 hover:text-white hover:border-sky-200"
      }`}
    >
      {clicked && (
        <span
          className="absolute rounded-full bg-sky-500"
          style={{
            left: coords.x,
            top: coords.y,
            transform: "translate(-50%, -50%)",
            width: showBackground ? "300px" : "0px",
            height: showBackground ? "300px" : "0px",
            transition: "width 1s ease-out, height 1s ease-out",
          }}
        />
      )}
      <FaCaretUp className="mx-auto relative z-10" />
      <div className="text-sm font-roboto text-center w-full relative z-10">
        {voteCount}
      </div>
    </button>
  );
}
