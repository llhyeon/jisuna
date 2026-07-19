import CheckboxItem from "@/components/CheckboxItem";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useMapStore } from "@/store/useMapStore";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function MenuBar() {
  const [open, setOpen] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const serachInputRef = useRef<HTMLInputElement | null>(null);

  const searchText = useMapStore((s) => s.searchText);
  const setSearchText = useMapStore((s) => s.setSearchText);
  const visitDay = useMapStore((s) => s.visitDay);
  const toggleVisitDay = useMapStore((s) => s.toggleVisitDay);

  useEffect(() => {
    if (!serachInputRef.current) return;

    if (isSearchMode) serachInputRef.current.focus();
    else setSearchText("");
  }, [isSearchMode, setSearchText]);

  return (
    <nav className="fixed inset-x-0 top-4 z-50 px-5 flex items-center justify-between">
      <Popover
        open={open}
        onOpenChange={(open: boolean) => {
          setOpen(open);
        }}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-h-12 flex">
            메뉴
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start">
          <PopoverHeader>
            <PopoverTitle>날짜별 보기</PopoverTitle>
          </PopoverHeader>
          <CheckboxItem
            label="미배정"
            checked={visitDay.includes(0)}
            onCheckedChange={() => toggleVisitDay(0)}
          />
          <CheckboxItem
            label="8월 22일"
            checked={visitDay.includes(1)}
            onCheckedChange={() => toggleVisitDay(1)}
          />
          <CheckboxItem
            label="8월 29일"
            checked={visitDay.includes(2)}
            onCheckedChange={() => toggleVisitDay(2)}
          />
          <Separator />
        </PopoverContent>
      </Popover>
      <div
        className={`overflow-hidden bg-background p-3 rounded-full shadow-md flex items-center ${isSearchMode ? "gap-1" : "gap-0"}`}>
        <button
          type="button"
          aria-label="search"
          className="flex items-center justify-center shrink-0 size-5"
          onClick={() => setIsSearchMode((prev) => !prev)}>
          <Search />
        </button>
        <input
          ref={serachInputRef}
          type="text"
          placeholder="가구주를 입력하세요"
          className={`text-xs outline-none transition-all duration-700
            ${isSearchMode ? "max-w-40 p-1 opacity-100" : "max-w-0 p-0 opacity-0"}`}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </div>
    </nav>
  );
}

export default MenuBar;
