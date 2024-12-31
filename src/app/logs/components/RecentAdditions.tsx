import React from "react";

export default function RecentAdditions() {
  const data = [
    {
      mountain: "Wachusett Mountain",
      date: "2024-12-30",
    },
    {
      mountain: "Mad River Glen",
      date: "2024-12-29",
    },
    {
      mountain: "Magic Mountain",
      date: "2024-12-29",
    },
    {
      mountain: "Killington Ski Resort",
      date: "2024-12-28",
    },
  ];
  return (
    <div className="">
      <h1 className="text-xl font-semibold font-roboto bg-gray-300 rounded-t-md p-2">
        Recent Additions
      </h1>
      <div className="flex flex-col font-roboto bg-gray-100 p-2 rounded-b-md divide-y">
        {data.map((item) => (
          <div className="flex justify-between p-2 gap-4" key={item.mountain}>
            <h2>{item.mountain}</h2>
            <p>{new Date(item.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
