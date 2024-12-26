"use client";

import React, { useState, useEffect } from "react";
import { EnrichedPrice } from "@/types/enriched_price";
import { FaSort, FaSortUp, FaSortDown, FaMapMarkerAlt } from "react-icons/fa";
import Load from "@/components/Load";
import DirectionsBtn from "./DirectionsBtn";
import { FaChevronRight } from "react-icons/fa";

type SortConfig = {
  key: keyof EnrichedPrice;
  direction: "asc" | "desc";
} | null;

export default function ResortTable() {
  const [prices, setPrices] = useState<EnrichedPrice[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prices")
      .then((res) => res.json())
      .then((data) => {
        setPrices(data.items);
        setLoading(false);
      });
  }, []);

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

  return (
    <div className="w-full">
      <div className="sticky top-0 z-50 mb-4 bg-white">
        <div className="bg-white h-4"></div>
        <div className="flex gap-2 items-center bg-gray-100 rounded-md p-2 shadow-md">
          <div className="flex flex-row gap-2 items-center">
            <div>Sort by:</div>
            <div className="flex flex-row gap-2">
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
            className="flex-1 p-2 text-sm border rounded-md border-gray-300"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
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
                <div className="text-lg font-bold">${price.price}</div>
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
