import {AbstractOperator} from "./AbstractOperator";
import {GeneralSelection} from "./GeneralSelection";

export class EventHandler {
    constructor(panel, drawingObject){
        this._container = panel._container;
        this._stage = panel._stage;
        if (drawingObject){
            this._drawing = drawingObject;
        }
        this._step = 0;
        this._isRunning = false;
    }

    stepStart(onOverCallback){
        let willRender = false;
        let drawing = this._drawing;
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
        let drawing = this._drawing;
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
        let drawing = this._drawing;
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
        let drawing = this._drawing;
        if (drawing.stepUp){
            willRender = drawing.stepUp(screenPoint, this._step);
        }
        if (willRender){
            drawing.render();
        }
        this._step++;
        if (this._step>=this._stepCount){
            this._stepOver(screenPoint);
        }
    }

    _stepOver(screenPoint){
        this._isRunning = false;

        let drawing = this._drawing;
        this._step = 0;

        let graph = drawing.stepOver(screenPoint, this._step);
        drawing.render();
        this._container.add(graph);

        this._drawing = new GeneralSelection(panel, drawing);
    }

    _stepBreak(){
        this._isRunning = false;
        this._step = 0;
    }

    set drawing(drawingObject){
        this._stepBreak();
        this._drawing = drawingObject;
        this._stepCount = drawingObject.stepCount;
    }

    get drawing(){
        return this._drawing;
    }

}