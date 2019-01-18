import {AbstractOperator} from "./AbstractOperator";

export class GeneralSelection extends AbstractOperator{
    constructor(panel, drawingClazz){
        super(panel);
        this._graphList = panel._container.getAll();
        this._drawingClazz = drawingClazz;
    }

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
    render(){
        this._layer.draw();
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
                    graph.deSelect();
                }
            }
            callBack(selected);
        })
    }

    _startSelect(callBack){

    }

}