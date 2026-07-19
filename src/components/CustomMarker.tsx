import { GROUP_OPTIONS } from "@/data/constants";
import type { AddressPoint } from "@/schemas/addressSchema";
import { useMapStore } from "@/store/useMapStore";
import dataKeyFormatter from "@/utils/dataKeyFormatter";
import { CustomOverlayMap } from "react-kakao-maps-sdk";

function CustomMarker({ addrGroups }: { addrGroups: AddressPoint[] }) {
  const openModal = useMapStore((s) => s.openModal);

  const standardAddr = addrGroups[0];
  const groupStyle = GROUP_OPTIONS.find((opt) => opt.id === standardAddr.groupId);

  return (
    <CustomOverlayMap
      position={{ lat: standardAddr.lat, lng: standardAddr.lng }}
      yAnchor={1}
      zIndex={10}>
      <button
        className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
        onClick={() => openModal(addrGroups)}>
        {/* 텍스트 말풍선 */}
        <div className="bg-white/95 px-2.5 py-1 rounded-md shadow-sm border border-gray-100 text-xs font-bold whitespace-nowrap mb-1">
          {addrGroups.map((addr) => {
            const formmatedAddr = dataKeyFormatter<AddressPoint>(addr);

            const groupOption = GROUP_OPTIONS.find((opt) => opt.id === formmatedAddr.groupId);
            return (
              <div key={addr.id}>
                <span className={`${groupStyle?.color?.text} mr-1`}>
                  {`[${groupOption?.label ?? "미배정"}(${groupOption?.leader ?? "없음"})]`}
                </span>
                <span className="text-gray-700">{formmatedAddr.householder}</span>
              </div>
            );
          })}
        </div>

        {/* CSS로 만든 동그란 핀 (이미지 대체) */}
        <div
          className={`w-5 h-5 rounded-full border-[3px] shadow-md ${groupStyle?.color.bg} border-white relative`}>
          {/* 핀 아래 뾰족한 꼬리 부분 */}
          <div
            className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[6px] border-t-white`}
          />
        </div>
      </button>
    </CustomOverlayMap>
  );
}

export default CustomMarker;
