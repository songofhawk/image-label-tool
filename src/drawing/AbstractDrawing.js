import Konva from "konva";

export class AbstractDrawing {
    constructor(panel){
        this._stage = panel._stage;
        this._layer = new Konva.Layer();
        this._stage.add(this._layer);

    }

    stepStart(){
        this._layer.draw();
        //this._layer.moveToTop();
    }
    stepMove(screenPoint, step){
        this._layer.draw();
    }
    stepDown(screenPoint, step){

    }
    stepUp(screenPoint, step){

    }
    stepOver(screenPoint, step){

    }

    get stepCount(){
        return 1;
    }

    get defaultColor(){
        return 'rgba(80,80,80,0.5)';
    }
}