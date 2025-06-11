import {zh_cn} from "@/locales/zh_cn";

export const jp = {
    ...zh_cn,

    "confirm": "確認",
    "cancel": "キャンセル",
    "page-header.title": "Aqua AI チャット",

    "input-box.input.placeholder": "知りたいことを入力してください",
    "input-box.attachment.title": "添付ファイル",
    "input-box.attachment.upload.label": "添付ファイルをアップロード",
    "input-box.attachment.upload.button": "アップロード",
    "input-box.attachment.upload.message": "ここにドラッグしてアップロード",
    "input-box.attachment.upload.recent": "最近のファイル",

    "chat-fragment.thinking.thinking-title": (startTime: number, finishTime: number, finished: boolean) => {
        if (finished) return `思考完了 所要時間: ${Math.floor((finishTime - startTime) / 1000)} 秒`;
        else return `思考中 経過時間: ${Math.floor((Date.now() - startTime) / 1000)} 秒`;
    },

    "chat-fragment.actions.copy": "コピー",
    "chat-fragment.actions.copy.success": "クリップボードにコピーしました",
    "chat-fragment.actions.copy.fail": "コピーに失敗しました。権限をご確認ください",
    "chat-fragment.actions.retry": "再試行",
    "chat-fragment.actions.good-feedback": "いいね",
    "chat-fragment.actions.bad-feedback": "よくない",

    "chat-fragment.suggestion.suggestion-title": "こちらの質問ですか？",

    "chat-session-selector.session.delete": "セッションを削除",
    "chat-session-selector.session.delete.dialog.title": "セッションを削除",
    "chat-session-selector.session.delete.dialog.content": "本当にこのセッションを削除しますか？",
    "chat-session-selector.session.rename": "セッション名を変更",
    "chat-session-selector.session.rename.dialog.title": "セッション名を変更",
    "chat-session-selector.session.rename.dialog.content": "セッション名を入力してください",

    "markdown-renderer.pre.header.copy.button": "コードをコピー",
    "markdown-renderer.pre.header.copy.success": "クリップボードにコピーしました",
    "markdown-renderer.pre.header.copy.fail": "コピーに失敗しました。権限をご確認ください",

    "theme.toggle.to-light": "ライトテーマに切り替え",
    "theme.toggle.to-dark": "ダークテーマに切り替え",
    "theme.toggle.to-system": "システムテーマに切り替え",

    "sidebar.navigator.settings": "設定",
    "sidebar.navigator.presets": "プリセット",

    "sidebar.chat-list.title": "チャット一覧",

    "settings.settings.label": "設定",
    "settings.general.label": "概要",
    "settings.general.language.label": "言語",
    "settings.general.theme.label": "テーマ",
    "settings.general.general.label": "一般",
    "settings.AI-Models.label": "AIモデル",

    "settings.general.language.title": "言語設定",
    "settings.general.language.app-language": "アプリの言語",
    "settings.general.language.app-language.set.success": "言語の変更に成功しました",
    "settings.general.language.app-language.set.fail": "言語の変更に失敗しました",
};
