import Konva from "konva";
import {AbstractOperator} from "./AbstractOperator";

export class AbstractManager {
    constructor(panel){
        this._stage = panel._stage;
        this._layer = new Konva.Layer();
        this._stage.add(this._layer);
        this._panel = panel;

        this._drawingOperator = null;
        this._selectingOperator = null;
        this._editingOperator = null;
    }

    get drawingOperator(){
        throw 'Drawing operator is not defined in concrete class!';
    }
    get selectingOperator(){
        throw 'Selecting operator is not defined in concrete class!';
    }
    get editingOperator(){
        throw 'Editing operator is not defined in concrete class!';
    }


}

export class AbstractDrawingOperator extends AbstractOperator{
    constructor(manager){
        super(manager);
    }

    stepStart(){
        return false;
    }

    stepMove(screenPoint, step){
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

export class AbstractSelectingOperator extends AbstractOperator{
    constructor(manager){
        super(manager);
    }

    stepStart(){
        return false;
    }

    stepMove(screenPoint, step){
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

export class AbstractEditingOperator extends AbstractOperator{
    constructor(manager){
        super(manager);
    }

    stepStart(){
        return false;
    }

    stepMove(screenPoint, step){
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

