import Konva from 'konva';
import {Graph} from "./Graph";
import {GraphManager} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";


export class GraphAxis extends Graph{
    constructor(manager,graphOption) {
        super(manager);

        let layer = this._layer;

        let x = graphOption && graphOption.x ? graphOption.x :0;
        let y = graphOption && graphOption.y ? graphOption.y :0;
        this._vLine = new Konva.Line({
            points: [x, 0, x, layer.size().height],
            stroke: Graph.DEFAULT_COLOR,
            strokeWidth: 2,
        });

        this._hLine = new Konva.Line({
            points: [0, y, layer.size().width, y],
            stroke: Graph.DEFAULT_COLOR,
            strokeWidth: 2,
        });

        this._graphWrapper.add(this._vLine);
        this._graphWrapper.add(this._hLine);
        // layer.add(this._vLine);
        // layer.add(this._hLine);

    }

    moveTo(screenPoint){
        this._vLine.setX(screenPoint.x);
        this._hLine.setY(screenPoint.y);
    }

    delete(){

    }

    highlight(){
        let vLine = this._vLine;
        let x = 2;
        if (!vLine.hl){
            vLine.hl = new Konva.Line({
                points: [x, 0, x, vLine.line.height()],
                stroke: 'rgba(156,156,156,10)',
                strokeWidth: 3
            });
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
            });
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

    onDrawingOver(){
        this.x = this._vLine.x();
        this.y = this._hLine.y();
        super.onDrawingOver();
    }

}

export class GraphAxisManager extends GraphManager{
    constructor(panel,dataMappingConfig){
        super(panel,dataMappingConfig);
        this._drawingHandler = new AxisDrawingHandler(this);
    }

    _createGraphObjByDesc(desc){
        this._currentGraph = new GraphAxis(this);
        this._currentGraph.moveTo(desc);
        return this._currentGraph ;
    }

}

class AxisDrawingHandler extends DrawingHandler{
    constructor(manager){
        super(manager);
    }

    stepStart(graphOption){
        let graph;
        if (this._graph){
            graph = this._graph;
        }else if (this._manager._currentGraph) {
            graph = this._manager._currentGraph;
        }else{
            graph = new GraphAxis(this._manager);
        }
        super.stepStart(graph,true);
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
        this._graph.onDrawingOver();
        super.stepOver(screenPoint, step);
    }


    get stepCount(){
        return 1;
    }
}
