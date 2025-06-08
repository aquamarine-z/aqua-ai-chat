import Markdown from "react-markdown";
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import remarkGfm from "remark-gfm";

export const MarkdownRenderer = (props: { content: string }) => {
    return <Markdown remarkPlugins={[remarkMath, remarkGfm,]}
                     rehypePlugins={[rehypeKatex]}>{props.content}</Markdown>
}