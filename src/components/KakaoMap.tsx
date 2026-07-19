/// <reference types="kakao.maps.d.ts" />

import CustomMarker from "@/components/CustomMarker";
import useGeolocation from "@/hooks/useGeolocation";
import type { AddressPoint } from "@/schemas/addressSchema";
import { useMapStore } from "@/store/useMapStore";
import { Map } from "react-kakao-maps-sdk";

interface KakaoMapProps {
  onMapLoad?: () => void;
}

function KakaoMap({ onMapLoad }: KakaoMapProps) {
  const { location } = useGeolocation();

  const addresses = useMapStore((s) => s.addresses);
  const visitDay = useMapStore((s) => s.visitDay);
  const searchText = useMapStore((s) => s.searchText);

  const addressGroups = Object.values(
    addresses
      .filter(
        (addr) =>
          visitDay.includes(addr.visitDay) &&
          addr.householder.toLowerCase().includes(searchText.trim()),
      )
      .reduce(
        (acc, cur) => {
          const key = `${cur.lat.toFixed(6)}_${cur.lng.toFixed(6)}`;

          if (!acc[key]) acc[key] = [];

          acc[key].push(cur);

          return acc;
        },
        {} as Record<string, AddressPoint[]>,
      ),
  );

  return (
    <Map
      onCreate={() => {
        onMapLoad?.();
      }}
      center={location}
      level={3}
      style={{ width: "100%", height: "100vh" }}>
      {addressGroups.map((addrGroups) => (
        <CustomMarker key={addrGroups[0].id} addrGroups={addrGroups} />
      ))}
    </Map>
  );
}

export default KakaoMap;
