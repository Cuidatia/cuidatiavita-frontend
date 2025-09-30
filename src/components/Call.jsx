"use client"
import { useEffect, useRef, useState } from "react";

export default function JitsiRoom({ roomName }) {
  const containerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  // Confirmamos que estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && roomName && containerRef.current && window.JitsiMeetExternalAPI) {
      new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName,
        parentNode: containerRef.current,
        width: "100%",
        height: 600,
      });
    }
  }, [isClient, roomName]);

  return <div ref={containerRef} className="w-full h-[600px]" />;
}