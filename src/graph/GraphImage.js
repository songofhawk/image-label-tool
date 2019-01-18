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
            y:0
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
                x: - 1,
                y: - 1,
                width: config.width+1,
                height: config.height+1,
                fillEnabled: false,
                stroke: 'gray',
                strokeWidth: 1
            })
            //decor.hide();
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
        this._manager._stage.container().style.cursor = 'pointer';
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
        let axis = this._findInPoint(screenPoint);
        if (axis){
            axis.highlight();
        }else{
            this._manager._axis.unHighlight();
        }
        return true;
    }

    stepDown(screenPoint, step){

    }
    stepUp(screenPoint, step){

    }
    stepOver(screenPoint, step){
        this._manager._axis.unHighlight();
        super.stepOver(screenPoint, step);
    }


    get stepCount(){
        return 1;
    }

    _findInPoint(screenPoint){
        const TOLERANCE = 4;
        let axis = this._manager._axis;
        let x = axis._vLine.x(), y = axis._hLine.y();
        let differX = screenPoint.x - x, differY = screenPoint.y - y;
        if (differX<TOLERANCE && differX>-TOLERANCE   ||   differY<TOLERANCE && differY>-TOLERANCE){
            return axis;
        }
        return null;
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

