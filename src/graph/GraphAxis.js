import {Graph} from "./Graph";
import {Drawing} from "../drawing/Drawing";

export class GraphAxis extends Graph{
    constructor(props) {
        super(props);

    }

    create(){

    }

    move(){

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