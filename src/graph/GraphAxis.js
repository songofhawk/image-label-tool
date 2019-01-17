import {Graph} from "./Graph";
import {DrawingInterface} from "../drawing/DrawingInterface";
import Konva from 'konva';

export class GraphAxis extends Graph{
    constructor(layer, defaultColor) {
        super(defaultColor);
        this.type = 'axis';
        this._layer = layer;

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

export class GraphAxisDrawing extends DrawingInterface{
    constructor(panel) {
        super(panel);
        this._layer = new Konva.Layer();
        this._stage.add(this._layer);


        this._axis = null;
    }

    stepStart(){
        let defaultColor = super.defaultColor;
        this._axis = new GraphAxis(this._layer, defaultColor);
        this._layer.draw();
        this._layer.moveToTop();


        // var layer = new Konva.Layer();
        //
        // var redLine = new Konva.Line({
        //     points: [5, 70, 140, 23, 250, 60, 300, 20],
        //     stroke: 'red',
        //     strokeWidth: 15,
        //     lineCap: 'round',
        //     lineJoin: 'round'
        // });
        //
        // // dashed line
        // var greenLine = new Konva.Line({
        //     points: [5, 70, 140, 23, 250, 60, 300, 20],
        //     stroke: 'green',
        //     strokeWidth: 2,
        //     lineJoin: 'round',
        //     /*
        //      * line segments with a length of 33px
        //      * with a gap of 10px
        //      */
        //     dash: [33, 10]
        // });
        //
        // // complex dashed and dotted line
        // var blueLine = new Konva.Line({
        //     points: [5, 70, 140, 23, 250, 60, 300, 20],
        //     stroke: 'blue',
        //     strokeWidth: 10,
        //     lineCap: 'round',
        //     lineJoin: 'round',
        //     /*
        //      * line segments with a length of 29px with a gap
        //      * of 20px followed by a line segment of 0.001px (a dot)
        //      * followed by a gap of 20px
        //      */
        //     dash: [29, 20, 0.001, 20]
        // });
        //
        // /*
        //  * since each line has the same point array, we can
        //  * adjust the position of each one using the
        //  * move() method
        //  */
        // redLine.move({
        //     x : 0,
        //     y : 5
        // });
        // greenLine.move({
        //     x : 0,
        //     y : 55
        // });
        // blueLine.move({
        //     x : 0,
        //     y : 105
        // });
        // //layer.setZIndex(100);
        // layer.add(redLine);
        // layer.add(greenLine);
        // layer.add(blueLine);
        //
        // // add the layer to the stage
        // this._stage.add(layer);
        // layer.draw();




        return this._axis;
    }
    stepMove(screenPoint, step){
        this._axis.moveTo(screenPoint);
        this._layer.draw();
        return true;
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