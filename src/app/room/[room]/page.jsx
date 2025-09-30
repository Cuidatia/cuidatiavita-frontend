import { useEffect, useRef, useState } from "react";

export default function RoomPage({ params }) {
  const containerRef = useRef(null);
  const [meetUrl, setMeetUrl] = useState(null);

  useEffect(() => {
    const crearSala = async () => {
      try {
        const res = await fetch("/api/crear-meeting", {
          method: "POST",
          headers: {"Content-Type": "application/json",},
          body: JSON.stringify({ id_usuario: params.idUsuario }),
        });

        const data = await res.json();
        if (data.meet_url) {
          setMeetUrl(data.meet_url);

          if (containerRef.current) {
            new window.JitsiMeetExternalAPI("meet.jit.si", {roomName: data.nombre_canal, parentNode: containerRef.current, width: "100%", height: 600,});
          }
        }
      } catch (err) {
        console.error("Error al crear sala:", err);
      }
    };

    crearSala();
  }, [params.idUsuario]);

  return (
    <div>
      <div ref={containerRef} className="w-full h-[600px]" />
      {meetUrl && (
        <p className="mt-2 text-blue-600">
          Enlace de la sala:{" "}
          <a href={meetUrl} target="_blank" rel="noreferrer">
            {meetUrl}
          </a>
        </p>
      )}
    </div>
  );
}