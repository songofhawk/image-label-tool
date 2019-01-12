import {Graph} from "./Graph";
import {Drawing} from "../drawing/DrawingInterface";

export class GraphAxis extends Graph{
    constructor(props) {
        super(props);

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

export class GraphAxisDrawing extends Drawing{

    stepStart(){

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