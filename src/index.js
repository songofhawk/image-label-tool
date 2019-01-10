//测试webpack打包
let hello = function () {
    let textWrapper = document.createElement("div");
    textWrapper.innerText = "hello from webpack";
    document.body.appendChild(textWrapper);
};

hello();

//测试fabric引用
let canvas = new fabric.Canvas(document.querySelector('#image-area'), {
    selection: false,   //按照官方文档,是禁止了group selection
    width:600,
    height:600,
    hoverCursor:'pointer'
});


console.log('canvas initialized!');

import ImageLabelTool from './image_label/ImageLabelTool.js';
let labelTool = new ImageLabelTool();
labelTool.add();