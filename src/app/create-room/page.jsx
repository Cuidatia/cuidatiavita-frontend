"use client";

import { useState } from "react";

export default function CreateRoomPage() {
  const [meetUrl, setMeetUrl] = useState(null);
  const [nombreCanal, setNombreCanal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRoom = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "api/crear-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.user.token}`
         }
      });

      if (!res.ok) {
        throw new Error("Error al crear la sala");
      }

      const data = await res.json();
      setMeetUrl(data.meet_url);
      setNombreCanal(data.nombre_canal);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la sala");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={createRoom}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creando sala..." : "Crear sala"}
      </button>

      {error && <p className="mt-2 text-red-600">{error}</p>}

      {meetUrl && nombreCanal && (
        <div className="mt-4">
          <p>
            Sala creada: <strong>{nombreCanal}</strong>
          </p>
          <p>
            Enlace a la sala:{" "}
            <a href={meetUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">
              {meetUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}