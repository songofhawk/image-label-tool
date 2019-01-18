import Konva from 'konva';
import {Graph} from "./Graph";
import {AbstractManager} from "../drawing/AbstractManager";
import {AbstractDrawingOperator} from "../drawing/AbstractManager";
import {AbstractSelectingOperator} from "../drawing/AbstractManager";
import {AbstractEditingOperator} from "../drawing/AbstractManager";

export class GraphImage extends Graph{
    constructor(layer,config) {
        super(layer);

        this._group = new Konva.Group({
            x:0,
            y:0,
            width: config.width,
            height: config.height
        });
        layer.add(this._group);

        let imageObj = new Image();
        let self = this;
        imageObj.onload = function() {
            let image = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: config.width,
                height: config.height
            });
            self._group.add(image);
            self._group.image = image;

            let decor = new Konva.Rect({
                x: - 2,
                y: - 2,
                width: config.width+1,
                height: config.height+1,
                fillEnabled: false,
                stroke: 'gray',
                strokeWidth: 2
            })
            decor.hide();
            self._group.decor = decor;
            self._group.add(decor);
        };
        imageObj.src = config.src;
    }

    create(callBack){

    }

    moveTo(point){
        if (!this._group){
            return;
        }
        this._group.setX(point.x);
        this._group.setY(point.y);
    }

    moveOn(){

    }

    select(){

    }

    /**
     * 取消选择
     */
    deSelect(){

    }

    delete(){

    }

    isPointOn(point){
        let x=point.x, y=point.y;
        let graph = this._group;
        let minX = graph.x(), minY = graph.y(),
            maxX = graph.x()+graph.width(),
            maxY = graph.y()+graph.height();
        if (x>=minX && y>=minY && x<=maxX && y<=maxY){
            return true;
        }
        return false;
    }

    highlight(){
        this._group.decor.show();
    }

    unHighlight(){
        this._group.decor.hide();
    }

}

export class GraphImageManager extends AbstractManager{
    constructor(panel){
        super(panel);
        this._axis = null;
        this._drawingOperator = new ImageDrawingOperator(this);
        this._selectingOperator = new ImageSelectingOperator(this);
        this._editingOperator = new ImageEditingOperator(this);
    }

    get drawingOperator(){
        return this._drawingOperator;
    }
    get selectingOperator(){
        return this._selectingOperator;
    }
    get editingOperator(){
        return this._editingOperator;
    }

}

class ImageDrawingOperator extends AbstractDrawingOperator{
    constructor(manager){
        super(manager);
    }

    stepStart(config){
        this._manager.currentGraph = new GraphImage(this._layer, config);
        this._manager._stage.container().style.cursor = 'crosshair';
        return false;
    }

    stepMove(screenPoint, step){
        this._manager.currentGraph.moveTo(screenPoint);
        return true;
    }

    stepDown(screenPoint, step){

    }
    stepUp(screenPoint, step){

    }
    stepOver(screenPoint, step){
        super.stepOver(screenPoint, step);
        this._manager._stage.container().style.cursor = 'default';
        super.afterStepOver(this._manager.currentGraph);
        return this._manager.currentGraph;
    }

    get stepCount(){
        return 1;
    }
}

class ImageSelectingOperator extends AbstractSelectingOperator{
    constructor(manager){
        super(manager);
    }

    stepStart(){
        return false;
    }

    stepMove(screenPoint, step){
        this._manager._container.highlightByPoint(screenPoint);;
        return true;
    }

    stepDown(screenPoint, step){

    }
    stepUp(screenPoint, step){

    }
    stepOver(screenPoint, step){

        super.stepOver(screenPoint, step);
    }


    get stepCount(){
        return 1;
    }

}

class ImageEditingOperator extends AbstractEditingOperator{
    constructor(manager){
        super(manager);
    }

    stepStart(){
    }

    stepMove(screenPoint, step){
        this._manager._axis.moveTo(screenPoint);
        return true;
    }

    stepDown(screenPoint, step){

    }

    stepUp(screenPoint, step){

    }

    stepOver(screenPoint, step){
        super.stepOver(screenPoint, step);
        return this._manager._axis;
    }

    get stepCount(){
        return 1;
    }
}

