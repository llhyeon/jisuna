import type { AddressPoint } from "@/schemas/addressSchema";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  address: AddressPoint;
}

export function SortableCard({ address }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: address.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // 드래그 중일 때는 반투명하게
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex w-full items-center justify-between p-3 mb-2 bg-white rounded-lg shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing select-none touch-none
        ${isDragging ? "ring-2 ring-blue-400 scale-105" : ""}`}>
      <div className="flex-1">
        <h4 className="font-bold text-sm">{address.householder}</h4>
        {/* 툴팁이나 상세 정보를 위한 여백 */}
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{address.address}</p>
      </div>
      <div
        {...attributes}
        {...listeners}
        className="flex flex-col gap-1 shrink-0"
        aria-label="카드 이동 손잡이">
        <div className="w-4 bg-gray-200 h-0.5"></div>
        <div className="w-4 bg-gray-200 h-0.5"></div>
        <div className="w-4 bg-gray-200 h-0.5"></div>
      </div>
    </div>
  );
}
