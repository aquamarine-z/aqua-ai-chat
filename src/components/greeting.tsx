import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useInputStore} from "@/store/input-store";
import {defaultUserMessage} from "@/schema/chat-message";

export const Greeting = () => {
    return <div className={cn("w-full h-full py-2 grow overflow-y-auto flex items-center select-none")}>
        <div className={"w-full flex items-center justify-center"}>
            <div className={"flex flex-col items-center px-6 max-w-5xl w-full gap-4"}>
                <h1 className={"text-5xl font-extrabold text-foreground opacity-80"}>欢迎使用汽车推荐助手</h1>
                <p className={"text-2xl text-bold text-foreground opacity-70"}>请问需要我做些什么?</p>

                <div className={"w-full flex flex-row items-center justify-center gap-2 overflow-x-auto py-2"}>
                    <p className={"text-1xl text-bold text-foreground opacity-60 "}>猜你想问:</p>
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
        title: "查询车辆数据",
        content: "你能给我一些提高工作效率的建议吗？"
    },
    {
        title: "搜索市场价格",
        content: "请把这段话翻译成法语：'你好，今天过得怎么样？'"
    },
    {
        title: "分析顾客评价",
        content: "帮我写一段Python代码，实现一个简单的计算器功能。"
    }
]