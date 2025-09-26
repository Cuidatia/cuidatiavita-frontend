"use client";

import { useEffect, useState } from "react";
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";

function Call(props) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={props.channelName} AppID={props.appId} />
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4">
        <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </a>
      </div>
    </AgoraRTCProvider>
  );
}

function Videos({ AppID, channelName }) {
  const [token, setToken] = useState(null);
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers() || []; // aseguramos que sea array
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // Fetch token
  useEffect(() => {
    async function fetchToken() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tokenLlamadas?channel=${channelName}&uid=0`);
      const data = await res.json();
      setToken(data.token);
    }
    fetchToken();
  }, [channelName]);

  // useJoin seguro
  useJoin(token ? { appid: AppID, channel: channelName, token } : null);

  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Reproducir audio remoto de forma segura
  audioTracks?.forEach(track => track.play());

  if (isLoadingMic || isLoadingCam || !token) {
    return <div className="flex flex-col items-center pt-40">Loading devices...</div>;
  }

  const unit = "minmax(0, 1fr) ";

  return (
    <div className="flex flex-col justify-between w-full h-screen p-1">
      <div
        className="grid gap-1 flex-1"
        style={{
          gridTemplateColumns:
            remoteUsers.length > 9
              ? unit.repeat(4)
              : remoteUsers.length > 4
              ? unit.repeat(3)
              : remoteUsers.length > 1
              ? unit.repeat(2)
              : unit,
        }}
      >
        {localCameraTrack && <LocalVideoTrack track={localCameraTrack} play className="w-full h-full" />}
        {remoteUsers.map(user => user && <RemoteUser key={user.uid} user={user} />)}
      </div>
    </div>
  );
}

export default Call;
