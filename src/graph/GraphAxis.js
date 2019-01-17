import {Graph} from "./Graph";
import {AbstractDrawing} from "../drawing/AbstractDrawing";
import Konva from 'konva';

export class GraphAxis extends Graph{
    constructor(layer, defaultColor) {
        super(layer);

        this._vLine = new Konva.Line({
            points: [0, 0, 0, layer.size().height],
            stroke: defaultColor,
            strokeWidth: 2
        });

        this._hLine = new Konva.Line({
            points: [0, 0, layer.size().width, 0],
            stroke: defaultColor,
            strokeWidth: 2
        });

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


}

export class GraphAxisDrawing extends AbstractDrawing{
    constructor(panel) {
        super(panel);
        this._axis = null;
    }

    /**
     * 开始绘制
     * @return {boolean} 是否重绘(true:重绘, false:不重绘)
     */
    stepStart(){
        let defaultColor = super.defaultColor;
        this._axis = new GraphAxis(this._layer, defaultColor);
        return false;
    }

    stepMove(screenPoint, step){
        this._axis.moveTo(screenPoint);
        return true;
    }

    stepDown(screenPoint, step){

    }
    stepUp(screenPoint, step){

    }
    stepOver(screenPoint, step){
        return this._axis;
    }


    get stepCount(){
        return 1;
    }

}