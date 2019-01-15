//测试webpack打包
let hello = function () {
    let textWrapper = document.createElement("div");
    textWrapper.innerText = "hello from webpack";
    document.body.appendChild(textWrapper);
};

hello();

/**-------------------------
 * 正式开始初始化工具
 * -------------------------
 */
import {GraphPanel} from './panel/GraphPanel.js';
let panel = new GraphPanel(document.querySelector('#image-label-area'), './resource/image/jd.jpg');
panel.add();