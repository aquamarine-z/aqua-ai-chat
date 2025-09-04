import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useInputStore} from "@/store/input-store";
import {defaultUserMessage} from "@/schema/chat-message";
import {useLanguageStore} from "@/store/language-store";

export const Greeting = () => {
    const language=useLanguageStore().language
    return <div className={cn("w-full h-full py-2 grow overflow-y-auto flex items-center select-none")}>
        <div className={"w-full flex items-center justify-center"}>
            <div className={"flex flex-col items-center px-6 max-w-5xl w-full gap-4"}>
                <h1 className={"text-5xl font-extrabold text-foreground opacity-80"}>{language['greeting.title']}</h1>
                <p className={"text-2xl text-bold text-foreground opacity-70"}>{language['greeting.subtitle']}</p>

                <div className={"w-full flex flex-row items-center justify-center gap-2 overflow-x-auto py-2"}>
                    <p className={"text-1xl text-bold text-foreground opacity-60 "}>{language['greeting.suggestion']}</p>
                    {
                        greetingSuggestions.map((item, index) => {
                            return <GreetingSuggestionButton key={index} title={item.title} content={item.content}/>
                        })
                    }
                </div>
            </div>
        </div>
    </div>
}
export const GreetingSuggestionButton = (props: {
    title: string,
    content: string,
}) => {
    const inputStore = useInputStore();
    return <Button variant={"outline"} onClick={() => {
        const newMessage = {...defaultUserMessage}
        newMessage.contents = [props.content];
        inputStore.chat?.(newMessage)
    }}>
        <p className={"text-foreground opacity-70"}>
            {props.title}
        </p>

    </Button>
}
export const greetingSuggestions = [
    {
        title: "提供建议",
        content: "你能给我一些提高工作效率的建议吗？"
    },
    {
        title: "翻译文本",
        content: "请把这段话翻译成法语：'你好，今天过得怎么样？'"
    },
    {
        title: "生成代码",
        content: "帮我写一段Python代码，实现一个简单的计算器功能。"
    }
]