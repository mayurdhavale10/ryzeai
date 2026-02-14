import { create } from "zustand"

type Version = {
    id: string
    tree: any[]
    code: string
    explanation: string
}

type Store = {
    versions: Version[]
    current: Version | null
    addVersion: (v: Version) => void
}

export const useVersionStore = create<Store>((set) => ({
    versions: [],
    current: null,
    addVersion: (v) =>
        set((state) => ({
            versions: [...state.versions, v],
            current: v,
        })),
}))
