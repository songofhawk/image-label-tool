import {Graph} from "./Graph";
import {Drawing, DrawingInterface} from "../drawing/DrawingInterface";

export class GraphAxis extends Graph{
    constructor(fCanvas, defaultColor) {
        super(defaultColor);
        this.fCanvas = fCanvas;
        this._vLine = new fabric.Line([0, 0, 0, fCanvas.height], { strokeWidth: 2, stroke: defaultColor });
        this._hLine = new fabric.Line([0, 0, fCanvas.width, 0], { strokeWidth: 2, stroke: defaultColor });
        fCanvas.add(this._vLine);
        fCanvas.add(this._hLine);
    }

    create(callBack){

    }

    moveTo(){

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




}

export class GraphAxisDrawing extends DrawingInterface{
    constructor(panel) {
        super(panel);
        this.axis = null;
    }

    stepStart(){
        let defaultColor = super.defaultColor;
        this.axis = new GraphAxis(this._fCanvas, defaultColor);
        return this.axis;
    }
    stepMove(screenPoint, step){

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

}