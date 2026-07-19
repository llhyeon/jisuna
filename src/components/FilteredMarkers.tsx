import CustomMarker from "@/components/CustomMarker";
import type { AddressPoint } from "@/schemas/addressSchema";
import { useMapStore } from "@/store/useMapStore";

function FilteredMarkers() {
  const addresses = useMapStore((s) => s.addresses);
  const visitDay = useMapStore((s) => s.visitDay);
  const searchText = useMapStore((s) => s.searchText);

  const normalizedSearchText = searchText.trim().toLowerCase();

  const addressGroups = Object.values(
    addresses
      .filter(
        (addr) =>
          visitDay.includes(addr.visitDay) &&
          addr.householder.toLowerCase().includes(normalizedSearchText),
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
    <>
      {addressGroups.map((addrGroups) => (
        <CustomMarker key={addrGroups[0].id} addrGroups={addrGroups} />
      ))}
    </>
  );
}

export default FilteredMarkers;
