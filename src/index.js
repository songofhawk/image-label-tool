//测试webpack打包
import {GraphAxisManager} from "./graph/GraphAxis";
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
import {GraphPointAreaManager} from "./graph/GraphPointArea";
const panel = new GraphPanel('image-label-area', './resource/image/jd.jpg');
const axisManager = new GraphAxisManager(panel);
const imageManager = new GraphImageManager(panel);
const pointAreaManager = new GraphPointAreaManager(panel);

/*处理事件*/
document.querySelector('#btn-draw-coord').addEventListener('click',function (event) {
    panel.draw(axisManager);
});
document.querySelector('#btn-draw-image').addEventListener('click',function (event) {
    panel.draw(imageManager, {
        x:10,
        y:10,
        width:50,
        height:50,
        src:'./resource/image/f.jpg'
    });
});

document.querySelector('#btn-draw-point-area').addEventListener('click',function (event) {
    panel.draw(pointAreaManager);
});

// 选择不再是一个Operator
// document.querySelector('#btn-select-image').addEventListener('click',function (event) {
//     panel.select(graphImageManager);
// });


document.querySelector('#btn-listen').addEventListener('click',function (event) {
    panel.listenEvent(true);
});
document.querySelector('#btn-notlisten').addEventListener('click',function (event) {
    panel.listenEvent(false);
});