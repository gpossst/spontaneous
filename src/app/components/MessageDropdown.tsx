"use client";
import { useState } from "react";

interface MessageDropdownProps {
  message: string;
}

export default function MessageDropdown({ message }: MessageDropdownProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-200 p-2 z-50">
      <div className="mx-auto max-w-7xl flex items-center relative">
        <p className="text-sky-500 flex-grow text-center">{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="text-sky-500 hover:text-red-500 transition-color duration-100 absolute right-0"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
