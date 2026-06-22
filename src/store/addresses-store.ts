import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "@/types";

interface AddressesState {
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
}

const seedAddresses: Address[] = [
  {
    id: "addr_seed_home",
    label: "Home",
    fullName: "Jordan Avery",
    line1: "128 Spring Street",
    city: "New York",
    state: "NY",
    postalCode: "10012",
    country: "United States",
    phone: "+1 (212) 555-0148",
    isDefault: true,
  },
];

export const useAddressesStore = create<AddressesState>()(
  persist(
    (set, get) => ({
      addresses: seedAddresses,
      addAddress: (address) =>
        set({
          addresses: [
            ...get().addresses.map((a) => ({ ...a, isDefault: address.isDefault ? false : a.isDefault })),
            { ...address, id: `addr_${Math.random().toString(36).slice(2, 10)}` },
          ],
        }),
      removeAddress: (id) => set({ addresses: get().addresses.filter((a) => a.id !== id) }),
      setDefault: (id) =>
        set({ addresses: get().addresses.map((a) => ({ ...a, isDefault: a.id === id })) }),
    }),
    { name: "aro-addresses", skipHydration: true }
  )
);
