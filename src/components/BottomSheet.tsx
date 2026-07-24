import { KanbanColumn } from "@/components/KanbanColumn";
import { GROUP_OPTIONS } from "@/data/constants";
import { useMapStore } from "@/store/useMapStore";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useState } from "react";
import { Drawer } from "vaul";

const GRUOP_INDEX = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function BottomSheet() {
  const [activeSnapPoint, setActiveSnapPoint] = useState<string | number | null>("60px");
  const addresses = useMapStore((s) => s.addresses);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  return (
    <Drawer.Root
      open={true}
      modal={false}
      dismissible={false}
      snapPoints={["60px", 0.9]}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      handleOnly>
      <Drawer.Portal>
        <Drawer.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed bottom-0 left-0 right-0 z-50 flex h-full flex-col rounded-t-[20px] bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
          <Drawer.Handle className="mx-auto my-4" />
          <div className="px-5 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">지역선교 방문 동선</h2>
            </div>
          </div>

          {/* 💡 칸반 보드 영역 (가로 스크롤) */}
          <div
            data-vaul-no-drag
            className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-auto bg-gray-100 px-4 py-4">
            <DndContext sensors={sensors}>
              <div className="flex gap-4 h-full">
                {GROUP_OPTIONS.map((group) => {
                  const targetAddress = addresses.filter((addr) => addr.groupId === group.id);
                  return <KanbanColumn key={group.id} groupIdx={group.id} items={targetAddress} />;
                })}
              </div>
            </DndContext>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default BottomSheet;
