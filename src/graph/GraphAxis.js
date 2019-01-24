import Konva from 'konva';
import {Graph} from "./Graph";
import {GraphManager} from "../drawing/GraphManager";
import {DrawingHandler} from "../drawing/DrawingHandler";


export class GraphAxis extends Graph{
    constructor(manager) {
        super(manager);

        let layer = this._layer;

        this._vLine = new Konva.Group({
            x:0,
            y:0
        });
        let vLine = new Konva.Line({
            points: [0, 0, 0, layer.size().height],
            stroke: Graph.DEFAULT_COLOR,
            strokeWidth: 2
        });
        this._vLine.add(vLine);
        this._vLine.line = vLine;


        this._hLine = new Konva.Group({
            x:0,
            y:0
        });
        let hLine = new Konva.Line({
            points: [0, 0, layer.size().width, 0],
            stroke: Graph.DEFAULT_COLOR,
            strokeWidth: 2
        });
        this._hLine.add(hLine);
        this._hLine.line = hLine;

        layer.add(this._vLine);
        layer.add(this._hLine);
    }

    create(callBack){

    }

    moveTo(point){
        this._vLine.setX(point.x);
        this._hLine.setY(point.y);
    }

    moveOn(){

    }

    select(){

    }

    unselect(){

    }

    delete(){

    }

    isPointOn(point){

    }

    highlight(){
        let vLine = this._vLine;
        let x = 2;
        if (!vLine.hl){
            vLine.hl = new Konva.Line({
                points: [x, 0, x, vLine.line.height()],
                stroke: 'rgba(156,156,156,10)',
                strokeWidth: 3
            })
            vLine.add(vLine.hl);
        }else{
            //vLine.hl.setX(x);
            vLine.hl.show();
        }


        let hLine = this._hLine;
        let y =  2;
        if (!hLine.hl){
            hLine.hl = new Konva.Line({
                points: [0, y, hLine.line.width(), y],
                stroke: 'rgba(156,156,156,10)',
                strokeWidth: 3
            })
            hLine.add(hLine.hl);
        }else{
            //hLine.hl.setY(y);
            hLine.hl.show();
        }
    }

    unHighlight(){
        let vLine = this._vLine;
        if (vLine.hl){
            vLine.hl.hide();
        }


        let hLine = this._hLine;
        if (hLine.hl){
            hLine.hl.hide();
        }
    }

}

export class GraphAxisManager extends GraphManager{
    constructor(panel){
        super(panel);
        this._drawingHandler = new AxisDrawingHandler(this);
    }

}

class AxisDrawingHandler extends DrawingHandler{
    constructor(manager){
        super(manager);
    }

    stepStart(config){
        let graph = new GraphAxis(this._manager);
        super.stepStart(graph);
    }

    stepMove(screenPoint, step){
        this._graph.moveTo(screenPoint);
        super.stepMove(screenPoint, step);
    }

    stepDown(screenPoint, step){
        super.stepDown(screenPoint, step);
    }
    stepUp(screenPoint, step){
        super.stepUp(screenPoint, step);
    }
    stepOver(screenPoint, step){
        super.stepOver(screenPoint, step);
    }


    get stepCount(){
        return 1;
    }
}


