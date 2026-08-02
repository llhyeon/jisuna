import { ALL_IDS, GROUP_OPTIONS } from "@/data/constants";
import { supabase } from "@/lib/supabase";
import type { AddressPoint } from "@/schemas/addressSchema";
import dataKeyFormatter from "@/utils/dataKeyFormatter";
import type { RealtimeChannel } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { create } from "zustand";

type VisitDay = 0 | 1 | 2;

interface MapStore {
  kakaoMap: kakao.maps.Map | null;
  setKakaoMap: (map: kakao.maps.Map) => void;

  addresses: AddressPoint[];
  initAddressesData: () => void;
  isDataLoading: boolean;

  // Supabase Realtime 관련
  realtimeChannel: RealtimeChannel | null;
  subscribeRealtime: () => void;
  unsubscribeRealtim: () => void;

  selectedAddress: AddressPoint[];

  isModalOpen: boolean;
  openModal: (selectedAddress: AddressPoint[]) => void;
  closeModal: () => void;

  updateAddresses: (updatedAddresses: AddressPoint[]) => Promise<void>;

  visitDay: VisitDay[];
  toggleVisitDay: (visitDay: VisitDay) => void;

  selectedGroups: number[];
  toggleSelectedGroups: (groupId: number) => void;
  toggleAllGroups: () => void;

  groups: AddressPoint[][];
  setGroups: (groups: AddressPoint[][]) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  kakaoMap: null,
  setKakaoMap: (map: kakao.maps.Map) => set({ kakaoMap: map }),

  addresses: [],
  initAddressesData: async () => {
    try {
      const { data: rawDatas, error } = await supabase.from("address_point").select("*");

      if (error) throw error;

      if (rawDatas) {
        const formattedDatas = rawDatas.map((data) => {
          const formattedData = dataKeyFormatter<AddressPoint>(data);

          return formattedData;
        });

        set({ addresses: formattedDatas });
      }
    } catch (err) {
      console.error("초기 데이터 로드 에러", err);
      set({});
    } finally {
      set({ isDataLoading: false });
    }
  },
  isDataLoading: true,

  realtimeChannel: null,
  subscribeRealtime: () => {
    if (get().realtimeChannel) return;

    const channel = supabase
      .channel("address_point_channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "address_point",
        },
        (payload) => {
          const oldFormattedRow = dataKeyFormatter(payload.old) as AddressPoint;
          const updateRow = dataKeyFormatter(payload.new) as AddressPoint;
          const groupOption = GROUP_OPTIONS.find((opt) => opt.id === updateRow.groupId);

          if (!groupOption) return;

          set((state) => ({
            addresses: state.addresses.map((addr) =>
              addr.id === updateRow.id ? { ...addr, ...updateRow } : addr,
            ),
          }));

          const prevGroup = GROUP_OPTIONS[oldFormattedRow.groupId];
          const newGroup = GROUP_OPTIONS[updateRow.groupId];

          toast.success(
            `${updateRow.householder} 가구 정보 변경\n${prevGroup.label}=>${newGroup.label}`,
          );
        },
      )
      .subscribe();

    set({ realtimeChannel: channel });
  },
  unsubscribeRealtim: () => {
    const channel = get().realtimeChannel;
    if (channel) {
      supabase.removeChannel(channel);
      set({ realtimeChannel: null });
    }
  },

  selectedAddress: [],

  isModalOpen: false,
  openModal: (selectedAddress: AddressPoint[]) => {
    if (selectedAddress.length === 0) return;
    set({ isModalOpen: true, selectedAddress });
  },
  closeModal: () => set({ isModalOpen: false, selectedAddress: [] }),

  updateAddresses: async (updatedAddresses: AddressPoint[]) => {
    const prevAddresses = get().addresses;

    const updated = prevAddresses.map((addr) => {
      const matched = updatedAddresses.find((updatedAddr) => updatedAddr.id === addr.id);

      return matched ? { ...addr, ...matched } : addr;
    });

    set({ addresses: updated });

    const bulkPayload = updatedAddresses.map((item) => ({
      id: item.id,
      address: item.address,
      group_id: item.groupId,
      visit_day: item.visitDay,
    }));

    try {
      await supabase.from("address_point").upsert(bulkPayload).throwOnError().select();
    } catch (error) {
      set({ addresses: prevAddresses });

      throw new Error("DB update failed", {
        cause: error,
      });
    }
  },

  visitDay: [0, 1, 2],
  toggleVisitDay: (visitDay: VisitDay) =>
    set((state) => {
      const updatedVisitDay = state.visitDay.includes(visitDay)
        ? state.visitDay.filter((day) => day !== visitDay)
        : [...state.visitDay, visitDay];

      return {
        visitDay: updatedVisitDay,
      };
    }),

  selectedGroups: ALL_IDS,
  toggleSelectedGroups: (groupId: number) =>
    set((state) => ({
      selectedGroups: state.selectedGroups.includes(groupId)
        ? state.selectedGroups.filter((id) => id !== groupId)
        : [...state.selectedGroups, groupId],
    })),
  toggleAllGroups: () =>
    set((state) => {
      const isAllSelected = ALL_IDS.every((id) => state.selectedGroups.includes(id));

      return {
        selectedGroups: isAllSelected ? [] : ALL_IDS,
      };
    }),

  groups: [],
  setGroups: (groups) => set({ groups }),
}));
