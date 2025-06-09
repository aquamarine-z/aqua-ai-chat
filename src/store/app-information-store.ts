import {create} from "zustand";

interface AppInformationStore {
    version: string,
    name: string,
    description: string,
}

export const useAppInformationStore = create<AppInformationStore>((set) => ({
    version: "0.0.1",
    name: "Beta",
    description: "This is a sample application using Zustand for state management.",
}));