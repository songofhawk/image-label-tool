import {AbstractOperator} from "./AbstractOperator";
import {GeneralSelection} from "./GeneralSelection";

export class EventHandler {
    constructor(panel, operator){
        this._container = panel._container;
        this._stage = panel._stage;
        if (operator){
            this._operator = operator;
        }
        this._step = 0;
        this._isRunning = false;
    }

    stepStart(onOverCallback){
        let willRender = false;
        let drawing = this._operator;
        if (drawing.stepStart){
            willRender = drawing.stepStart();
        }
        if (willRender){
            drawing.render();
        }
        this._onOverCallback = onOverCallback;
        this._isRunning = true;
    }

    mouseMove(screenPoint){
        if (!this._isRunning){
            return;
        }
        let willRender = true;
        let drawing = this._operator;
        if (drawing.stepMove){
            willRender = drawing.stepMove(screenPoint, this._step);
        }
        if (willRender){
            drawing.render();
        }
    }


    mouseDown(screenPoint){
        if (!this._isRunning){
            return;
        }
        let willRender = true;
        let drawing = this._operator;
        if (drawing.stepDown){
            willRender = drawing.stepDown(screenPoint, this._step);
        }
        if (willRender){
            drawing.render();
        }
    }
    mouseUp(screenPoint){
        if (!this._isRunning){
            return;
        }
        let willRender = true;
        let operator = this._operator;
        if (operator.stepUp){
            willRender = operator.stepUp(screenPoint, this._step);
        }
        if (willRender){
            operator.render();
        }
        this._step++;
        if (this._step>=this._stepCount){
            this._stepOver(screenPoint);
        }
    }

    _stepOver(screenPoint){
        this._isRunning = false;

        let operator = this._operator;
        this._step = 0;

        let graph = operator.stepOver(screenPoint, this._step);
        if (graph) {
            this._container.add(graph);
        }
        operator.render();

        this._onOverCallback?this._onOverCallback(graph):"";
    }

    _stepBreak(){
        this._isRunning = false;
        this._step = 0;
    }

    set operator(operatorObject){
        this._stepBreak();
        this._operator = operatorObject;
        this._stepCount = operatorObject.stepCount;
    }

    get operator(){
        return this._operator;
    }

}