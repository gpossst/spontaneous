import React from "react";
import RecentAdditions from "./components/RecentAdditions";
import Roadmap from "./components/Roadmap";
import Post from "./components/Post";
export default function page() {
  return (
    <div className="flex gap-4 h-full w-full px-4 mt-4">
      <div className="flex flex-[2] flex-col gap-4 w-full">
        <RecentAdditions />
        <Roadmap />
      </div>
      <Post />
    </div>
  );
}
