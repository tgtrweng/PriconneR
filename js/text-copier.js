/**
 * テキストエリアの内容をコピーする機能を提供するクラス。
 */
class TextCopier {

    /**
     * コピー対象の要素を特定するための data 属性名。
     * @type {string}
     */
    static ATTRIBUTE_DATA_TARGET = 'data-target';

    /**
     * コピー用ボタンのクラス名。
     * @type {string}
     */
    static SELECTER_COPY_BUTTON = '.copy-btn';

    /**
     * TextCopier のインスタンスを初期化する。
     * 対象のボタンを取得し、クリックイベントを設定する。
     */
    constructor() {
        /**
         * コピー用のボタン要素一覧。
         * @type {NodeListOf<HTMLButtonElement>}
         */
        this.buttons = document.querySelectorAll(TextCopier.SELECTER_COPY_BUTTON);
        this.init();
    }

    /**
     * ボタンに対してクリックイベントリスナーを設定する。
     * 対象のテキストエリアからテキストを取得し、コピー処理を実行する。
     */
    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute(TextCopier.ATTRIBUTE_DATA_TARGET);
                const textarea = document.getElementById(targetId);
                if (textarea) {
                    this.copyToClipboard(textarea);
                }
            });
        });
    }

    /**
     * 指定されたテキストエリアの内容をクリップボードにコピーする。
     * モダンなAPI（navigator.clipboard）を優先し、対応していない場合は古い方法を使用する。
     *
     * @param {HTMLTextAreaElement} textarea - コピー対象のテキストエリア。
     */
    copyToClipboard(textarea) {
        const text = textarea.value;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    // TODO:成功時の処理
                })
                .catch(() => {
                    // TODO:失敗時の処理
                });
        } else {
            textarea.focus();
            textarea.select();
            textarea.setSelectionRange(0, 99999); // モバイル対応

            try {
                document.execCommand("copy");
                // TODO:成功時の処理
            } catch (err) {
                // TODO:失敗時の処理
            }
        }
    }
}

// クラスをインスタンス化して起動
window.addEventListener('DOMContentLoaded', () => {
    new TextCopier();
});