"use client";
import React, { useEffect, useState } from "react";
import { VoteRequest } from "@/types/vote_request";
import IncrementBtn from "./IncrementBtn";
import Load from "@/components/Load";
import { FaCircleInfo } from "react-icons/fa6";

export default function FullList() {
  const [data, setData] = useState<VoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("votes");

  useEffect(() => {
    fetch("/api/new_resorts").then((res) => {
      res.json().then((data) => {
        setData(data.items);
        setIsLoading(false);
      });
    });
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.resort_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAndFilteredData = filteredData.sort((a, b) => {
    switch (sortBy) {
      case "resort_name":
        return a.resort_name.localeCompare(b.resort_name);
      case "location":
        return a.location.localeCompare(b.location);
      case "votes":
        return b.votes - a.votes;
      default:
        return 0;
    }
  });

  return (
    <div>
      <div className="w-full">
        <div className="sticky top-0 z-50 mb-4 bg-white px-4">
          <div className="bg-white h-4"></div>
          <div className="flex gap-2 items-center bg-gray-100 rounded-md p-2 shadow-md">
            <div className="flex flex-row gap-2 items-center">
              <div>Filter:</div>
              <div className="flex flex-row gap-2">
                <button
                  className={`border rounded-md font-roboto text-sm p-2 hover:bg-gray-100 transition-colors duration-300 ${
                    sortBy === "resort_name"
                      ? "border-sky-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSortBy("resort_name")}
                >
                  Name
                </button>
                <button
                  className={`border rounded-md font-roboto text-sm p-2 hover:bg-gray-100 transition-colors duration-300 ${
                    sortBy === "location" ? "border-sky-500" : "border-gray-300"
                  }`}
                  onClick={() => setSortBy("location")}
                >
                  Location
                </button>
                <button
                  className={`border rounded-md font-roboto text-sm p-2 hover:bg-gray-100 transition-colors duration-300 ${
                    sortBy === "votes" ? "border-sky-500" : "border-gray-300"
                  }`}
                  onClick={() => setSortBy("votes")}
                >
                  Votes
                </button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Find a resort..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 text-sm border rounded-md border-gray-300"
            />
            <div className="relative group">
              <FaCircleInfo className="text-gray-500 cursor-help" />
              <div className="absolute hidden group-hover:block bg-white border border-gray-200 rounded-md p-2 shadow-lg w-[11.9rem] -right-2 top-6 text-sm">
                List sourced from{" "}
                <a
                  href="https://en.wikipedia.org/wiki/List_of_ski_areas_and_resorts_in_the_United_States"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Wikipedia
                </a>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Load />
          </div>
        ) : (
          <div className="flex flex-col divide-gray-300 px-8 divide-y">
            {sortedAndFilteredData.map((item) => (
              <div
                key={item.id}
                className="flex flex-row justify-between items-center py-2 font-roboto"
              >
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold">
                    {item.resort_name}
                  </div>
                  <div className="text-sm text-gray-500">{item.location}</div>
                </div>
                <IncrementBtn id={item.id} votes={item.votes} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
