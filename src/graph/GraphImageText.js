import {GraphManager} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";
import {GraphText} from "./GraphText";
import {GraphImage} from "./GraphImage";


export class GraphImageTextManager extends GraphManager{
    constructor(panel,dataMappingConfig){
        super(panel,dataMappingConfig);
        this.textTypes = dataMappingConfig.textTypes;
        this._drawingHandler = new GraphImageTextDrawingHandler(this);
        //this.create();
    }

    _createGraphObjByDesc(desc){
        let textTypes = this.textTypes ? this.textTypes: ['TEXT'];
        if (textTypes.indexOf(desc.graphType)>=0){
            return new GraphText(this, desc);
        }else{
            return new GraphImage(this, desc);
        }
    }
}

class GraphImageTextDrawingHandler extends DrawingHandler{
    constructor(manager){
        super(manager);
    }

    stepStart(graphOption){
        let graph = this._manager._createGraphObjByDesc(graphOption);
        this._stage.container().style.cursor = 'crosshair';
        super.stepStart(graph);
    }

    stepMove(screenPoint, step){
        this._graph.moveTo(screenPoint);
        super.stepMove();
    }

    stepDown(screenPoint, step){
        super.stepDown();
    }

    stepUp(screenPoint, step){
        super.stepUp();
    }

    stepOver(screenPoint, step){
        this._stage.container().style.cursor = 'default';
        this._graph.onDrawingOver();
        super.stepOver(screenPoint, step);
    }


    get stepCount(){
        return 1;
    }
}
