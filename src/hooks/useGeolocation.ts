import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

/* ------------------------------ 현재 위치를 가져오는 훅 ----------------------------- */

export default function useGeolocation() {
  const canNavigator = typeof navigator !== "undefined" && "geolocation" in navigator;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location>({
    lat: 37.5665,
    lng: 126.978,
  });

  useEffect(() => {
    if (!canNavigator) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        setIsLoading(false);
      },
      (err) => {
        setError(err instanceof Error ? err.message : "-");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  }, [canNavigator]);

  return { location, isLoading, error };
}
