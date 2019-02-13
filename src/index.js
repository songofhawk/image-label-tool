//测试webpack打包
import {GraphAxisManager} from "./graph/GraphAxis";
import {GraphImageManager} from "./graph/GraphImage";

let hello = function () {
    let textWrapper = document.createElement("div");
    textWrapper.innerText = "hello from webpack";
    document.body.appendChild(textWrapper);
};

hello();

/**
 * 测试数据
 * @type {{productImageWithMark: {pgAreaImageLabels: {infoType: string, pImageId: number, points: string, id: number, deleteState: number, createTime: string, updateTime: string, createBy: number, updateBy: number}[]}, side: {originX: number, originY: number, areas: {pgDesignId: number, pgDesignSideId: number, infoType: string, infoValue: string, matterWidth: number, matterHeight: number, matterX: number, matterY: number, aspectRatio: number, matterColor: string, craftCode: string, imageWidth: number, imageHeight: number, imageX: number, imageY: number, imageColor: string, shape: string, font: string, text: string, areaForSpecs: {pgDesignAreaId: number, specName: string, specValue: string, matterWidth: number, matterHeight: number, matterX: number, matterY: number, matterColor: string, craftCode: string, id: number, deleteState: number, createTime: string, updateTime: string, createBy: number, updateBy: number}[], id: number, deleteState: number, createTime: string, updateTime: string, createBy: number, updateBy: number}[]}}}
 */
let data = {
    "productImageWithMark": {
        "pgAreaImageLabels": [{
            "infoType": "LOGO",
            "pImageId": 94,
            "points": "[{\"x\":131,\"y\":156},{\"x\":236,\"y\":151},{\"x\":201,\"y\":200},{\"x\":124,\"y\":200}]",
            "id": 289,
            "deleteState": 0,
            "createTime": "2018-08-29 18:03:01",
            "updateTime": "2018-08-29 18:03:01",
            "createBy": 10,
            "updateBy": 10
        }]
    },
    side:{
        originX:464,
        originY:201,
        areas:[{
            "pgDesignId": 186,
            "pgDesignSideId": 91,
            "infoType": "LOGO",
            "infoValue": "",
            "matterWidth": 1,
            "matterHeight": 1,
            "matterX": 1,
            "matterY": 1,
            "aspectRatio": 1,
            "matterColor": "",
            "craftCode": "",
            "imageWidth": 96,
            "imageHeight": 98,
            "imageX": 125,
            "imageY": 181,
            "imageColor": "#000000",
            "shape": "SQUARE_DIAMOND",
            "font": "宋体,b,i",
            "text": "请输入",
            "areaForSpecs": [
                {
                    "pgDesignAreaId": 191,
                    "specName": "",
                    "specValue": "",
                    "matterWidth": 1,
                    "matterHeight": 1,
                    "matterX": 1,
                    "matterY": 1,
                    "matterColor": "",
                    "craftCode": "",
                    "id": 170,
                    "deleteState": 0,
                    "createTime": "2018-11-01 18:53:59",
                    "updateTime": "2018-11-01 18:53:59",
                    "createBy": 1,
                    "updateBy": 1
                }
            ],
            "id": 191,
            "deleteState": 0,
            "createTime": "2018-11-01 18:53:59",
            "updateTime": "2018-11-01 18:53:59",
            "createBy": 1,
            "updateBy": 1
        }]
    }
};

/**-------------------------
 * 正式开始初始化画板
 * -------------------------
 */
import {GraphPanel} from './panel/GraphPanel.js';
import {GraphPointAreaManager} from "./graph/GraphPointArea";
const panel = new GraphPanel({
    containerId:'image-label-area',
    bkImgUrl:'./resource/image/jd.jpg',
    onDrawn: (graph) => {
        console.log('graph "' + graph.code + '" is drawn.');
        showJsonData();
    },
    onSetProperty: (graph) => {
        console.log('graph "' + graph.code + '" will be set properties.');
    },
    onDelete: (graph) => {
        console.log('graph "' + graph.code + '" is deleted.');
        showJsonData();
    },
    onChange: (graph) =>{
        console.log('graph "' + graph.code + '" is updated.');
        showJsonData();
    }
});
/**
 *  初始化绘制工具
 */
const axisManager = new GraphAxisManager(panel);
const imageManager = new GraphImageManager(panel,{
    data:data,
    for:'side.areas',
    mapping:[{
        data:'imageX',
        graph:'x'
    },{
        data:'imageY',
        graph:'y'
    }],
    dataKey: 'id'
});
const pointAreaManager = new GraphPointAreaManager(panel,{
    data:data,
    for:'productImageWithMark.pgAreaImageLabels',
    mapping:[{
        data:'points[x,y]',
        dataType:"Json",
        graph:'absolutePoints[x,y]',
    },{
        data:'id',
        graph:'code'
    }],
    dataKey: 'id'
});

/*处理事件*/
document.querySelector('#btn-draw-coord').addEventListener('click',function (event) {
    panel.draw(axisManager);
});
document.querySelector('#btn-draw-image').addEventListener('click',function (event) {
    imageManager.draw({
        x:10,
        y:10,
        width:50,
        height:50,
        src:'./resource/image/f.jpg',

    },{
        infoType:'LOGO'
    });
});

document.querySelector('#btn-draw-point-area').addEventListener('click',function (event) {
    pointAreaManager.draw();
});

function showJsonData() {
    let jsonArea = document.querySelector('#json');
    jsonArea.textContent = JSON.stringify(data, null, '  ');

    let jsonContainer = document.querySelector('#json-container');

    if (showJsonData.color === true){
        jsonContainer.style.backgroundColor='White';
        showJsonData.color = false;
    }else{
        jsonContainer.style.backgroundColor = 'AntiqueWhite';
        showJsonData.color = true;
    }
}
showJsonData();

// 选择不再是一个Operator
// document.querySelector('#btn-select-image').addEventListener('click',function (event) {
//     panel.select(graphImageManager);
// });

// document.querySelector('#btn-listen').addEventListener('click',function (event) {
//     panel.listenEvent(true);
// });
// document.querySelector('#btn-notlisten').addEventListener('click',function (event) {
//     panel.listenEvent(false);
// });