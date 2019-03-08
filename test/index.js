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
            "imageWidth": 50,
            "imageHeight": 50,
            "imageX": 225,
            "imageY": 381,
            "imageColor": "#000000",
            "shape": "SQUARE_DIAMOND",
            "image": "./resource/image/f.jpg",
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
        },{
            "id":192,
            "pgDesignId": 186,
            "pgDesignSideId": 91,
            "infoType": "TEXT",
            "infoValue": "",
            "imageWidth": 160,
            "imageHeight": 20,
            "imageX": 285,
            "imageY": 481,
            "imageColor": "#000000",
            "font": "宋体,b,i",
            "text": "买啥都有自家Logo",
            "createBy": 1,
            "updateBy": 1
        }]
    }
};

/**-------------------------
 * 正式开始初始化画板
 * -------------------------
 */
let currentTextGraph = null;
const currentTextEle = document.getElementById('current-text');
const panel = new GraphPanel({
    containerId:'image-label-area',
    bkImgUrl:'./resource/image/jd.jpg',
    // width:600,
    // height:600,
    onDrawn: (graph) => {
        console.log('graph "' + graph.code + '" is drawn.');
        showJsonData();
    },
    onSetProperty: (graph) => {
        console.log('graph "' + graph.code + '" will be set properties.');
        if (graph.clone){
            graph.clone({x:20,y:10});
        }
    },
    onDelete: (graph) => {
        console.log('graph "' + graph.code + '" is deleted.');
        showJsonData();
    },
    onChange: (graph) =>{
        console.log('graph "' + graph.code + '" is updated.');
        showJsonData();
    },
    onDbClick: (graph) =>{
        console.log('graph "' + graph.code + '" is double clicked.');
        if (graph instanceof GraphText){
            currentTextGraph = graph;
            currentTextEle.innerText = graph.text;
        }
    },
    onCreate:()=>{
        axisManager.create();
        pointAreaManager.create();
        imageTextManager.create();
    }
});


/**
 *  初始化绘制工具
 */
const axisManager = new GraphAxisManager(panel,{
    data:data,
    for:'side',
    mapping:[{
        data:'originX',
        graph:'x'
    },{
        data:'originY',
        graph:'y'
    }]
});


const areaText = data.side.areas[1];
const fontArray = areaText.font.split(',');
if (fontArray.length>0) {
    areaText.fontFamily = fontArray[0];
}
if (fontArray.length>1) {
    let style = fontArray[1];
    if (style==='b'){
        style='bold';
    }
    if (style==='i'){
        style='italic';
    }
    areaText.fontStyle = style;
}

const imageTextManager = new GraphImageTextManager(panel,{
    data:data,
    for:'side.areas',
    mapping:[{
        data:'imageX',
        graph:'x'
    },{
        data:'imageY',
        graph:'y'
    },{
        data:'imageWidth',
        graph:'realWidth'
    },{
        data:'imageHeight',
        graph:'realHeight'
    },{
        data:'text',
        graph:'text'
    },{
        data:'image',
        graph:'src'
    },{
        data:'infoType',
        graph:'graphType'
    },{
        data:'fontFamily',
        graph:'fontFamily'
    },{
        data:'fontStyle',
        graph:'fontStyle'
    },{
        data:'color',
        graph:'color'
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
    },{
        data:'infoType',
        graph:'graphType'
    }],
    dataKey: 'id'
});


// //Graph3DImageTextManager被拆解了,需要重新引用
// const threeDImageTextManager = new Graph3DImageTextManager(panel,{
//     data:data,
//     for:'side.areas',
//     mapping:[{
//         data:'imageX',
//         graph:'x'
//     },{
//         data:'imageY',
//         graph:'y'
//     },{
//         data:'imageWidth',
//         graph:'realWidth'
//     },{
//         data:'imageHeight',
//         graph:'realHeight'
//     },{
//         data:'text',
//         graph:'text'
//     },{
//         data:'image',
//         graph:'src'
//     },{
//         data:'infoType',
//         graph:'graphType'
//     }],
//     dataKey: 'id'
// });


/**
 * 处理事件
 *
 */
document.querySelector('#btn-draw-coord').addEventListener('click',function () {
    panel.draw(axisManager);
});
document.querySelector('#btn-draw-image').addEventListener('click',function () {
    imageTextManager.draw({
        x:10,
        y:10,
        realWidth:50,
        realHeight:50,
        src:'./resource/image/f.jpg',
        graphType:'LOGO'
    });
});

document.querySelector('#btn-draw-text').addEventListener('click',function () {
    imageTextManager.draw({
        x:10,
        y:10,
        realWidth:160,
        realHeight:20,
        text:'买啥都有自家logo',
        graphType:'TEXT'
    });
});

document.querySelector('#btn-draw-point-area').addEventListener('click',function () {
    pointAreaManager.draw({
        graphType:'TEXT'
    });
});

// //Graph3DImageTextManager被拆解了,需要重新引用
// document.querySelector('#btn-draw-3d-image').addEventListener('click',function () {
//     threeDImageTextManager.draw({
//         x:10,
//         y:10,
//         realWidth:50,
//         realHeight:50,
//         src:'./resource/image/f.jpg',
//         graphType:'LOGO'
//     });
// });

document.querySelector('#btn-set-font').addEventListener('click',function () {
    if (currentTextGraph instanceof GraphText){
        let fontFamily = document.getElementById('input-font-family').value;
        if (fontFamily){
            currentTextGraph.setFontFamily(fontFamily);
        }
        let fontSize = document.getElementById('input-font-size').value;
        if (fontSize){
            currentTextGraph.setFontSize(parseInt(fontSize));
        }
        let fontColor = document.getElementById('input-font-color').value;
        if (fontColor){
            currentTextGraph.setColor(fontColor);
        }
    }
});
document.querySelector('#btn-set-bold').addEventListener('click',function () {
    if (currentTextGraph instanceof GraphText){
        currentTextGraph.setFontStyle('bold');
    }
});
document.querySelector('#btn-set-italic').addEventListener('click',function () {
    if (currentTextGraph instanceof GraphText){
        currentTextGraph.setFontStyle('italic');
    }
});
document.querySelector('#btn-set-normal').addEventListener('click',function () {
    if (currentTextGraph instanceof GraphText){
        currentTextGraph.setFontStyle('normal');
    }
});

document.querySelector('#btn-to-data-url').addEventListener('click',function () {
    console.log(panel.toDataUrl());
});

/**
 * 显示调试数据
 */
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