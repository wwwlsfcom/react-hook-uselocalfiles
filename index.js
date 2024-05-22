import {useEffect, useRef} from "react";

/**
 * 基于<input type=‘file’ />  封装了打开文件对话框获取本地文件的功能
 * @param accept 文件类型，比如“.png,.jpg"
 * @returns {{selectFiles: selectFiles}} selectFiles回调函数参数接受files参数， 即
 *  selectFiles: function((files:File[])=>void)
 */
export function useLocalFiles({accept}) {

    const selectFilesCallbackRef = useRef(null);
    const inputRef = useRef(null);

    const selectFiles = function (callback) {
        selectFilesCallbackRef.current = callback;
        if (inputRef.current !== null)
            inputRef.current.click();
    }

    useEffect(() => {

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.style.display = 'none';
        document.body.prepend(input);

        const listener = function (event) {
            if (typeof selectFilesCallbackRef.current === 'function')
                selectFilesCallbackRef.current(event.currentTarget.files);
        }

        input.addEventListener('change', listener);

        inputRef.current = input;

        return function () {
            input.removeEventListener('change', listener);
            input.remove();
        }

    }, [accept]);

    return {selectFiles};
}