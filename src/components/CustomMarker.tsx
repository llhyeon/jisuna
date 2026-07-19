import type { AddressPoint } from "@/schemas/addressSchema";
import { useMapStore } from "@/store/useMapStore";
import dataKeyFormatter from "@/utils/dataKeyFormatter";
import { CustomOverlayMap } from "react-kakao-maps-sdk";

const GROUP_COLORS = [
  { bg: "bg-gray-500", border: "border-gray-200", text: "text-gray-600" },
  { bg: "bg-red-500", border: "border-red-200", text: "text-red-600" },
  { bg: "bg-blue-500", border: "border-blue-200", text: "text-blue-600" },
  { bg: "bg-green-500", border: "border-green-200", text: "text-green-600" },
  { bg: "bg-purple-500", border: "border-purple-200", text: "text-purple-600" },
  { bg: "bg-amber-700", border: "border-amber-200", text: "text-amber-800" },
  { bg: "bg-pink-500", border: "border-pink-200", text: "text-pink-600" },
  { bg: "bg-yellow-400", border: "border-yellow-200", text: "text-yellow-600" },
  { bg: "bg-cyan-400", border: "border-cyan-200", text: "text-cyan-600" },
  { bg: "bg-teak-400", border: "border-teal-200", text: "text-teal-600" },
  { bg: "bg-indigo-400", border: "border-indigo-200", text: "text-indigo-600" },
];

function CustomMarker({ addrGroups }: { addrGroups: AddressPoint[] }) {
  const openModal = useMapStore((s) => s.openModal);

  const standardAddr = addrGroups[0];
  const groupStyle = GROUP_COLORS[standardAddr.groupId];

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
            return (
              <div key={addr.id}>
                <span className={`${groupStyle.text} mr-1`}>
                  [{formmatedAddr.groupId ? `${formmatedAddr.groupId}조` : "미배정"}]
                </span>
                <span className="text-gray-700">{formmatedAddr.householder}</span>
              </div>
            );
          })}
        </div>

        {/* CSS로 만든 동그란 핀 (이미지 대체) */}
        <div
          className={`w-5 h-5 rounded-full border-[3px] shadow-md ${groupStyle.bg} border-white relative`}>
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
