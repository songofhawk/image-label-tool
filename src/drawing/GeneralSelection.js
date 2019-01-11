import {Drawing} from "./Drawing";

export class GeneralSelection extends Drawing{
    constructor(panel){
        super(panel);
        this._ownerPanel = panel;
        this._graphList = panel._container.getAll();
    }

    do(callBack){
        this._startSelect((point)=>{
            let selected = null;
            for (let graph of this._graphList){
                if (graph.isPointOn()){
                    graph.select();
                    this._ownerPanel._currentGraph = graph;
                    selected = graph;
                }else{
                    graph.unselect();
                }
            }
            callBack(selected);
        })
    }

    _startSelect(callBack){

    }

}