"use client";
import { useState } from "react";

interface MessageDropdownProps {
  message: string;
}

export default function MessageDropdown({ message }: MessageDropdownProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-200 p-2 sm:p-3 md:p-4 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-2 sm:px-4 relative">
        <p className="text-sky-500 text-sm sm:text-base md:text-lg text-center flex-grow pr-8">
          {message}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="text-sky-500 hover:text-red-500 transition-color duration-100 absolute right-2 sm:right-4"
          aria-label="Close message"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
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
