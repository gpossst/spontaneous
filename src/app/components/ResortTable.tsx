"use client";

import React, { useState, useEffect } from "react";
import { EnrichedPrice } from "@/types/enriched_price";
import { FaSort, FaSortUp, FaSortDown, FaMapMarkerAlt } from "react-icons/fa";
import Load from "@/components/Load";
import DirectionsBtn from "./DirectionsBtn";
import { FaChevronRight } from "react-icons/fa";
import { format, parse } from "date-fns";

type SortConfig = {
  key: keyof EnrichedPrice;
  direction: "asc" | "desc";
} | null;

export default function ResortTable() {
  const [prices, setPrices] = useState<EnrichedPrice[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setLoading(true);
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const startTime = Date.now();
    const MAX_POLL_TIME = 60000; // 60 seconds

    const pollGetEndpoint = async () => {
      try {
        const response = await fetch(`/api/prices/get?date=${formattedDate}`);
        const data = await response.json();

        if (response.status === 202) {
          // Check if we've exceeded the polling time limit
          if (Date.now() - startTime >= MAX_POLL_TIME) {
            console.log("Polling timeout reached");
            setPrices([]);
            setLoading(false);
            return;
          }
          // If still processing and within time limit, wait 2 seconds and try again
          await new Promise((resolve) => setTimeout(resolve, 4000));
          return pollGetEndpoint();
        }

        setPrices(data.items || []);
        setLoading(false);
      } catch (error) {
        console.error("Error polling prices:", error);
        setPrices([]);
        setLoading(false);
      }
    };

    const fetchPrices = async () => {
      console.log("fetching prices");
      try {
        const response = await fetch(`/api/prices?date=${formattedDate}`);

        if (response.status === 202) {
          // If status is 202, switch to polling the get endpoint
          return pollGetEndpoint();
        }

        const data = await response.json();
        setPrices(data.items || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prices:", error);
        setPrices([]);
        setLoading(false);
      }
    };

    fetchPrices();

    // Cleanup function to prevent memory leaks
    return () => {
      setLoading(false);
    };
  }, [selectedDate]);

  const sortData = (key: keyof EnrichedPrice) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    const sortedData = [...prices].sort((a, b) => {
      // Special handling for price sorting
      if (key === "price") {
        // If either price is -1, move it to the end
        if (a.price === -1) return 1;
        if (b.price === -1) return -1;
      }

      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setPrices(sortedData);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof EnrichedPrice) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="ml-2 h-4 w-4" />
    ) : (
      <FaSortDown className="ml-2 h-4 w-4" />
    );
  };

  const filteredPrices = prices.filter((price) =>
    price.resort_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    const newDate = parse(
      dateString + "T12:00:00",
      "yyyy-MM-dd'T'HH:mm:ss",
      new Date()
    );
    setSelectedDate(newDate);
  };

  return (
    <div className="w-full">
      <div className="sticky top-0 z-50 mb-4 bg-white">
        <div className="bg-white h-4"></div>
        <div className="flex flex-col sm:flex-row gap-2 items-center bg-gray-100 rounded-md p-2 shadow-md">
          <div className="flex flex-row gap-2 items-center">
            <div className="hidden sm:block font-roboto">
              Perfect your search:
            </div>
            <div className="flex flex-row gap-2">
              <input
                type="date"
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={handleDateChange}
                className="border rounded-md font-roboto text-sm p-2 bg-gray-100 transition-colors duration-300 border-gray-300"
              />
              <button
                className={`border rounded-md flex flex-row items-center font-roboto text-sm p-2 hover:bg-gray-100 transition-colors duration-300 ${
                  sortConfig?.key === "resort_name"
                    ? "border-sky-500"
                    : "border-gray-300"
                }`}
                onClick={() => sortData("resort_name")}
              >
                Name {getSortIcon("resort_name")}
              </button>
              <button
                className={`border rounded-md flex flex-row  font-roboto text-sm p-2 hover:bg-gray-100 transition-colors duration-300 ${
                  sortConfig?.key === "price"
                    ? "border-sky-500"
                    : "border-gray-300"
                }`}
                onClick={() => sortData("price")}
              >
                Price {getSortIcon("price")}
              </button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Find a resort..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 w-full sm:w-auto text-sm border rounded-md border-gray-300"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col justify-center items-center h-full">
          <div className="text-sm text-sky-500">
            Don&apos;t worry, it&apos;s working. We don&apos;t have any records
            for that date yet, so it&apos;ll take a moment to get everything
            ready.
          </div>
          <Load />
        </div>
      ) : (
        <div className="mt-4 px-4 w-full">
          {filteredPrices.map((price) => (
            <div
              key={price.id}
              onClick={() => window.open(price.links, "_blank")}
              className="mb-2 p-4 border justify-between flex rounded-lg shadow-sm hover:cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-lg">{price.resort_name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="text-sky-500">
                      <FaMapMarkerAlt />
                    </span>
                    {price.state}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  Learn More{" "}
                  <span className="text-sky-500">
                    <FaChevronRight size={12} />
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <div className="text-lg font-bold">
                  {price.price === -1 ? (
                    <span className="text-red-500">Unavailable</span>
                  ) : (
                    `$${price.price}`
                  )}
                </div>
                <DirectionsBtn
                  lat={price.location.lat}
                  lng={price.location.lng}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
