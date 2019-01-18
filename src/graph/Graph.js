import {StringUtil} from "../util/StringUtil";

export class Graph {
    constructor(layer){
        this._layer = layer;
        this.code = StringUtil.getGuid();
    }

    create(callBack){
        if (callBack){
            callBack();
        }
    }

    moveTo(){

    }

    moveOn(){

    }

    select(){

    }

    unSelect(){

    }

    delete(){

    }

    isPointOn(point){

    }
}

