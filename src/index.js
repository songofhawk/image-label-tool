//测试webpack打包
let hello = function () {
    let textWrapper = document.createElement("div");
    textWrapper.innerText = "hello from webpack";
    document.body.appendChild(textWrapper);
};

hello();


import {GraphPanel} from './panel/GraphPanel.js';
let labelTool = new GraphPanel(document.querySelector('#image-area'));
labelTool.add();