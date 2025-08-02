'use client'
import {Textarea} from "@/components/ui/textarea";
import {AttachmentUploader} from "@/components/input-box/attachment-uploader";
import {Button} from "@/components/ui/button";
import {useLanguageStore} from "@/store/language-store";
import {ModelSelector} from "@/components/input-box/model-selector";
import {Suggestions} from "@/components/input-box/suggesions";
import {SetStateAction, useEffect, useRef, useState} from "react";
import {useChatStore} from "@/store/chat-store";
import {useChatListStateStore} from "@/store/chat-list-state-store";
import {ChevronDown, SendIcon, SquareIcon} from "lucide-react";
import {useInputStore} from "@/store/input-store";
import {ChatMessage, defaultUserMessage} from "@/schema/chat-message";
import {ChatApi, ChatConfig, getApiByModelName} from "@/api";
import useSettingsStore from "@/store/settings-store";
import {ChatSession} from "@/schema/chat-session";


export const InputBox = () => {
    const languageStore = useLanguageStore()
    const chatStore = useChatStore()
    const [focus, setFocus] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);
    const isComposingRef = useRef(false);
    const chatListStateStore = useChatListStateStore();
    const chatApiRef = useRef<ChatApi>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const sendMessageButtonRef = useRef<HTMLButtonElement>(null);
    const inputContent = useChatStore(state => {
        const session = state.getCurrentSession();
        return session.inputStorage.text
    })
    const streaming = useChatStore(state => {
        return state.getCurrentSession().streaming || false
    })
    const [sendMessageButtonDisabled, setSendMessageButtonDisabled] = useState(false);
    useEffect(() => {
        setSendMessageButtonDisabled(!streaming && inputContent.trim() === "");
    }, [inputContent, streaming]);
    const inputStore = useInputStore()
    useEffect(() => {
        inputStore.updateInputStore(action => {
            action.chat = (message?: ChatMessage) => {
                if (streaming) {
                    //console.log(1)
                    if(!message){
                        chatApiRef.current?.stop()
                    }
                    chatStore.updateSessionById(chatStore.getCurrentSession().id!!, prev => {
                        return {...prev, streaming: false}
                    })
                    return; // 如果正在流式传输消息，则不允许发送新消息
                }
                const sessionId = chatStore.getCurrentSession().id!!;
                if (!textareaRef.current) return;
                //将此对话排序移到顶端
                /*chatStore.setChatStore(prev=>{
                    // @ts-ignore
                    const currentSession = prev.sessions[prev.currentSessionIndex!]!;
                    if (currentSession) {
                        // @ts-ignore
                        prev.sessions = prev.sessions.filter((s, index) => index !== prev.currentSessionIndex);
                        prev.sessions=[currentSession, ...prev.sessions];
                        prev.currentSessionIndex = 0; // 更新当前会话索引
                    }
                    return prev;
                })*/
                const currentSession = chatStore.getCurrentSession()
                if (currentSession.streaming) {
                    if (chatApiRef.current) {
                        chatApiRef.current.stop()
                    }
                    chatStore.updateSessionById(sessionId!!, prev => {
                        return {...prev, streaming: false}
                    })
                    return
                }

                chatListStateStore.scrollToBottom()
                let userMessage: ChatMessage;
                if (message) {
                    userMessage = {...message}
                } else {
                    userMessage = {...defaultUserMessage}
                    userMessage.contents = [currentSession.inputStorage.text]

                    chatStore.updateSessionById(sessionId!!, session => {
                        session.inputStorage.text = ""
                        return session
                    })
                }

                const modelName = currentSession.modelConfig;
                const chatApi = getApiByModelName(modelName)
                if (!chatApi) return;
                const config: ChatConfig = {
                    session: currentSession,
                    onFinish: () => {
                        chatStore.updateSessionById(sessionId!!, session => {
                            session.streaming = false;
                            return session;
                        })
                        chatApiRef.current = null
                    },
                    userMessage: userMessage,
                }
                const settings = useSettingsStore.getState()
                if (settings["auto-generate-session-name"]) {
                    if (chatStore.getCurrentSession().messages.length <= 1) {
                        const messages = [
                            {
                                role: 'system',
                                contents: [`Following the message the user given, output a name of this session,and the language you use must follow the user's language
                                example:
                                input: What is XXX
                                output: Introduction of XXX
                                `
                                ]
                            }, userMessage
                        ] as ChatMessage[]
                        //console.log(messages)
                        chatApi.query(messages.map(it => {
                            return {
                                role: it.role,
                                contents: it.contents
                            }
                        }) as ChatMessage[]).then(content => {
                            //console.log(content)
                            chatStore.updateCurrentSession(session => ({
                                ...session,
                                name: content
                            }))
                        })
                    }
                }
                const update = (value: SetStateAction<ChatSession>) => {
                    chatStore.updateSessionById(sessionId!!, value)
                }
                const name = useChatStore.getState().getCurrentSession().name
                chatApi.sendMessage(config, (value) => {
                    update(value)
                    //console.log("Updating",name)
                })
                chatApiRef.current = chatApi as ChatApi;
            }
            return action
        })
    }, [chatStore.currentSessionIndex,streaming]);
    useEffect(() => {
        const handleFocusIn = () => setFocus(true);
        const handleFocusOut = () => {
            // 如果正在进行输入法组合输入，则不修改 focus 状态
            setTimeout(() => {
                if (isComposingRef.current) return;
                setFocus(false);
            }, 0)
        };
        const handleCompositionStart = () => {
            isComposingRef.current = true;
        };

        const handleCompositionEnd = () => {
            isComposingRef.current = false;
        };

        const div = divRef.current;
        if (div) {
            div.addEventListener("focusin", handleFocusIn);
            div.addEventListener("focusout", handleFocusOut);
            div.addEventListener("compositionstart", handleCompositionStart);
            div.addEventListener("compositionend", handleCompositionEnd);
        }

        return () => {
            if (div) {
                div.removeEventListener("focusin", handleFocusIn);
                div.removeEventListener("focusout", handleFocusOut);
                div.removeEventListener("compositionstart", handleCompositionStart);
                div.removeEventListener("compositionend", handleCompositionEnd);
            }
        };
    }, []);
    useEffect(() => {
        chatStore.repairCurrentSession()
        return () => {
            if (chatApiRef.current) {
                chatApiRef.current.stop()
                chatApiRef.current = null
            }
            chatStore.updateCurrentSession(session => {
                session.streaming = false
                return session
            })
            inputStore.updateInputStore(action => {
                action.chat = undefined
                return action
            })
        }
    }, [chatStore.currentSessionIndex])
    //console.log(inputContent)
    return <div className={"w-full h-fit px-4 pb-3 flex flex-row items-center justify-center "}>
        <div
            ref={divRef}
            className="transition-all relative w-full h-fit max-h-[60vh] border-[1px] border-foreground/10 rounded-2xl bg-background flex flex-col py-2 min-h-fit  px-2 max-w-5xl  ">
            {!chatListStateStore.isAtBottom &&
                <Button variant={"outline"} className={"w-10 h-10 rounded-full absolute -top-11 -right-0 "}
                        onClick={() => {
                            chatListStateStore.scrollToBottom()
                        }}><ChevronDown/> </Button>}
            <Suggestions open={focus}/>

            <Textarea ref={textareaRef}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                              e.preventDefault(); // 阻止默认的换行行为
                              if (!sendMessageButtonDisabled) {
                                  sendMessageButtonRef.current?.click()
                              }
                          }
                          // Shift+Enter 会保持默认行为（换行）
                      }
                      }
                      placeholder={languageStore.language["input-box.input.placeholder"]}
                      className={"w-full max-h-40 grow resize-none bg-transparent border-none shadow-none overflow-y-auto outline-0 focus:outline-0 focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:border-none"}
                      onChange={e => {
                          chatStore.updateCurrentSession(session => {
                              session.inputStorage.text = e.target.value.toString()
                              return session
                          })
                      }} value={inputContent.toString()}/>
            <div className={"min-h-12 flex flex-row items-center px-2 gap-2"}>
                <AttachmentUploader/>
                <div className={"grow"}/>
                <ModelSelector/>
                <Button ref={sendMessageButtonRef} onClick={() => {
                    inputStore.chat?.()
                }} className={"rounded-full h-7 w-7 sm:h-10 sm:w-10 hover:cursor-pointer"}
                        disabled={sendMessageButtonDisabled}>
                    {chatStore.getCurrentSession().streaming ? <SquareIcon/> : <SendIcon/>}
                </Button>
            </div>
        </div>
    </div>
}
