/// <reference types="kakao.maps.d.ts" />

import FilteredMarkers from "@/components/FilteredMarkers";
import useGeolocation from "@/hooks/useGeolocation";
import { useMapStore } from "@/store/useMapStore";
import { Map } from "react-kakao-maps-sdk";

interface KakaoMapProps {
  onMapLoad?: () => void;
}

function KakaoMap({ onMapLoad }: KakaoMapProps) {
  const { location } = useGeolocation();
  const setKakaoMap = useMapStore((s) => s.setKakaoMap);

  return (
    <Map
      onCreate={(map: kakao.maps.Map) => {
        setKakaoMap(map);
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
