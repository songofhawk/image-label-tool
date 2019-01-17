import Konva from "konva";
import {GraphAxis} from "../graph/GraphAxis";
import {AbstractOperator} from "./AbstractOperator";

export class AbstractManager {
    constructor(panel){
        this._stage = panel._stage;
        this._layer = new Konva.Layer();
        this._stage.add(this._layer);
        this._panel = panel;

        this._drawingOperator = new AbstractOperator(panel);
        this._selectingOperator = new AbstractOperator(panel);
        this._editingOperator = new AbstractOperator(panel);
    }

    get defaultColor(){
        return 'rgba(80,80,80,0.5)';
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

export class AbstractDrawingOperator extends AbstractOperator{
    constructor(panel){
        super(panel);
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
    constructor(panel){
        super(panel);
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
    constructor(panel){
        super(panel);
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

