import { supabase } from "@/lib/supabase";
import type { AddressPoint } from "@/schemas/addressSchema";
import dataKeyFormatter from "@/utils/dataKeyFormatter";
import type { RealtimeChannel } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { create } from "zustand";

type VisitDay = 0 | 1 | 2;

interface MapStore {
  addresses: AddressPoint[];
  initAddressesData: () => void;
  isDataLoading: boolean;

  // Supabase Realtime 관련
  realtimeChannel: RealtimeChannel | null;
  subscribeRealtime: () => void;
  unsubscribeRealtim: () => void;

  // Key in search
  searchText: string;
  setSearchText: (searchText: string) => void;

  selectedAddress: AddressPoint[];

  isModalOpen: boolean;
  openModal: (selectedAddress: AddressPoint[]) => void;
  closeModal: () => void;

  updateAddresses: (updatedAddresses: AddressPoint[]) => Promise<void>;

  visitDay: VisitDay[];
  toggleVisitDay: (visitDay: VisitDay) => void;

  groups: AddressPoint[][];
  setGroups: (groups: AddressPoint[][]) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
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
          const row = payload.new;
          const updateRow = dataKeyFormatter(row) as AddressPoint;

          set((state) => ({
            addresses: state.addresses.map((addr) =>
              addr.id === updateRow.id ? { ...addr, ...updateRow } : addr,
            ),
          }));

          toast.success(
            `${updateRow.groupId ?? "미배정"}조: ${updateRow.householder} 가구 정보 변경`,
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

  searchText: "",
  setSearchText: (searchText: string) => {
    return set({ searchText });
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
      group_id: item.groupId,
      visit_day: item.visitDay,
    }));

    try {
      await supabase.from("address_point").upsert(bulkPayload).throwOnError();

      console.log(` ${bulkPayload.length}건 데이터 업데이트 완료`);
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

  groups: [],
  setGroups: (groups) => set({ groups }),
}));
