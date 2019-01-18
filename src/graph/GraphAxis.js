import Konva from 'konva';
import {Graph} from "./Graph";
import {AbstractManager} from "../drawing/AbstractManager";
import {AbstractDrawingOperator} from "../drawing/AbstractManager";
import {AbstractSelectingOperator} from "../drawing/AbstractManager";
import {AbstractEditingOperator} from "../drawing/AbstractManager";

export class GraphAxis extends Graph{
    constructor(layer, defaultColor) {
        super(layer);

        this._vLine = new Konva.Group({
            x:0,
            y:0
        });
        let vLine = new Konva.Line({
            points: [0, 0, 0, layer.size().height],
            stroke: defaultColor,
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
            stroke: defaultColor,
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

export class GraphAxisManager extends AbstractManager{
    constructor(panel){
        super(panel);
        this._axis = null;
        this._drawingOperator = new AxisDrawingOperator(this);
        this._selectingOperator = new AxisSelectingOperator(this);
        this._editingOperator = new AxisEditingOperator(this);
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

class AxisDrawingOperator extends AbstractDrawingOperator{
    constructor(manager){
        super(manager);
    }

    stepStart(){
        let defaultColor = super.defaultColor;
        if (!this._manager._axis){
            this._manager._axis = new GraphAxis(this._layer, defaultColor);
        }
        return false;
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

class AxisSelectingOperator extends AbstractSelectingOperator{
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

class AxisEditingOperator extends AbstractEditingOperator{
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

