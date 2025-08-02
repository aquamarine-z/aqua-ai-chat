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
    setChatStore: (actions: SetStateAction<Partial<ChatStore>>) => void;
    removeSession: (index: number) => void;
    addNewSession: (session: ChatSession) => void;
    sessionIdMap: Map<number, number>;
    removeSessionById: (id: number) => void;
    updateSessionById: (id: number, session: SetStateAction<ChatSession>) => void;
    swapSession: (index1: number, index2: number) => void;
}

const customStorage = {
    getItem: (name: string) => {
        const str = localStorage.getItem(name)
        if (!str) return null
        const data = JSON.parse(str)
        return {
            state: {
                ...data.state,
                sessionIdMap: new Map<number, number>(data.state.sessionIdMap),
            },
        }
    },
    setItem: (name: string, newValue: any) => {
        const state = newValue.state
        const toSave = {
            ...newValue,
            state: {
                ...state,
                sessionIdMap: Array.from(state.sessionIdMap.entries()),
            },
        }
        localStorage.setItem(name, JSON.stringify(toSave))
    },
    removeItem: (name: string) => {
        localStorage.removeItem(name)
    },
}
export const useChatStore = create<ChatStore>()(persist<ChatStore>((set, get) => ({
    currentSessionIndex: 0 as number,
    sessions: [defaultChatSession] as ChatSession[],
    sessionIdMap: new Map<number, number>(),
    getCurrentSession: () => {
        const {currentSessionIndex, sessions} = get()
        return sessions[currentSessionIndex]
    },
    addNewSession: (session: ChatSession) => {
        if (session.id) {
            const newSessions = get().sessions
            newSessions.push(session)
            const newSessionIdMap = get().sessionIdMap
            newSessionIdMap.set(session.id, newSessions.length - 1)
            set(prev => {
                return {
                    ...prev,
                    sessions: newSessions,
                    sessionIdMap: newSessionIdMap
                }
            })
        } else {
            //random new id and check if it exists until it does not
            let newId = Math.floor(Math.random() * 1000000)
            while (get().sessionIdMap.has(newId)) {
                newId = Math.floor(Math.random() * 1000000)
            }
            const newSession = {...session, id: newId}
            const newSessions = get().sessions
            newSessions.push(newSession)
            const newSessionIdMap = get().sessionIdMap
            newSessionIdMap.set(newId, newSessions.length - 1)
            set(prev => {
                return {
                    ...prev,
                    sessions: newSessions,
                    sessionIdMap: newSessionIdMap,
                    currentSessionIndex: newSessions.length - 1
                }
            })
        }
    },
    swapSession: (index1: number, index2: number) => {
        const sessions = get().sessions
        if (index1 < 0 || index2 < 0 || index1 >= sessions.length || index2 >= sessions.length) {
            //console.warn("Invalid session index")
            return
        }
        const temp = sessions[index1]
        sessions[index1] = sessions[index2]
        sessions[index2] = temp

        //update sessionIdMap if id exists
        const sessionIdMap = get().sessionIdMap
        //console.log("sessionIdMap", sessionIdMap)
        if (temp.id !== undefined) {
            sessionIdMap.set(temp.id, index2)
        }
        if (sessions[index1].id !== undefined) {
            sessionIdMap.set(sessions[index1].id, index1)
        }

        set({...get(), sessions, sessionIdMap})
    },
    removeSessionById: (id: number) => {
        if (get().sessionIdMap.has(id)) {
            const index = get().sessionIdMap.get(id)
            if (index === undefined) {
                //console.warn(`Session with id ${id} not found`)
                return
            }
            get().removeSession(index)
        }
    },
    updateSessionById: (id: number, session: SetStateAction<ChatSession>) => {
        const sessionIndex = get().sessionIdMap.get(id)
        if (sessionIndex === undefined) {
            //console.warn(`Session with id ${id} not found`)
            return
        }
        //console.log(get().sessions[sessionIndex])
        const oldSessionId = get().sessions[sessionIndex].id
        const newSession = applySetStateAction<ChatSession>(get().sessions[sessionIndex], session)
        const sessionIdMap = get().sessionIdMap
        if (newSession.id !== oldSessionId) {
            //update sessionIdMap
            sessionIdMap.delete(oldSessionId!)
            sessionIdMap.set(newSession.id!, sessionIndex)
        }
        const sessions = get().sessions
        sessions[sessionIndex] = newSession

        set({...get(), sessions, sessionIdMap})
    }
    ,
    updateCurrentSession: (session) => {
        const newSession = applySetStateAction<ChatSession>(get().getCurrentSession(), session)
        const sessions = get().sessions
        sessions[get().currentSessionIndex] = newSession
        set({...get(), sessions})
    },
    repairCurrentSession: () => {
        //console.log(get().getCurrentSession().streaming)
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
        //if there is no sessionId in the current session, generate a new one
        if (!get().getCurrentSession().id) {
            const newId = Math.floor(Math.random() * 1000000)
            get().updateCurrentSession(action => ({...action, id: newId}))
            const sessionIdMap = get().sessionIdMap
            sessionIdMap.set(newId, get().currentSessionIndex)
            set({...get(), sessionIdMap})
        }
    },
    setChatStore: (action) => {
        const data = get()
        const value = applySetStateAction(data, action)
        set({...data, ...value})
    },
    removeSession: (index) => {
        if (get().sessions.length === 1) {
            set(prev => {
                return {
                    ...prev,
                    sessions: [defaultChatSession],
                    currentSessionIndex: 0,
                }
            })
            //update sessionIdMap
            const sessionIdMap = get().sessionIdMap
            sessionIdMap.clear()
            set(prev => {
                return {
                    ...prev,
                    sessionIdMap,
                }
            })
        } else {
            const oldSessions = get().sessions
            const newSessions = oldSessions.filter((_, i) => i !== index)
            const sessionIdMap = get().sessionIdMap
            //update sessionIdMap
            const removedSessionId = oldSessions[index].id
            if (removedSessionId !== undefined) {
                sessionIdMap.delete(removedSessionId)
            }
            //update sessionIdMap indices
            const newSessionIdMap = new Map<number, number>()
            newSessions.forEach((session, i) => {
                if (session.id !== undefined) {
                    newSessionIdMap.set(session.id, i)
                }
            })
            //if currentSessionIndex is greater than newSessions length, set it to newSessions length - 1
            if (get().currentSessionIndex >= newSessions.length) {
                set(prev => {
                    return {
                        ...prev,
                        currentSessionIndex: newSessions.length - 1,
                    }
                })
            }
            //set new sessions and sessionIdMap
            set(prev => {
                return {
                    ...prev,
                    sessions: newSessions,
                    currentSessionIndex: Math.min(get().currentSessionIndex, newSessions.length - 1),
                    sessionIdMap: newSessionIdMap,
                }
            })

        }
    }

}), {
    name: "chat-store",
    storage: customStorage,
}))
