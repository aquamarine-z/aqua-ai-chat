import {zh_cn} from "@/locales/zh_cn";

export const en = {
    ...zh_cn,

    "confirm": "Confirm",
    "cancel": "Cancel",
    "page-header.title": "Aqua AI Chat",

    "input-box.input.placeholder": "What do you want to know?",
    "input-box.attachment.title": "Upload",
    "input-box.attachment.upload.label": "Attachment Upload",
    "input-box.attachment.upload.button": "Upload",
    "input-box.attachment.upload.message": "Drag here to upload",
    "input-box.attachment.upload.recent": "Recent",

    "chat-fragment.thinking.thinking-title": (startTime: number, finishTime: number, finished: boolean) => {
        if (finished) return `Thinking finished Time cost: ${Math.floor((finishTime - startTime) / 1000)} s`;
        else return `Thinking already cost ${Math.floor((Date.now() - startTime) / 1000)} s`
    },

    "chat-fragment.actions.copy": "Copy",
    "chat-fragment.actions.copy.success": "Copied to clipboard",
    "chat-fragment.actions.copy.fail": "Failed to copy. Please check permission settings",
    "chat-fragment.actions.retry": "Retry",
    "chat-fragment.actions.good-feedback": "Like",
    "chat-fragment.actions.bad-feedback": "Dislike",

    "chat-fragment.suggestion.suggestion-title": "You might want to ask",

    "chat-session-selector.session.delete": "Delete Session",
    "chat-session-selector.session.delete.dialog.title": "Delete Session",
    "chat-session-selector.session.delete.dialog.content": "Are you sure you want to delete this session?",
    "chat-session-selector.session.rename": "Rename Session",
    "chat-session-selector.session.rename.dialog.title": "Rename Session",
    "chat-session-selector.session.rename.dialog.content": "Please enter a session name",

    "markdown-renderer.pre.header.copy.button": "Copy Code",
    "markdown-renderer.pre.header.copy.success": "Copied to clipboard",
    "markdown-renderer.pre.header.copy.fail": "Copy failed. Please check permission settings",

    "theme.toggle.to-light": "Switch to Light Theme",
    "theme.toggle.to-dark": "Switch to Dark Theme",
    "theme.toggle.to-system": "Switch to System Theme",

    "sidebar.navigator.settings": "Settings",
    "sidebar.navigator.presets": "Presets",

    "sidebar.chat-list.title": "Chat List",

    "settings.settings.label": "Settings",
    "settings.general.label": "Overview",
    "settings.general.language.label": "Language",
    "settings.general.theme.label": "Theme",
    "settings.general.general.label": "General",
    "settings.AI-Models.label": "AI Models",

    "settings.general.language.title": "Language Settings",
    "settings.general.language.app-language": "App Language",
    "settings.general.language.app-language.set.success": "Language changed successfully",
    "settings.general.language.app-language.set.fail": "Failed to change language",

    "chat-session-menu.actions.rename": "Rename Session",
    "chat-session-menu.actions.delete": "Delete Session",
    "chat-session-menu.actions.settings": "Settings",

    "dialog.rename.title": "Rename Session",
    "dialog.rename.input.placeholder": "Please enter a new session name",
    "dialog.rename.button.confirm": "Save",
    "dialog.rename.button.cancel": "Cancel",
};
