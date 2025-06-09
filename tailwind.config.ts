import type {Config} from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', "./src/**/*.module.css",], // 根据你的项目结构修改
    theme: {
        extend: {},
    },
    darkMode: 'class', // 或 'media'
    plugins: [typography],
}

export default config