import Konva from 'konva';
import {Graph} from "./Graph";
import {GraphManager} from "../manager/GraphManager";
import {AbstractDrawingOperator} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";


export class GraphImage extends Graph{
    constructor(manager,graphOption) {
        super(manager);

        let layer = this._layer;
        let wrapper = this._graphWrapper = new Konva.Group({
            x:0,
            y:0,
            width: graphOption.width,
            height: graphOption.height,
            draggable:true
        });
        layer.add(wrapper);

        let imageObj = new Image();
        let self = this;

        imageObj.onload = function() {
            let image = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: graphOption.width,
                height: graphOption.height,
                listening:true
            });
            wrapper.add(image);
            wrapper.image = image;

            let decor = new Konva.Rect({
                x: - 1,
                y: - 1,
                width: graphOption.width+1,
                height: graphOption.height+1,
                fillEnabled: false,
                stroke: 'LightGray',
                strokeWidth: 3
            })
            decor.hide();
            wrapper.decor = decor;
            wrapper.add(decor);
            self._bindPointEvent(image);
        };
        imageObj.src = graphOption.src;

        wrapper.on("dragmove", function (e) {
            self.onMove(wrapper.getPosition());
        })

        wrapper.on("dragend", function (e) {
            self.onChange();
        })

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
        this.setEditable(false);
        super.delete();
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

    onDrawingOver(){
        this.genAbsolutePosition();
        super.onDrawingOver();
    }

    onChange(){
        this.genAbsolutePosition();
        super.onChange();
    }

    genAbsolutePosition(){
        let pos = this._graphWrapper.getAbsolutePosition();
        this.x = pos.x;
        this.y = pos.y;
    }

}

export class GraphImageManager extends GraphManager{
    constructor(panel,dataMappingConfig){
        super(panel,dataMappingConfig);
        this._drawingHandler = new ImageDrawingHandler(this);
    }

}

class ImageDrawingHandler extends DrawingHandler{
    constructor(manager){
        super(manager);
    }

    stepStart(graphOption){
        let graph = new GraphImage(this._manager, graphOption);
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
        this._graph.onDrawingOver();
        super.stepOver(screenPoint, step);
    }


    get stepCount(){
        return 1;
    }
}



