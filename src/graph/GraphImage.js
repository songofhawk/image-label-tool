import Konva from 'konva';
import {Graph} from "./Graph";
import {GraphManager} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";


export class GraphImage extends Graph{
    constructor(manager,graphOption) {
        super(manager,graphOption);

        let wrapper = this._graphWrapper;

        let imageObj = new Image();
        let self = this;

        imageObj.onload = function() {
            let image = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: graphOption.realWidth,
                height: graphOption.realHeight,
                listening:true
            });
            wrapper.add(image);
            wrapper._image = image;

            let decor = new Konva.Rect({
                x: - 1,
                y: - 1,
                width: graphOption.realWidth+1,
                height: graphOption.realHeight+1,
                fillEnabled: false,
                stroke: 'LightGray',
                strokeWidth: 3
            });
            decor.hide();
            wrapper.decor = decor;
            wrapper.add(decor);

            if (graphOption.bindEvent){
                self._bindEvent(image);
            }
            self._layer.draw();

        };
        imageObj.src = graphOption.src;
        this.src = graphOption.src;
        this._image = imageObj;

    }

    moveTo(screenPoint){
        if (!this._graphWrapper){
            return;
        }
        this._graphWrapper.setX(screenPoint.x);
        this._graphWrapper.setY(screenPoint.y);
    }

    select(){
        this.setEditable(true);
        super.select();
    }

    /**
     * 取消选择
     */
    deSelect(){
        this.setEditable(false);
        super.deSelect();
    }

    delete(){
        this.setEditable(false);
        super.delete();
    }

    highlight(){
        this._graphWrapper.decor.show();
        super.highlight();
    }

    unHighlight(){
        this._graphWrapper.decor.hide();
        super.unHighlight();
    }

    onDrawingOver(){
        this._bindEvent(this._graphWrapper._image);

        this.genAbsolutePosition();
        super.onDrawingOver();
    }

    onChange(){
        this.genAbsolutePosition();
        super.onChange();
    }

    genAbsolutePosition(){
        let wrapper = this._graphWrapper;
        let pos = wrapper.getAbsolutePosition();
        this.x = pos.x;
        this.y = pos.y;
        this.realWidth = wrapper.width()*wrapper.scaleX();
        this.realHeight = wrapper.height()*wrapper.scaleY();
    }
}

export class GraphImageManager extends GraphManager{
    constructor(panel,dataMappingConfig){
        super(panel,dataMappingConfig);
        this._drawingHandler = new ImageDrawingHandler(this);
        //this.create();
    }

    _createGraphObjByDesc(desc){
        return new GraphImage(this,desc);
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



