import {useSuggestionStore} from "@/store/suggestion-store";
import {Suggestion} from "@/schema/suggestion";
import {Button} from "@/components/ui/button";
import {AnimatePresence, motion} from "framer-motion";
import {useChatStore} from "@/store/chat-store";

export interface SuggestionsProps {
    open: boolean
}

export function Suggestions(props: SuggestionsProps) {
    const chatStore = useChatStore();
    const inputStorage = chatStore.getCurrentSession().inputStorage;
    const suggestionStore = useSuggestionStore()
    const availableSuggestions = getAvailableSuggestions(inputStorage.text, suggestionStore.suggestions)
    return <AnimatePresence>
        {(availableSuggestions.length > 0 && props.open) && (
            <motion.div
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.1}}
                className="w-full max-h-40 overflow-y-auto"
                style={{scrollbarWidth: "none"}}
            >
                {availableSuggestions.map((it, index) => (
                    <Button
                        onClick={() => {
                            chatStore.updateCurrentSession(session => {
                                session.inputStorage.text = session.inputStorage.text + it.content;
                                return session;
                            })
                        }}

                        key={index} variant="ghost" className="flex h-fit items-start flex-col w-full">
                        <span className="font-semibold text-lg">{it.name}</span>
                        <span className="font-medium text-sm text-foreground/60">{it.content}</span>
                    </Button>
                ))}
            </motion.div>
        )}
    </AnimatePresence>
}

function getAvailableSuggestions(input: string, suggestions: Suggestion[]) {
    if (input.trim() === "") return []
    if (input.startsWith("/")) return suggestions
    const result = [] as Suggestion[]
    for (const suggestion of suggestions) {
        if (suggestion.content.includes(input) || suggestion.name.includes(input)) {
            if (suggestion.content !== input) result.push(suggestion)
        }
    }
    return result
}