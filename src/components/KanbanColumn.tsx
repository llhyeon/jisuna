import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableCard } from "./SortableCard";
import type { AddressPoint } from "@/schemas/addressSchema";
import { GROUP_OPTIONS } from "@/data/constants";

interface Props {
  groupIdx: number;
  items: AddressPoint[];
}

export function KanbanColumn({ groupIdx, items }: Props) {
  const columnId = `group-${groupIdx}`;
  const groupName = groupIdx === 0 ? "미배정" : `${groupIdx}조`;

  const targetOptions = GROUP_OPTIONS[groupIdx];

  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  return (
    <div
      data-vaul-no-drag
      ref={setNodeRef}
      className={`flex h-full min-w-80 max-w-80 flex-col rounded-xl border-t-4 bg-gray-50 p-3 transition-colors
        ${targetOptions.color.border}
        ${isOver ? "bg-blue-50" : "bg-gray-50"}
      `}>
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="font-extrabold text-gray-700">{targetOptions.label}</h3>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-bold shadow-sm">
          {items.length}곳
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-4">
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}>
          <div className="flex min-h-full flex-col gap-2 pb-15">
            {items.map((addr) => (
              <SortableCard key={addr.id} address={addr} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
