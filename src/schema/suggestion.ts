import { z } from "zod"

export const SuggestionSchema = z.object({
    name: z.string(),
    content: z.string()
})
export type Suggestion = z.infer<typeof SuggestionSchema>

export const defaultSuggestions: Suggestion[] = [
    {
        name: "汽车推荐",
        content: "预算20万左右，主要城市通勤，偶尔自驾游，推荐几款省油、空间大的SUV车型。"
    },
    {
        name: "性能查询",
        content: "帮我查询一下2024款某品牌2.0T车型的百公里加速时间、最大马力和油耗表现。"
    },
    {
        name: "数据对比",
        content: "对比一下两款热门新能源车型的续航里程、电池容量、充电时间以及辅助驾驶配置。"
    },
]