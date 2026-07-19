/// <reference types="kakao.maps.d.ts" />

import FilteredMarkers from "@/components/FilteredMarkers";
import useGeolocation from "@/hooks/useGeolocation";
import { Map } from "react-kakao-maps-sdk";

interface KakaoMapProps {
  onMapLoad?: () => void;
}

function KakaoMap({ onMapLoad }: KakaoMapProps) {
  const { location } = useGeolocation();

  return (
    <Map
      onCreate={() => {
        onMapLoad?.();
      }}
      center={location}
      level={3}
      style={{ width: "100%", height: "100vh" }}>
      <FilteredMarkers />
    </Map>
  );
}

export default KakaoMap;
