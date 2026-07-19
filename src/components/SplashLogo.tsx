import logo from "@/assets/logo.webp";
import { useEffect, useState } from "react";

function SplashLogo({ hasShow }: { hasShow: boolean }) {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (!hasShow) {
      const t = setTimeout(() => {
        setShouldRender(false);
      }, 500);

      return () => clearTimeout(t);
    }
  }, [hasShow]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-background z-10
    ${!hasShow && "splash-out"}`}>
      <img src={logo} alt="로고 이미지" className="w-32 animate-pulse" />
    </div>
  );
}

export default SplashLogo;
