/**
 * タイムライン文字列を指定のオフセットに基づいて変換し、
 * 指定された出力欄に結果を表示するクラス。
 */
class TLReWriter {
    /**
     * 持越し時間を入力するselectタグのID。
     * @type {string}
     */
    static ID_TIME_INPUT = 'timeInput';
    
    /**
     * タイムラインを入力するinputタグのID。
     * @type {string}
     */
    static ID_TL_INPUT = 'tlInput';

    /**
     * タイムラインを出力するinputタグのID。
     * @type {string}
     */
    static ID_TL_OUTPUT = 'tlOutput';
    
    /**
     * クリックするとタイムラインを変換するbuttonタグのID。
     * @type {string}
     */
    static ID_TL_SUBMIT = 'tlSubmit';

    constructor () {
        /** @type {HTMLSelectElement} */
        this.timeInput = document.getElementById(TLReWriter.ID_TIME_INPUT);
        
        /** @type {HTMLInputElement} */
        this.tlInput = document.getElementById(TLReWriter.ID_TL_INPUT);
        
        /** @type {HTMLInputElement} */
        this.tlOutput = document.getElementById(TLReWriter.ID_TL_OUTPUT);
        
        /** @type {HTMLButtonElement} */
        this.tlSubmit = document.getElementById(TLReWriter.ID_TL_SUBMIT);
        
        this.tlSubmit.addEventListener('click', () => this.tlRewrite());
    }

    /**
     * タイムラインを変換し、変換後の文字列を出力欄に表示する。
     */
    tlRewrite() {
        this.tlOutput.value = this.convertString(this.tlInput.value, this.timeInput.value);
        this.tlOutput.focus();
    }

    /**
     * タイムライン文字列を変換する。
     * - 全角のコロンや数字を半角に変換する。
     * - 時間を秒数で計算して指定のオフセットで調整する。
     * - 結果をMM:SS形式で返する。
     * - 改行文字を<br>タグに置換する。
     *
     * @param {string} inputString - 元のタイムライン文字列
     * @param {string|number} offset - 調整するオフセット時間（秒）
     * @returns {string} 変換後のタイムライン文字列（<br>タグ付き）
     */
    convertString(inputString, offset) {
        // 全角のコロン（：）を半角に置換
        let preConvertedString = inputString.replace(/：/g, ':');

        // 全角数字を半角に変換
        preConvertedString = preConvertedString.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));

        let convertedString = '';

        const regex = /([0-9]):([0-9][0-9])/;

        while (true) {
            const match = preConvertedString.match(regex);
            if (!match) break;

            const matchIndex = match.index;

            // 秒数表記より前の文字列を加える
            convertedString += preConvertedString.substring(0, matchIndex);

            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);

            let calculatedSeconds = minutes * 60 + seconds - (90 - offset);
            if (calculatedSeconds < 0) calculatedSeconds = 0;

            const calculatedMinutes = Math.floor(calculatedSeconds / 60);
            calculatedSeconds = calculatedSeconds % 60;

            convertedString += `${calculatedMinutes}:${calculatedSeconds.toString().padStart(2, '0')}`;

            // 残りの文字列に対し再度探索を行う
            preConvertedString = preConvertedString.substring(matchIndex + match[0].length);
        }

        convertedString += preConvertedString;

        // 改行を <br> に変換
        convertedString = convertedString.replace(/\n/g, '<br>');

        return convertedString;
    }

};

// クラスをインスタンス化して起動
window.addEventListener('DOMContentLoaded', () => {
    new TLReWriter();
});