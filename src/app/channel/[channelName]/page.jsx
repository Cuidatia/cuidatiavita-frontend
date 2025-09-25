"use client";

import dynamic from "next/dynamic";

const Call = dynamic(() => import("@/components/Call"), { ssr: false });

export default function Page({ params }) {
const { channelName } = params;
  return (
    <main className="flex w-full flex-col">
      <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
        {channelName}
      </p>
      <Call appId={process.env.NEXT_PUBLIC_AGORA_APP_ID} channelName={params?.channelName} />
    </main>
  );
}