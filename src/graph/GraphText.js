import Konva from 'konva';
import {Graph} from "./Graph";
import {GraphManager} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";


export class GraphText extends Graph{
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
            });
            decor.hide();
            wrapper.decor = decor;
            wrapper.add(decor);
            self._image = image;

            if (graphOption.bindEvent){
                self._bindEvent(image);
            }

        };
        imageObj.src = graphOption.src;

        if (graphOption.x && graphOption.y){
            this.moveTo(graphOption);
        }

        wrapper.on("dragmove", function () {
            self.onMove(wrapper.getAbsolutePosition());
        });

        wrapper.on("dragend", function () {
            self.onChange();
        });

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
        return x >= minX && y >= minY && x <= maxX && y <= maxY;

    }

    highlight(){
        this._graphWrapper.decor.show();
        super.highlight();
    }

    unHighlight(){
        this._graphWrapper.decor.hide();
        super.unHighlight();
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
        //this.ediable = editable;

    }

    onDrawingOver(){
        this._bindEvent(this._image);

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

export class GraphTextManager extends GraphManager{
    constructor(panel,dataMappingConfig){
        super(panel,dataMappingConfig);
        this._drawingHandler = new ImageDrawingHandler(this);
        //this.create();
    }

    create(data){
        if (!data){
            data = this._dataMapping.data;
        }
        data.forEach((dataOne)=>{
            let desc = this._dataMapping.createGraph(dataOne);
            desc.bindEvent=true;
            let graph = new GraphText(this,desc);
            super.onCreateOne(graph);
        });
        super.create(data);
    }


}

class ImageDrawingHandler extends DrawingHandler{
    constructor(manager){
        super(manager);
    }

    stepStart(graphOption){
        let graph = new GraphText(this._manager, graphOption);
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



