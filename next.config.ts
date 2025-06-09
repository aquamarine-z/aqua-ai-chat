import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    webpack(config, options) {
        // 找到默认的处理svg的规则，并排除 .svg 文件
        const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'));
        if (fileLoaderRule) {
            fileLoaderRule.exclude = /\.svg$/i;
        }

        // 添加 SVGR 的处理规则
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
};

export default nextConfig;
