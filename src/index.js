//测试webpack打包
let hello = function () {
    let textWrapper = document.createElement("div");
    textWrapper.innerText = "hello from webpack";
    document.body.appendChild(textWrapper);
};

hello();


import {ImageLabelTool} from './image_label/ImageLabelTool.js';
let labelTool = new ImageLabelTool(document.querySelector('#image-area'));
labelTool.add();