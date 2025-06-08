'use client'
import Markdown, {Components} from "react-markdown";

import 'katex/dist/katex.min.css'

import RemarkGfm from "remark-gfm";
import 'github-markdown-css/github-markdown.css';
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import styles from "./markdown.module.css"
import RehypeHighlight from "rehype-highlight";
import {cn} from "@/lib/utils";
import React from "react";
import {Button} from "@/components/ui/button";
import {CopyIcon} from "lucide-react";
import {useLanguageStore} from "@/store/language-store";
import {toast} from "sonner"

export const MarkdownRenderer = (props: { content: string }) => {

    return <Markdown remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
                     rehypePlugins={[
                         RehypeKatex,
                         [
                             RehypeHighlight,
                             {
                                 detect: false,
                                 ignoreMissing: true,
                             },
                         ],
                     ]}
                     components={
                         {
                             table: ({node, ...props}) => (
                                 <table
                                     {...props}
                                     className={cn("table-auto border-collapse border border-foreground/50 my-4 text-center ", styles["markdown"])}/>
                             ),
                             td: ({node, ...props}) => (
                                 <td {...props} style={{}} className={cn("text-center", styles["markdown"])}/>
                             ),
                             th: ({node, ...props}) => {
                                 return <th {...props} style={{}}
                                            className={cn("text-center font-bold", styles["markdown"])}/>
                             },
                             hr: ({node, ...props}) => {
                                 return <hr {...props} className={cn("my-6")}/>
                             },
                             h1: ({node, ...props}) => {
                                 return <h1 {...props} className={cn("text-4xl font-bold my-4", styles["markdown"])}/>
                             },
                             h2: ({node, ...props}) => {
                                 return <h2 {...props} className={cn("text-3xl font-bold my-3", styles["markdown"])}/>
                             },
                             h3: ({node, ...props}) => {
                                 return <h3 {...props} className={cn("text-2xl font-bold my-2", styles["markdown"])}/>
                             },
                             h4: ({node, ...props}) => {
                                 return <h4 {...props} className={cn("text-xl font-bold my-1", styles["markdown"])}/>
                             },
                             h5: ({node, ...props}) => {
                                 return <h5 {...props} className={cn("text-lg font-bold my-1", styles["markdown"])}/>
                             },
                             h6: ({node, ...props}) => {
                                 return <h6 {...props} className={cn("text-base font-bold my-1", styles["markdown"])}/>
                             },
                             strong: ({node, ...props}) => {
                                 return <strong {...props} className={cn("font-bold", styles["markdown"])}/>
                             },
                             pre: Pre,
                             code: Code,
                             ul: ({node, ...props}) => {
                                 return <ul {...props} className={cn("list-disc list-inside pl-4 my-0.5", styles["markdown"])}/>
                             },
                             ol: ({node, ...props}) => {
                                 return <ol {...props} className={cn("list-decimal list-inside pl-4 my-0.5", styles["markdown"])}/>
                             },

                         }
                     }
    >{props.content}</Markdown>
}
const Pre: Components["pre"] = ({node, className, children, ...props}) => {
    const language = useLanguageStore().language
    // 如果父节点是 <pre>，说明这是 block code
    return <div className={"bg-background border-1 border-foreground/30 rounded-sm my-4 flex flex-col pb-2"}>
        <div className={"w-full h-10 flex flex-row border-b-1 border-foreground/30 my-2 pb-2 px-2 items-center"}>
            <div className={"grow"}/>
            <Button onClick={() => {
                const code = children as string;
                navigator.clipboard.writeText(code).then(() => {
                    toast.success(language["markdown-renderer.pre.header.copy.success"])

                }).catch(err => {
                    toast.error(language["markdown-renderer.pre.header.copy.fail"])

                });

            }} className={"h-8 py-2 rounded-sm"}
                    variant={"ghost"}><CopyIcon/>{language["markdown-renderer.pre.header.copy.button"]}</Button>
        </div>
        <pre className={"mx-4"}>{children}</pre>
    </div>

}
const Code: Components["code"] = ({node, className, children, ...props}) => {
    return <code
        className={cn("max-w-full overflow-x-scroll", className)} {...props}>{children}</code>
}
/*
import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";


import { useRef, useState, RefObject, useEffect, useMemo } from "react";
import LoadingIcon from "../icons/three-dots.svg";
import React from "react";


export function Mermaid(props: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (props.code && ref.current) {
      mermaid
        .run({
          nodes: [ref.current],
          suppressErrors: true,
        })
        .catch((e) => {
          setHasError(true);
          console.error("[Mermaid] ", e.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.code]);

  function viewSvgInNewWindow() {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    const text = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([text], { type: "image/svg+xml" });
    showImageModal(URL.createObjectURL(blob));
  }

  if (hasError) {
    return null;
  }

  return (
    <div
      className="no-dark mermaid"
      style={{
        cursor: "pointer",
        overflow: "auto",
      }}
      ref={ref}
      onClick={() => viewSvgInNewWindow()}
    >
      {props.code}
    </div>
  );
}

export function PreCode(props: { children: any }) {
  const ref = useRef<HTMLPreElement>(null);
  const refText = ref.current?.innerText;
  const [mermaidCode, setMermaidCode] = useState("");

  const renderMermaid = useDebouncedCallback(() => {
    if (!ref.current) return;
    const mermaidDom = ref.current.querySelector("code.language-mermaid");
    if (mermaidDom) {
      setMermaidCode((mermaidDom as HTMLElement).innerText);
    }
  }, 600);

  useEffect(() => {
    setTimeout(renderMermaid, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refText]);

  return (
    <>
      {mermaidCode.length > 0 && (
        <Mermaid code={mermaidCode} key={mermaidCode} />
      )}
      <pre ref={ref}>
        <span
          className="copy-code-button"
          onClick={() => {
            if (ref.current) {
              const code = ref.current.innerText;
              copyToClipboard(code);
            }
          }}
        ></span>
        {props.children}
      </pre>
    </>
  );
}

function escapeDollarNumber(text: string) {
  let escapedText = "";

  for (let i = 0; i < text.length; i += 1) {
    let char = text[i];
    const nextChar = text[i + 1] || " ";

    if (char === "$" && nextChar >= "0" && nextChar <= "9") {
      char = "\\$";
    }

    escapedText += char;
  }

  return escapedText;
}

function escapeBrackets(text: string) {
  const pattern =
    /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(
    pattern,
    (match, codeBlock, squareBracket, roundBracket) => {
      if (codeBlock) {
        return codeBlock;
      } else if (squareBracket) {
        return `$$${squareBracket}$$`;
      } else if (roundBracket) {
        return `$${roundBracket}$`;
      }
      return match;
    },
  );
}

function _MarkDownContent(props: { content: string }) {
  const escapedContent = useMemo(() => {
    return escapeBrackets(escapeDollarNumber(props.content));
  }, [props.content]);
  //console.log(escapedContent)
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        RehypeKatex,
        [
          RehypeHighlight,
          {
            detect: false,
            ignoreMissing: true,
          },
        ],
      ]}
      components={{
        pre: PreCode,
        p: (pProps) => <p {...pProps} dir="auto" />,
        a: (aProps) => {
          const href = aProps.href || "";
          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? "_self" : aProps.target ?? "_blank";
          return <a {...aProps} target={target} />;
        },
      }}
    >
      {escapedContent}
    </ReactMarkdown>
  );
}

export const MarkdownContent = React.memo(_MarkDownContent);

export function Markdown(
  props: {
    content: string;
    loading?: boolean;
    fontSize?: number;
    parentRef?: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="markdown-body"
      style={{
        fontSize: `${props.fontSize ?? 14}px`,
      }}
      ref={mdRef}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
      dir="auto"
    >
      {props.loading ? (
        <LoadingIcon />
      ) : (
        <MarkdownContent content={props.content} />
      )}
    </div>
  );
}
*/