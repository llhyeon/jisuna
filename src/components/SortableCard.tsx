import { VISIT_DAY_OPTIONS } from "@/data/constants";
import type { AddressPoint } from "@/schemas/addressSchema";

interface Props {
  address: AddressPoint;
}

export function SortableCard({ address }: Props) {
  const visitDayOption = VISIT_DAY_OPTIONS[address.visitDay];

  return (
    <div
      className={`flex w-full items-center justify-between p-3 mb-2 bg-white rounded-lg shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing select-none touch-none`}>
      <div className="flex-1">
        <div className="flex items-center">
          <h4 className="font-bold text-sm">{address.householder} </h4>
          <span className="text-[10px] ml-2 text-gray-500">{address.phoneNumber}</span>
          <span className={`ml-auto text-xs ${visitDayOption.color}`}>{visitDayOption.label}</span>
        </div>
        {/* 툴팁이나 상세 정보를 위한 여백 */}
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{address.address}</p>
      </div>
    </div>
  );
}
