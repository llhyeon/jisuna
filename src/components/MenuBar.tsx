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
import toast from "react-hot-toast";

function MenuBar() {
  const [open, setOpen] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [inputKeyword, setInputKeyword] = useState("");

  const serachInputRef = useRef<HTMLInputElement | null>(null);

  const kakaoMap = useMapStore((s) => s.kakaoMap);
  const addresses = useMapStore((s) => s.addresses);
  const visitDay = useMapStore((s) => s.visitDay);
  const toggleVisitDay = useMapStore((s) => s.toggleVisitDay);

  useEffect(() => {
    if (!serachInputRef.current) return;

    if (isSearchMode) serachInputRef.current.focus();
  }, [isSearchMode]);

  const handleSearchAddress = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!kakaoMap) return;

    if (inputKeyword.length === 0) {
      toast.error("가구주 이름을 입력하세요");
      return;
    }

    const normalizedKeyword = inputKeyword.trim();

    const matchAddress = addresses.find((addr) => addr.householder === normalizedKeyword);
    if (!matchAddress) {
      toast.error(`'${normalizedKeyword}' 가구는 없습니다.`);
      return;
    }

    kakaoMap.setLevel(2);
    kakaoMap.panTo(new kakao.maps.LatLng(matchAddress.lat, matchAddress.lng));
  };

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
      <form onSubmit={handleSearchAddress}>
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
            onChange={(e) => setInputKeyword(e.target.value)}
            value={inputKeyword}
          />
        </div>
      </form>
    </nav>
  );
}

export default MenuBar;
