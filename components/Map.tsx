"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type JobMarker = {
  id: string;
  company: string | null;
  title: string | null;
  lat?: number | null;
  lng?: number | null;
  location_text?: string | null;
  score?: number | null;
};

declare global {
  interface Window {
    google?: any;
  }
}

function waitForGoogleMaps(timeoutMs = 15000) {
  return new Promise<void>((resolve, reject) => {
    const t0 = Date.now();
    const tick = () => {
      if (window.google?.maps) return resolve();
      if (Date.now() - t0 > timeoutMs) return reject(new Error("Google Maps load timeout"));
      requestAnimationFrame(tick);
    };
    tick();
  });
}

export default function Map({
  jobs = [],
  variant = "card",
  selectedJobId = null,
  onSelectJob,
}: {
  jobs?: JobMarker[];
  variant?: "card" | "hero";
  selectedJobId?: string | null;
  onSelectJob?: (id: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const markersByIdRef = useRef<Record<string, any>>({});
  const jobsByIdRef = useRef<Record<string, JobMarker>>({});
  const infoRef = useRef<any>(null);

  const [ready, setReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const containerStyle = useMemo<React.CSSProperties>(() => {
    const base: React.CSSProperties =
      variant === "hero"
        ? {
            width: "100%",
            height: "100%",
            marginTop: 0,
            borderRadius: 0,
            overflow: "hidden",
            border: "none",
          }
        : {
            width: "100%",
            height: 360,
            marginTop: 28,
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid #eee",
          };

    return {
      ...base,
      opacity: ready ? 1 : 0,
      transition: "opacity 220ms ease",
      background: "#f3f3f3",
    };
  }, [variant, ready]);

  function popupHtml(job: JobMarker) {
    const company = job.company ?? "Unknown Company";
    const title = job.title ?? "Untitled Role";
    const loc = job.location_text ? `📍 ${job.location_text}` : "";
    const score = typeof job.score === "number" ? `⭐ ${job.score}/100` : "";

    return `
      <div style="font-weight:750; line-height:1.25; min-width:240px">
        <div style="font-size:14px">${company}</div>
        <div style="font-size:13px; opacity:.80; margin-top:6px">${title}</div>
        ${
          loc || score
            ? `<div style="font-size:12px; opacity:.78; margin-top:8px; display:flex; gap:10px; flex-wrap:wrap">
                 ${loc ? `<span>${loc}</span>` : ""}
                 ${score ? `<span>${score}</span>` : ""}
               </div>`
            : ""
        }
      </div>
    `;
  }

  function applyPrototypePadding(map: any) {
    if (variant !== "hero") {
      map.setOptions({ padding: 0 });
      return;
    }
    map.setOptions({
      padding: { top: 92, right: 32, bottom: 110, left: 32 },
    });
  }

  function openInfoForJobId(id: string) {
    const map = mapInstanceRef.current;
    if (!map) return;

    const marker = markersByIdRef.current[id];
    const job = jobsByIdRef.current[id];
    if (!marker) return;

    if (!infoRef.current) {
      infoRef.current = new window.google.maps.InfoWindow({ disableAutoPan: true });
    }

    infoRef.current.close();
    if (job) infoRef.current.setContent(popupHtml(job));
    infoRef.current.open({ map, anchor: marker });
  }

  useEffect(() => {
    let cancelled = false;
    let idleListener: any = null;

    async function initOrUpdate() {
      setMapError(null);

      try {
        await waitForGoogleMaps();
        if (cancelled) return;
        if (!mapRef.current) return;

        const g = window.google;

        // Only use mapId if it's a REAL Map ID (otherwise leave blank)
        const MAP_ID = (process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "").trim();

        if (!mapInstanceRef.current) {
          const options: any = {
            center: { lat: 40.7128, lng: -74.006 },
            zoom: 10,
            ...(MAP_ID ? { mapId: MAP_ID } : {}),

            disableDefaultUI: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,

            zoomControl: true,
            zoomControlOptions: { position: g.maps.ControlPosition.RIGHT_CENTER },

            clickableIcons: false,
            gestureHandling: "greedy",
          };

          mapInstanceRef.current = new g.maps.Map(mapRef.current, options);

          infoRef.current = new g.maps.InfoWindow({ disableAutoPan: true });

          applyPrototypePadding(mapInstanceRef.current);

          idleListener = g.maps.event.addListenerOnce(mapInstanceRef.current, "idle", () => {
            if (!cancelled) setReady(true);
          });
        } else {
          applyPrototypePadding(mapInstanceRef.current);
        }

        const map = mapInstanceRef.current;

        // index jobs
        jobsByIdRef.current = {};
        jobs.forEach((j) => (jobsByIdRef.current[j.id] = j));

        // clear markers
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        markersByIdRef.current = {};

        const bounds = new g.maps.LatLngBounds();
        let hasAny = false;

        jobs.forEach((job) => {
          const hasCoords = typeof job.lat === "number" && typeof job.lng === "number";
          if (!hasCoords) return;

          hasAny = true;
          const pos = { lat: job.lat as number, lng: job.lng as number };
          bounds.extend(pos);

          const marker = new g.maps.Marker({
            position: pos,
            map,
            title: `${job.company ?? "Company"} — ${job.title ?? "Role"}`,
          });

          markersRef.current.push(marker);
          markersByIdRef.current[job.id] = marker;

          marker.addListener("click", () => {
            const latest = jobsByIdRef.current[job.id] ?? job;

            if (!infoRef.current) {
              infoRef.current = new g.maps.InfoWindow({ disableAutoPan: true });
            }

            infoRef.current.close();
            infoRef.current.setContent(popupHtml(latest));
            infoRef.current.open({ map, anchor: marker });

            onSelectJob?.(job.id);
          });
        });

        if (hasAny) {
          map.fitBounds(bounds);

          g.maps.event.addListenerOnce(map, "bounds_changed", () => {
            const z = map.getZoom();
            if (typeof z === "number" && z > 14) map.setZoom(14);
          });
        } else {
          map.setCenter({ lat: 40.7128, lng: -74.006 });
          map.setZoom(10);
        }
      } catch (e: any) {
        if (!cancelled) setMapError(e?.message || "Google Maps failed to load");
      }
    }

    initOrUpdate();

    return () => {
      cancelled = true;

      // cleanup markers on unmount
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      markersByIdRef.current = {};

      try {
        if (idleListener && window.google?.maps?.event?.removeListener) {
          window.google.maps.event.removeListener(idleListener);
        }
      } catch {}
    };
  }, [jobs, onSelectJob, variant]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedJobId) return;

    const marker = markersByIdRef.current[selectedJobId];
    if (!marker) return;

    const pos = marker.getPosition?.();
    if (!pos) return;

    map.panTo(pos);

    const targetZoom = 13;
    const current = map.getZoom?.();
    if (typeof current === "number" && current < targetZoom) map.setZoom(targetZoom);

    const bounce = window.google?.maps?.Animation?.BOUNCE;
    if (bounce) marker.setAnimation(bounce);
    window.setTimeout(() => marker.setAnimation(null), 450);

    window.setTimeout(() => openInfoForJobId(selectedJobId), 120);
  }, [selectedJobId]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapRef} style={containerStyle} />

      {mapError ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
            textAlign: "center",
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ maxWidth: 520 }}>
            <div style={{ fontWeight: 950, fontSize: 16 }}>Map Error</div>

            <div style={{ marginTop: 8, opacity: 0.8, fontWeight: 700, lineHeight: 1.5 }}>
              {mapError}
            </div>

            <div style={{ marginTop: 10, opacity: 0.7, fontSize: 13, lineHeight: 1.5 }}>
              Most common causes: invalid/missing API key, billing not enabled, Maps JavaScript API not enabled,
              HTTP referrer restrictions not allowing your domain (localhost), or an invalid Map ID.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
