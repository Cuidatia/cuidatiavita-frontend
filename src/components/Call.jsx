"use client";

import { useEffect, useRef } from "react";

export default function Room({ roomName }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadJitsi = () => {
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => initJitsi();
        document.body.appendChild(script);
      } else {
        initJitsi();
      }
    };

    const initJitsi = () => {
      if (containerRef.current) {
        new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName,
          parentNode: containerRef.current,
          width: "100%",
          height: 600,
        });
      }
    };

    loadJitsi();
  }, [roomName]);

  return <div ref={containerRef} className="w-full h-[600px]" />;
}