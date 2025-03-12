import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {ChatSession, defaultChatSession} from "@/schema/chat-session";
import {SetStateAction} from "react";
import {applySetStateAction} from "@/utils";

interface ChatStore {
    currentSessionIndex: number;
    sessions: ChatSession[];
    getCurrentSession: () => ChatSession;
    updateCurrentSession: (session: SetStateAction<ChatSession>) => void;
}

export const useChatStore = create<ChatStore>()(persist<ChatStore>((set, get) => ({
    currentSessionIndex: 0 as number,
    sessions: [defaultChatSession] as ChatSession[],
    getCurrentSession: () => {
        const {currentSessionIndex, sessions} = get()
        return sessions[currentSessionIndex]
    },
    updateCurrentSession: (session) => {
        const newSession = applySetStateAction<ChatSession>(get().getCurrentSession(), session)
        const sessions = get().sessions
        sessions[get().currentSessionIndex] = newSession
        set({...get(), sessions})
    }

}), {name: "chat-store"}))