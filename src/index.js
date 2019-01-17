//测试webpack打包
import {GraphAxis, GraphAxisManager} from "./graph/GraphAxis";

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
const panel = new GraphPanel(document.querySelector('#image-label-area'), './resource/image/jd.jpg');
const graphAxixDrawing = new GraphAxisManager(panel);

/*处理事件*/
document.querySelector('#btn-draw-coord').addEventListener('click',function (event) {
    panel.draw(graphAxixDrawing);
});