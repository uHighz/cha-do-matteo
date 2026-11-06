"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type YouTubePlayer = {
  playVideo(): void;
  pauseVideo(): void;
  setVolume(volume: number): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      width: number;
      height: number;
      playerVars: Record<string, number | string>;
      events: {
        onReady: (event: { target: YouTubePlayer }) => void;
        onStateChange: (event: { data: number }) => void;
        onAutoplayBlocked: () => void;
      };
    },
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
  }
}

const VIDEO_ID = "1BZkYfqa4Fs";

export function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [playbackHint, setPlaybackHint] = useState("Carregando o player do YouTube…");
  const [volume, setVolume] = useState(45);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    if (!open || !apiReady || !host.current || !window.YT?.Player || player.current) return;
    const instance = new window.YT.Player(host.current, {
      videoId: VIDEO_ID,
      width: 200,
      height: 200,
      playerVars: {
        autoplay: 1,
        controls: 0,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin,
        rel: 0,
      },
      events: {
        onReady: event => {
          player.current = event.target;
          event.target.setVolume(45);
          setPlayerReady(true);
          event.target.playVideo();
        },
        onStateChange: event => setPlaying(event.data === 1),
        onAutoplayBlocked: () => setPlaybackHint("Seu navegador bloqueou o início automático. Toque em Tocar música."),
      },
    });
    player.current = instance;
    return () => {
      instance.destroy();
      player.current = null;
      setPlayerReady(false);
      setPlaying(false);
    };
  }, [apiReady, open]);

  function changeVolume(value: number) {
    setVolume(value);
    if (value > 0 && muted) {
      player.current?.unMute();
      setMuted(false);
    }
    player.current?.setVolume(value);
  }

  function toggleMute() {
    if (muted) player.current?.unMute();
    else player.current?.mute();
    setMuted(!muted);
  }

  return (
    <aside className="music-widget" aria-label="Música do convite">
      <button className="music-widget-toggle" type="button" aria-expanded={open} onClick={() => setOpen(value => !value)}>
        <span aria-hidden="true">♫</span> {open ? "Fechar música" : "Ouvir música"}
      </button>
      {open && (
        <section className="music-widget-panel" aria-label="Controles de Beautiful Boy">
          <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" onReady={() => setApiReady(true)} />
          <div className="music-widget-heading">
            <div><strong>Beautiful Boy</strong><span>John Lennon</span></div>
            <button className="music-widget-close" type="button" aria-label="Fechar controles de música" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="music-widget-video" aria-label="Vídeo oficial incorporado do YouTube">
            <div ref={host} />
          </div>
          <div className="music-widget-controls">
            <button className="music-widget-play" type="button" disabled={!playerReady} onClick={() => playing ? player.current?.pauseVideo() : player.current?.playVideo()}>
              {playing ? "Pausar" : "Tocar música"}
            </button>
            <button className="music-widget-mute" type="button" disabled={!playerReady} onClick={toggleMute}>
              {muted ? "Ativar som" : "Silenciar"}
            </button>
          </div>
          <label className="music-widget-volume">Volume <input type="range" min="0" max="100" value={volume} aria-label="Volume da música" disabled={!playerReady} onChange={event => changeVolume(Number(event.target.value))} /></label>
          <p className="music-widget-hint" role="status">{playerReady ? playbackHint : "Carregando o player do YouTube…"}</p>
        </section>
      )}
    </aside>
  );
}
