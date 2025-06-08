'use client'
import {Textarea} from "@/components/ui/textarea";
import {AttachmentUploader} from "@/components/input-box/attachment-uploader";
import {Button} from "@/components/ui/button";
import {useLanguageStore} from "@/store/language-store";
import {ModelSelector} from "@/components/input-box/model-selector";
import {Suggestions} from "@/components/input-box/suggesions";
import {forwardRef, useEffect, useRef, useState} from "react";
import {useChatStore} from "@/store/chat-store";
import {useChatListStateStore} from "@/store/chat-list-state-store";
import {ChevronDown, SendIcon, SquareIcon} from "lucide-react";
import {useInputStore} from "@/store/input-store";
import {ChatMessage, defaultUserMessage} from "@/schema/chat-message";
import {ChatApi, ChatConfig, getApiByModelName} from "@/api";

export const InputBox = forwardRef((props, ref) => {
    const languageStore = useLanguageStore()
    const chatStore = useChatStore()
    const [focus, setFocus] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);
    const isComposingRef = useRef(false);
    const chatListStateStore = useChatListStateStore();
    const chatApiRef = useRef<ChatApi>(null)
    const inputContent = useChatStore(state => {
        const session = state.getCurrentSession();
        return session.inputStorage.text
    })
    const streaming = useChatStore(state => {
        return state.getCurrentSession().streaming||false
    })

    const [sendMessageButtonDisabled, setSendMessageButtonDisabled] = useState(false);
    useEffect(() => {
        setSendMessageButtonDisabled(!streaming&& inputContent.trim() === "");
    }, [inputContent,streaming]);
    const inputStore = useInputStore()
    useEffect(() => {
        inputStore.updateInputStore(action => {
            action.chat = (message?: ChatMessage) => {
                const currentSession = chatStore.getCurrentSession()
                //console.log(currentSession.name)
                if (currentSession.streaming) {
                    if (chatApiRef.current) {
                        chatApiRef.current.stop()
                    }
                    chatStore.updateCurrentSession(prev => {
                        return {...prev, streaming: false}
                    })
                    return
                }
                let userMessage: ChatMessage;
                if (message) {
                    userMessage = {...message}
                } else {
                    userMessage = {...defaultUserMessage}
                    userMessage.contents = [currentSession.inputStorage.text]
                    chatStore.updateCurrentSession(session => {
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
                        chatStore.updateCurrentSession(session => {
                            session.streaming = false;
                            return session;
                        })
                        chatApiRef.current = null
                    },
                    userMessage: userMessage,
                }
                chatApi.sendMessage(config, chatStore.updateCurrentSession)
                chatApiRef.current = chatApi as ChatApi;
            }
            return action
        })
    }, [chatStore.currentSessionIndex]);
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
    return <div className={"w-full h-fit px-2 flex flex-row items-center justify-center "}>
        <div
            ref={divRef}
            className="transition-all relative w-full h-fit max-h-[60vh] border-[1px] border-foreground/10 rounded-2xl bg-background flex flex-col py-2 min-h-fit  px-2 max-w-5xl ">
            {!chatListStateStore.isAtBottom &&
                <Button variant={"outline"} className={"w-10 h-10 rounded-full absolute -top-11 -right-0 "}
                        onClick={() => {
                            chatListStateStore.scrollToBottom()
                        }}><ChevronDown/> </Button>}
            <Suggestions open={focus}/>

            <Textarea
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
                <Button onClick={() => {
                    inputStore.chat?.()
                }} className={"rounded-full h-7 w-7 sm:h-10 sm:w-10 hover:cursor-pointer"}
                        disabled={sendMessageButtonDisabled}>
                    {chatStore.getCurrentSession().streaming ? <SquareIcon/> : <SendIcon/>}
                </Button>

            </div>
        </div>
    </div>


})
