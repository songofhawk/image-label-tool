import Konva from 'konva';
import {Graph} from "./Graph";
import {GraphManager} from "../manager/GraphManager";
import {AbstractDrawingOperator} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";


export class GraphImage extends Graph{
    constructor(manager,config) {
        super(manager);

        let layer = this._layer;
        this._graphWrapper = new Konva.Group({
            x:0,
            y:0,
            width: config.width,
            height: config.height,
            draggable:true
        });
        layer.add(this._graphWrapper);

        let imageObj = new Image();
        let self = this;

        imageObj.onload = function() {
            let image = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: config.width,
                height: config.height,
                listening:true
            });
            self._graphWrapper.add(image);
            self._graphWrapper.image = image;

            let decor = new Konva.Rect({
                x: - 1,
                y: - 1,
                width: config.width+1,
                height: config.height+1,
                fillEnabled: false,
                stroke: 'LightGray',
                strokeWidth: 3
            })
            decor.hide();
            self._graphWrapper.decor = decor;
            self._graphWrapper.add(decor);
            self._bindEvent(image);
        };
        imageObj.src = config.src;

        // this._graphWrapper.on("mouseover", function (e) {
        //     console.log('mouse over on group: '+self.code);
        // })


    }

    create(callBack){

    }

    moveTo(screenPoint){
        if (!this._graphWrapper){
            return;
        }
        this._graphWrapper.setX(screenPoint.x);
        this._graphWrapper.setY(screenPoint.y);
    }

    select(){
        // this._graphWrapper.decor.stroke('#FFCC99');
        // this._graphWrapper.decor.show();
        this.setEditable(true);
        super.select();
    }

    /**
     * 取消选择
     */
    deSelect(){
        // this._graphWrapper.decor.stroke('LightGray');
        // this._graphWrapper.decor.hide();

        this.setEditable(false);
        super.deSelect();
    }

    delete(){

    }

    isPointOn(point){
        let x=point.x, y=point.y;
        let graph = this._graphWrapper;
        let minX = graph.x(), minY = graph.y(),
            maxX = graph.x()+graph.width(),
            maxY = graph.y()+graph.height();
        if (x>=minX && y>=minY && x<=maxX && y<=maxY){
            return true;
        }
        return false;
    }

    highlight(){
        this._graphWrapper.decor.show();
    }

    unHighlight(){
        this._graphWrapper.decor.hide();
    }

    setEditable(editable){
        if (editable){
            if (this.tr){
                this.tr.show();
                return;
            }
            let tr = new Konva.Transformer();
            this._layer.add(tr);

            let group = this._graphWrapper;
            tr.attachTo(group);
            this.tr = tr;
        }else{
            if (!this.tr){
                return;
            }
            this.tr.hide();
            // this.tr.destroy();
            // this.tr = null;
        }
        this.ediable = editable;

        // 在transform结束的时候,把scale调整为实际的宽和高,但效果并不好, 点击图片中心会缩回去
        // 代码来自官网的一个回答: https://konvajs.github.io/docs/select_and_transform/Basic_demo.html
        // group.on('transformend', function () {
        //     console.log('transform end');
        //     group.setAttrs({
        //         width: group.width() * group.scaleX(),
        //         height: group.height() * group.scaleY(),
        //         scaleX: 1,
        //         scaleY: 1,
        //     })
        // });
    }

}

export class GraphImageManager extends GraphManager{
    constructor(panel){
        super(panel);
        this._drawingHandler = new ImageDrawingHandler(this);
    }

}

class ImageDrawingHandler extends DrawingHandler{
    constructor(manager){
        super(manager);
    }

    stepStart(config){
        let graph = new GraphImage(this._manager, config);
        this._stage.container().style.cursor = 'crosshair';
        super.stepStart(graph);
    }

    stepMove(screenPoint, step){
        this._graph.moveTo(screenPoint);
        super.stepMove();
    }

    stepDown(screenPoint, step){
        super.stepDown();
    }

    stepUp(screenPoint, step){
        super.stepUp();
    }

    stepOver(screenPoint, step){
        this._stage.container().style.cursor = 'default';
        super.stepOver(screenPoint, step);
    }


    get stepCount(){
        return 1;
    }
}



