"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="absolute top-0 left-0 bg-white/50 backdrop-blur-sm flex justify-center items-center h-screen w-full z-[999]">
      <div className="bg-white p-3 rounded-sm shadow-lg shadow-black/20">
        <Image
          src="/loading-spinner.svg"
          alt="Loading"
          width={50}
          height={50}
        />
      </div>
    </div>
  );
}
