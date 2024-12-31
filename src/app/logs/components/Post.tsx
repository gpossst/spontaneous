import React from "react";

export default function Post() {
  const posts = [
    {
      title: "Epic Pass Difficulties",
      date: "2024-12-30",
      content:
        "Here's a quick explanation of what's going on with Epic Pass resorts. Basically, Epic Pass resort websites implement a queue/captcha system that makes things for us way harder. We're currently looking at solutions such as changing our scraping library, force-completing the captcha, and simply retrying at a later time. We'll stay in touch here with updates. Thanks for your support!",
    },
  ];
  return (
    <div className="flex flex-[5] w-full flex-col h-full">
      <h1 className="text-xl w-full font-semibold font-roboto bg-gray-300 rounded-t-md p-2">
        Posts
      </h1>
      <div className="flex flex-col p-4 h-full font-roboto justify-center items-center bg-gray-100 rounded-b-md divide-y">
        {posts.map((post) => (
          <div className="flex flex-col w-full gap-2 " key={post.title}>
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold text-sky-500">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
            <p className="">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
