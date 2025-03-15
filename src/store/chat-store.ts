'use client'
import {create} from "zustand/react";
import {persist} from "zustand/middleware";
import {ChatSession, defaultChatSession} from "@/schema/chat-session";
import {SetStateAction} from "react";
import {applySetStateAction} from "@/utils";
import {ChatMessage} from "@/schema/chat-message";

interface ChatStore {
    currentSessionIndex: number;
    sessions: ChatSession[];
    getCurrentSession: () => ChatSession;
    updateCurrentSession: (session: SetStateAction<ChatSession>) => void;
    repairCurrentSession: () => void;
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
    },
    repairCurrentSession: () => {
        if (get().getCurrentSession().streaming) {
            get().updateCurrentSession(action => ({...action, streaming: false}))
        }
        const messages = get().getCurrentSession().messages
        let changed = false
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i] as ChatMessage
            if (message.thinking && (!message.thinking!.finished)) {
                messages[i].thinking!.finished = true
                changed = true
            }
            if (message.streaming) {
                messages[i].streaming = false
                changed = true
            }

        }
        if (changed) {
            get().updateCurrentSession(action => ({...action, messages}))
        }
    }

}), {name: "chat-store"}))