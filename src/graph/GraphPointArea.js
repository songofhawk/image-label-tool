import Konva from 'konva';
import {Graph} from "./Graph";
import {GraphManager} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";


export class GraphPointArea extends Graph{

    constructor(manager) {
        super(manager);

        this._points = [];
        this._lines = [];

    }

    create(callBack){

    }

    moveTo(point){

    }


    delete(){

    }

    isPointOn(point){

    }

    highlight(){

    }

    unHighlight(){

    }

    createPoint(screenPoint){
        let circle = new Konva.Circle({
            x: screenPoint? screenPoint.x: 0,
            y: screenPoint? screenPoint.y: 0,
            radius: 3,
            fill: Graph.DEFAULT_FILL_COLOR,
            stroke: Graph.DEFAULT_STROKE_COLOR,
            strokeWidth: Graph.DEFAULT_STROKE_WITH,
            draggable: true
        });
        this._points.push(circle);
        this._currentPoint = circle;
        this._graphWrapper.add(circle);
        this._layer.add(circle);
        this._bindEvent(circle);
        return circle;
    }

    linkLine(point1, point2){
        let line = this.createLine({x:point1.x(), y:point1.y()}, {x:point2.x(), y:point2.y()});
        point1.outLine = line;
        point2.inLine = line;
    }

    createLine(screenPoint1, screenPoint2){
        let line = new Konva.Line({
            points:[screenPoint1.x, screenPoint1.y , screenPoint2.x, screenPoint2.y],
            strokeWidth: Graph.DEFAULT_STROKE_WITH,
            stroke: Graph.DEFAULT_STROKE_COLOR,
            draggable: false
        });
        let length = this._lines.push(line);
        line.index = length -1 ;
        this._currentLine = line;
        this._graphWrapper.add(line);
        this._layer.add(line);
        return line;
    }

    createLineWithNewPoint(screenPoint){
        let fromPoint = this._currentPoint;
        let toPoint = this.createPoint(screenPoint);
        this.linkLine(fromPoint, toPoint);
    }

    movePoint(screenPoint, point){
        if(!point){
            point = this._currentPoint;
        }

        point.setX(screenPoint.x);
        point.setY(screenPoint.y);

        if (point.inLine) {
            let inLine =point.inLine;
            let points = inLine.getPoints();
            inLine.setPoints([points[0], points[1], screenPoint.x, screenPoint.y]);
        }

        if (point.outLine) {
            let outLine =point.outLine;
            let points = outLine.getPoints();
            outLine.setPoints([screenPoint.x, screenPoint.y, points[2], points[3]]);
        }
    }

    /**
     * 绘制完最后一个点后,封闭区域
     * 从最后一个点连接线到第一个点
     */
    seal(){
        let lastPoint = this._points[this._points.length - 1];
        let firstPoint = this._points[0];
        this.linkLine(lastPoint, firstPoint);
    }
}

export class GraphPointAreaManager extends GraphManager{
    constructor(panel){
        super(panel);
        this._drawingHandler = new PointAreaDrawingHandler(this);
    }

}

class PointAreaDrawingHandler extends DrawingHandler{
    constructor(manager){
        super(manager);
    }

    stepStart(config){
        let graph = new GraphPointArea(this._manager);
        graph.createPoint();
        super.stepStart(graph);
    }

    stepMove(screenPoint, step){

        this._graph.movePoint(screenPoint);
        super.stepMove(screenPoint, step);
    }

    stepDown(screenPoint, step){
        this._graph.createLineWithNewPoint(screenPoint);
        super.stepDown(screenPoint, step);
    }
    stepUp(screenPoint, step){
        super.stepUp(screenPoint, step);
    }
    stepOver(screenPoint, step){
        this._graph.seal();
        super.stepOver(screenPoint, step);
    }


    get stepCount(){
        return 4;
    }
}


