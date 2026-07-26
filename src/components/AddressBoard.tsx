import { SortableCard } from "@/components/SortableCard";
import { GROUP_OPTIONS } from "@/data/constants";
import { useMapStore } from "@/store/useMapStore";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

function AddressBoard() {
  const [isOpen, setIsOpen] = useState(false);

  const addresses = useMapStore((s) => s.addresses);
  return (
    <div className="fixed z-50 shadow-lg overflow-scroll scrollbar-hide bottom-0 rounded-t-2xl w-full">
      <button
        className="py-2 w-20 bg-surface white rounded-t-2xl mx-auto flex justify-center"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="명단 토글 버튼">
        <ArrowUp className={`${isOpen ? "rotate-180" : ""} transition-transform duration-500`} />
      </button>
      <div
        className={`bg-surface flex gap-4 overflow-auto h-full rounded-t-2xl scrollbar-hide ${isOpen ? "max-h-[80dvh] p-2" : "max-h-0"} transition-[max-height] duration-300 ease-in-out`}>
        {GROUP_OPTIONS.map((group) => {
          const items = addresses.filter((addr) => addr.groupId === group.id);
          const targetOptions = GROUP_OPTIONS[group.id];
          return (
            <div
              key={group.id}
              className={`flex min-w-80 max-w-80 flex-col rounded-xl border-t-4 bg-gray-50 p-3 transition-colors
                ${targetOptions.color.border}`}>
              <div className="mb-4 flex items-center justify-between px-1">
                <h3 className="font-extrabold text-gray-700">{targetOptions.label}</h3>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-bold shadow-sm">
                  {items.length}곳
                </span>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-4">
                <div className="flex min-h-full flex-col gap-2">
                  {items.map((addr) => (
                    <SortableCard key={addr.id} address={addr} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AddressBoard;
