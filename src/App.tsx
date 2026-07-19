import KakaoMap from "@/components/KakaoMap";
import MenuBar from "@/components/MenuBar";
import Modal from "@/components/Modal";
import SplashLogo from "@/components/SplashLogo";
import { useMapStore } from "@/store/useMapStore";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useShallow } from "zustand/react/shallow";

function App() {
  const [isSplashShow, setIsSplahShow] = useState(true);

  const initAddresses = useMapStore((s) => s.initAddressesData);
  const isDataLoading = useMapStore((s) => s.isDataLoading);
  const { selectedAddress, isModalOpen } = useMapStore(
    useShallow((s) => ({
      selectedAddress: s.selectedAddress,
      isModalOpen: s.isModalOpen,
    })),
  );
  const subscribeRealtime = useMapStore((s) => s.subscribeRealtime);
  const unsubscribeRealtime = useMapStore((s) => s.unsubscribeRealtim);

  useEffect(() => {
    initAddresses();
  }, [initAddresses]);

  useEffect(() => {
    subscribeRealtime();

    return () => {
      unsubscribeRealtime();
    };
  }, [subscribeRealtime, unsubscribeRealtime]);

  return (
    <main className="app-container">
      <MenuBar />
      <SplashLogo hasShow={isSplashShow || isDataLoading} />
      <KakaoMap onMapLoad={() => setIsSplahShow(false)} />
      {isModalOpen && selectedAddress && <Modal address={selectedAddress} />}
      {/* <BottomSheet /> */}
      <Toaster position="top-center" />
    </main>
  );
}

export default App;
