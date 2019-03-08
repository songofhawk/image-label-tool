import Konva from 'konva';
import {Graph} from "./Graph";
import {GraphManager} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";


export class GraphPointArea extends Graph {

    constructor(manager,graphOption) {
        super(manager,graphOption);

        this._points = [];
        this._lines = [];

        if (graphOption && graphOption.absolutePoints){
            this.create(graphOption);
        }
    }

    create(graphOption){
        let abPoints = graphOption.absolutePoints;
        for (let i=0;i<abPoints.length;i++){
            let abPoint = abPoints[i];
            if (i===0){
                this.createPoint(abPoint);
            }else{
                this.createLineWithNewPoint(abPoint);
            }
        }
        this._closeArea();
    }

    clone(offset){
        let manager = this._manager;

        let newAbPoints = GraphPointArea._copyPoints(this.absolutePoints, offset);
        let newPointArea = new GraphPointArea(manager, {graphType:this.graphType, absolutePoints:newAbPoints});
        manager._container.add(newPointArea);
        manager.onDrawingOver(newPointArea);
        return newPointArea;
    }

    static _copyPoints(points, offset){
        let newPoints = [];
        for (let i=0;i<points.length;i++){
            let point = points[i];

            newPoints.push({
                x: offset? (point.x + offset.x) : point.x,
                y: offset? (point.y + offset.y) : point.y
            });
        }
        return newPoints;
    }

    get points(){
        return this._points;
    }

    moveTo(point) {

    }


    delete() {
        this._area.remove();
        super.delete();
    }

    highlight() {
        this._area.opacity(0.5);
        super.highlight();
    }

    unHighlight() {
        this._area.opacity(0.1);
        super.unHighlight();
    }

    select(){
        for (let line of this._lines){
            line.stroke(Graph.SELECTED_STROKE_COLOR);
        }

        super.select();
    }

    deSelect(){
        for (let line of this._lines){
            line.stroke(Graph.DEFAULT_STROKE_COLOR);
        }
        super.deSelect();
    }

    createPoint(screenPoint) {
        let circle = new Konva.Circle({
            x: screenPoint ? screenPoint.x : 0,
            y: screenPoint ? screenPoint.y : 0,
            radius: 3,
            fill: Graph.DEFAULT_FILL_COLOR,
            stroke: Graph.DEFAULT_STROKE_COLOR,
            strokeWidth: Graph.DEFAULT_STROKE_WITH,
            draggable: true
        });
        this._points.push(circle);
        this._currentPoint = circle;
        this._graphWrapper.add(circle);
        circle.highlight=function () {
            this.strokeWidth(Graph.HIGHLIGHT_STROKE_WITH);
            this.stroke(Graph.HIGHLIGHT_STROKE_COLOR);
        };
        circle.unHighlight=function () {
            this.strokeWidth(Graph.DEFAULT_STROKE_WITH);
            this.stroke(Graph.DEFAULT_STROKE_COLOR);
        };

        return circle;
    }

    linkLine(point1, point2) {
        let line = this.createLine({x: point1.x(), y: point1.y()}, {x: point2.x(), y: point2.y()});
        line.startPoint = point1;
        line.endPoint = point2;
        point1.outLine = line;
        point2.inLine = line;
    }

    createLine(screenPoint1, screenPoint2) {
        let line = new Konva.Line({
            points: [screenPoint1.x, screenPoint1.y, screenPoint2.x, screenPoint2.y],
            strokeWidth: Graph.DEFAULT_STROKE_WITH,
            stroke: Graph.DEFAULT_STROKE_COLOR,
            draggable: false
        });
        let length = this._lines.push(line);
        line.index = length - 1;
        this._currentLine = line;
        this._graphWrapper.add(line);
        //this._layer.add(line);
        return line;
    }

    createLineWithNewPoint(screenPoint) {
        let fromPoint = this._currentPoint;
        let toPoint = this.createPoint(screenPoint);
        this.linkLine(fromPoint, toPoint);
    }

    movePoint(screenPoint, point) {
        if (!point) {
            point = this._currentPoint;
        }

        point.setX(screenPoint.x);
        point.setY(screenPoint.y);
        GraphPointArea.moveLineWithPoint(point);
        this.onChange();
    }

    static moveLineWithPoint(point){
        if (point.inLine) {
            let inLine = point.inLine;
            let points = inLine.getPoints();
            inLine.setPoints([points[0], points[1], point.x(), point.y()]);
        }

        if (point.outLine) {
            let outLine = point.outLine;
            let points = outLine.getPoints();
            outLine.setPoints([ point.x(), point.y(), points[2], points[3]]);
        }
    }

    /**
     * 绘制完最后一个点后,封闭区域
     * 从最后一个点连接线到第一个点
     */
    seal() {
        let lastPoint = this._points[this._points.length - 1];
        let firstPoint = this._points[0];
        this.linkLine(lastPoint, firstPoint);
    }

    getBoundary(){
        let maxX = 0, maxY = 0, minX = Number.MAX_SAFE_INTEGER, minY = Number.MAX_SAFE_INTEGER;
        for (let point of this._points) {
            let x = point.x(), y = point.y();
            if (maxX < x) {
                maxX = x;
            }
            if (maxY < y) {
                maxY = y;
            }
            if (minX > x) {
                minX = x;
            }
            if (minY > y) {
                minY = y;
            }
        }
        return {
            x:minX,
            y:minY,
            width:maxX - minX,
            height:maxY - minY
        }
    }

    wrapperRebound() {
        let rect = this.getBoundary();
        let wrapper = this._graphWrapper;

        wrapper.setX(rect.x);
        wrapper.setY(rect.y);
        wrapper.setWidth(rect.width);
        wrapper.setHeight(rect.height);

        for (let point of this._points) {
            point.setAbsolutePosition(point.position());
        }

        for (let line of this._lines){
            let start = line.startPoint, end = line.endPoint;
            line.setPoints([start.x(), start.y(), end.x(), end.y()]);
        }
    }

    genAbsolutePoints(){
        this.absolutePoints = [];
        this.points.forEach((point)=>{
            this.absolutePoints.push(point.getAbsolutePosition());
        })
    }

    bindEvent(){
        for (let point of this._points){
            this._bindPointEvent(point);
        }
        this._bindAreaEvent();

    }


    _bindPointEvent(shape) {
        let self = this;
        shape.on("mouseover", function () {
            //console.log('mouse over on graph: '+graph.type);
            shape.highlight();
            shape.draw();
        });

        shape.on("mouseout", function () {
            // console.log('mouse out from graph: '+graph.type);
            shape.unHighlight();
            //TODO:这个地方很奇怪,如果用shap.draw()就看不出重绘的效果,只有重绘整个层才可以,但按照官方文档的例子,明明就应该可以的:https://konvajs.github.io/docs/performance/Shape_Redraw.html
            self._layer.draw();
        });

        shape.on("dragmove", function () {
            GraphPointArea.moveLineWithPoint(this);
            shape.draw();
            if (this.polygon){
                this.polygon.setPoints();
            }
        });

        shape.on("dragend", function () {
            let area = self._area;
            if (area){
                let pointArray = self._extractPointArray();
                area.setPoints(pointArray);
                self._layer.draw();
            }
            self.onChange();
        });
    }

    _bindAreaEvent() {
        let area = this._area;
        if (!area) {
            return;
        }
        let self = this;

        self.unHighlight();

        area.on("dragmove", function () {
            let pos = area.getAbsolutePosition();
            self._graphWrapper.setAbsolutePosition(pos);
            self.onMove(pos);
        });
        area.on("dragend", function () {
            self.onChange();
        });
        area.on("mouseover", function () {
            self.highlight();
        });
        area.on("mouseout", function () {
            self.unHighlight();
        });
        area.on("click", function () {
            self.toggleSelect();
        });
    }

    createPolygonArea(){
        let wrapper = this._graphWrapper;
        let pointArray = this._extractPointArray();
        /*对于多边形来说,如果给定了x,y那么所有points都是相对于x,y坐标原点的坐标了,所以这里既然取了Wrapper的左上角作为原点,那么points就取wrapper里点线的相对坐标*/
        let polygon = new Konva.Line({
            x: wrapper.x(),
            y: wrapper.y(),
            points: pointArray,
            fill:Graph.AREA_FILL_COLOR,
            opacity: 0.5,
            stroke: Graph.DEFAULT_STROKE_COLOR,
            strokeWidth: Graph.DEFAULT_STROKE_WITH,
            draggable:true,
            closed : true
        });
        this._layer.add(polygon);
        this._area = polygon;
    }

    _extractPointArray() {
        let pointArray = [];
        for (let point of this._points) {
            let pos = point.getPosition();
            pointArray.push(pos.x);
            pointArray.push(pos.y);
        }
        return pointArray;
    }


    onDrawingOver(){
        this._closeArea();
        super.onDrawingOver();
    }

    _closeArea(){
        this.seal();
        this.wrapperRebound();
        this.genAbsolutePoints();
        this.createPolygonArea();
        this.bindEvent();
    }


    onChange(){
        this.genAbsolutePoints();
        super.onChange();
    }
}

export class GraphPointAreaManager extends GraphManager {
    constructor(panel,dataMappingConfig) {
        super(panel,dataMappingConfig);
        this._drawingHandler = new PointAreaDrawingHandler(this);
    }

    _createGraphObjByDesc(desc){
        return new GraphPointArea(this,desc);
    }
}

class PointAreaDrawingHandler extends DrawingHandler {
    constructor(manager) {
        super(manager);
    }

    stepStart(graphOption) {
        let graph = new GraphPointArea(this._manager, graphOption);
        graph.createPoint();
        super.stepStart(graph);
    }

    stepMove(screenPoint, step) {

        this._graph.movePoint(screenPoint);
        super.stepMove(screenPoint, step);
    }

    stepDown(screenPoint, step) {
        super.stepDown(screenPoint, step);
    }

    stepUp(screenPoint, step) {
        super.stepUp(screenPoint, step);
        if (step<this.stepCount - 1){
            this._graph.createLineWithNewPoint(screenPoint);
        }
    }

    stepOver(screenPoint, step) {
        this._graph.onDrawingOver();
        super.stepOver(screenPoint, step);
    }


    get stepCount() {
        return 4;
    }
}


