"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="bg-white flex justify-center items-center h-screen">
      <Image src="/loading-spinner.svg" alt="Loading" width={50} height={50} />
    </div>
  );
}
