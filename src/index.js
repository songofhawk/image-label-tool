//测试webpack打包
import {GraphAxis, GraphAxisManager} from "./graph/GraphAxis";
import {GraphImageManager} from "./graph/GraphImage";

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
const panel = new GraphPanel('image-label-area', './resource/image/jd.jpg');
const graphAxisManager = new GraphAxisManager(panel);
const graphImageManager = new GraphImageManager(panel);

/*处理事件*/
document.querySelector('#btn-draw-coord').addEventListener('click',function (event) {
    panel.draw(graphAxisManager);
});
document.querySelector('#btn-draw-image').addEventListener('click',function (event) {
    panel.draw(graphImageManager, {
        x:10,
        y:10,
        width:50,
        height:50,
        src:'./resource/image/f.jpg'
    });
});

document.querySelector('#btn-select-image').addEventListener('click',function (event) {
    panel.select(graphImageManager, {
        x:10,
        y:10,
        width:50,
        height:50,
        src:'./resource/image/f.jpg'
    });
});
document.querySelector('#btn-listen').addEventListener('click',function (event) {
    panel.listenEvent(true);
});
document.querySelector('#btn-notlisten').addEventListener('click',function (event) {
    panel.listenEvent(false);
});