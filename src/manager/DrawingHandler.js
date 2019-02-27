export class DrawingHandler{
    constructor(manager){
        this._manager = manager;
        this._stage = manager._stage;
        this._layer = manager._layer;
        this._container = manager._container;
        this._dataMapping = manager._dataMapping;
        this._step = 0;
    }

    stepStart(graph, isReplace){
        this._graph = graph;
        if (isReplace){
            this._container.replaceLast(graph);
        }else{
            this._container.add(graph);
        }
        this._render();
        this._listenEvent(true);
    }

    stepMove(screenPoint, step){
        this._render();
    }
    stepDown(screenPoint, step){
        this._render();
    }
    stepUp(screenPoint, step){
        this._render();
    }

    stepOver(screenPoint, step){
        this._listenEvent(false);
        this._step = 0;
        this._render();
    }

    get stepCount(){
        return 1;
    }

    _render(){
        this._layer.draw();
    }


    /***
     *   以下是绘图事件回调
     *****/

    mouseMove(screenPoint){
        this.stepMove(screenPoint, this._step);
    }

    mouseDown(screenPoint){
        this.stepDown(screenPoint, this._step);
    }

    mouseUp(screenPoint){
        this.stepUp(screenPoint, this._step);
        this._step++;
        if (this._step>=this.stepCount){
            this.stepOver(screenPoint);
        }
    }

    _listenEvent(willListen){
        //针对stage调用setListening方法貌似没什么用, 但初始化参数里设置listening是有用的
        //this._stage.setListening(willListen);

        let stage = this._stage;
        let self = this;

        if (willListen){
            stage.on('mousedown', function(){
                let pointer = stage.getPointerPosition();
                self.mouseDown(pointer);
            });

            stage.on('mousemove', function(){
                //console.log('mousemove on: ', e.target);
                let pointer = stage.getPointerPosition();
                self.mouseMove(pointer);
            });

            stage.on('mouseup', function(){
                let pointer = stage.getPointerPosition();
                self.mouseUp(pointer);
            });
        }else{
            stage.off('mousedown');
            stage.off('mousemove');
            stage.off('mouseup');
        }
    }

}

