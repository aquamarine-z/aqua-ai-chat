export const zh_cn = {
    "confirm": "确定",
    "cancel": "取消",
    "page-header.title": "Aqua AI Chat",

    "input-box.input.placeholder": "请输入你的问题 (Enter 发送，Shift+Enter 换行)",
    "input-box.attachment.title": "附件上传",
    "input-box.attachment.upload.label": "上传附件",
    "input-box.attachment.upload.button": "上传",
    "input-box.attachment.upload.message": "拖拽以上传附件",
    "input-box.attachment.upload.recent": "最近文件",
    "chat-fragment.thinking.thinking-title": (startTime: number, finishTime: number, finished: boolean) => {
        //console.log(finished)
        if (finished) return `思考完成 共用时 ${Math.floor((finishTime - startTime) / 1000)} 秒`;
        else return `正在思考 已用时 ${Math.floor((Date.now() - startTime) / 1000)} 秒`
    },
    "chat-fragment.actions.copy": "复制",
    "chat-fragment.actions.copy.success": "已复制内容到剪贴板",
    "chat-fragment.actions.copy.fail": "复制失败，请检查相关权限",
    "chat-fragment.actions.retry": "重试",
    "chat-fragment.actions.good-feedback": "点赞此内容",
    "chat-fragment.actions.bad-feedback": "不喜欢此内容",

    "chat-fragment.suggestion.suggestion-title": "猜你想问",

    "chat-session-selector.session.delete": "删除会话",
    "chat-session-selector.session.delete.dialog.title": "删除会话",
    "chat-session-selector.session.delete.dialog.content": "是否确认删除会话?",
    "chat-session-selector.session.rename": "重命名会话",
    "chat-session-selector.session.rename.dialog.title": "重命名会话",
    "chat-session-selector.session.rename.dialog.content": "请输入会话名称",

    "markdown-renderer.pre.header.copy.button": "复制代码",
    "markdown-renderer.pre.header.copy.success": "已复制到剪贴板",
    "markdown-renderer.pre.header.copy.fail": "复制失败，请检查相关权限",

    "theme.toggle.to-light": "切换到浅色主题",
    "theme.toggle.to-dark": "切换到深色主题",
    "theme.toggle.to-system": "切换到系统主题",

    "sidebar.navigator.settings": "设置",
    "sidebar.navigator.presets": "预设",

    "sidebar.chat-list.title": "聊天列表",

    "settings.settings.label": "设置",
    "settings.general.label": "总览",
    "settings.general.language.label": "语言",
    "settings.general.theme.label": "主题",
    "settings.general.general.label": "通用",
    "settings.AI-Models.label": "AI 模型",


}