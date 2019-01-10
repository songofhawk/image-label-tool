export class ImageLabelTool {
    constructor(canvasElement) {
        if (!canvasElement){
            throw "canvasElement parameter is mandatory!";
        }

        //测试fabric引用
        this.canvas = new fabric.Canvas(canvasElement, {
            selection: false,   //按照官方文档,是禁止了group selection
            width:600,
            height:600,
            hoverCursor:'pointer'
        });
    }

    add(graph){
        if (!graph){
            throw "graph parameter is mandatory!";
        }
        console.log(this.canvas);
    }

}