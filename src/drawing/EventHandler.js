import {AbstractDrawing} from "./AbstractDrawing";

export class EventHandler {
    constructor(stage, drawingObject){
        this._stage = stage;
        this._drawing = drawingObject;
        this._step = 0;
        this._isRunning = false;
    }

    stepStart(){
        let willRender = false;
        let drawing = this._drawing;
        if (drawing.stepStart){
            willRender = drawing.stepStart();
        }
        if (willRender){
            // this._stage.renderAll();
        }
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
            // this._stage.renderAll();
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
            // this._stage.renderAll();
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
            // this._stage.renderAll();
        }
        this._step++;
        if (this._step>=this._stepCount){
            this._stepOver(screenPoint);
        }
    }

    _stepOver(screenPoint){
        this._isRunning = false;

        let willRender = true;
        let drawing = this._drawing;
        this._step = 0;

        if (drawing.stepOver){
            willRender = drawing.stepOver(screenPoint, this._step);
        }
        if (willRender){
            // this._stage.renderAll();
        }
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