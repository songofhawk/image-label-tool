import {StringUtil} from "../util/StringUtil";

export class Graph {
    constructor(layer){
        this._layer = layer;
        this.code = StringUtil.getGuid();
    }

    static get DEFAULT_COLOR(){
        return 'gray';
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
        this.selected = true;
    }

    deSelect(){
        this.selected = false;
    }

    delete(){

    }

    isPointOn(point){

    }
}

