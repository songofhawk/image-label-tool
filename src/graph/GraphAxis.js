import {Graph} from "./Graph";
import {Drawing} from "../drawing/Drawing";

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

    do(callBack){
        let graph = new GraphAxis();

        callBack(graph);
    }

}