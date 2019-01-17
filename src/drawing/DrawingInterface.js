export class DrawingInterface {
    constructor(panel){
        this._stage = panel._stage;
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

    get stepCount(){
        return 1;
    }

    get defaultColor(){
        return 'rgba(80,80,80,0.5)';
    }
}