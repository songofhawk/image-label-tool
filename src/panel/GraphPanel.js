import {Graph} from '../graph/Graph';
import {GeneralSelection} from '../drawing/GeneralSelection';
import {Container} from "./Container";
import {EventHandler} from "../drawing/EventHandler";
import Konva from "konva";

export class GraphPanel {

    constructor(containerElement, bkImgUrl) {
        if (!containerElement) {
            throw 'containerElement parameter is mandatory!';
        }

        let stage = this._stage = new Konva.Stage({
            container: containerElement,
            width: 600,
            height: 600,
            listening:true
        });

        let bkLayer = new Konva.Layer();
        let jsImage = new Image();
        jsImage.onload = function() {

            let bkImage = new Konva.Image({
                x: 0,
                y: 0,
                image: jsImage,
                width: 600,
                height: 600,
                listening:false
            });
            // add the shape to the layer
            bkLayer.add(bkImage);

            // add the layer to the stage
            stage.add(bkLayer);
            bkLayer.moveToBottom();
        };
        jsImage.src = bkImgUrl;


        this._currentManager = null;
        this._currentGraph = null;
        this._container = new Container(this);

        this._eventHandler = new EventHandler(this);

        this.listenEvent(true);
    }

    get stage(){
        return this._stage;
    }

    get graphManager(){
        return this._currentManager;
    }
    set graphManager(clazz){
        if (!clazz instanceof Graph){
            throw  'The parameter must be an instance of Graph class';
        }
        clazz.fCanvas = this._stage;

        this._currentManager = clazz;
        this._currentManager.over = (graph)=>{
            if (graph !== null){
                this._container.add(graph);
            }

            if (this._currentGraph !== null){
                this._currentGraph.deSelect();
            }
            this._currentGraph = graph;
            return graph;
        };
    }

    draw(graphManager, config){

        if (!graphManager && !this.graphManager){
            return;
        }

        if (graphManager){
            this.graphManager = graphManager;
        }
        this._eventHandler.operator =  this.graphManager.drawingOperator;
        this._eventHandler.stepStart(config);
    }

    select(graphManager, config){
        if (!graphManager && !this.graphManager){
            return;
        }

        if (graphManager){
            this.graphManager = graphManager;
        }
        this._eventHandler.operator =  this.graphManager.selectingOperator;
        this._eventHandler.stepStart(config);
    }

    add(graph) {
        if (!graph) {
            throw 'graph parameter is mandatory!';
        }
        graph.create();
        this._container.add(graph);
    }

    get(code){
        return this._container.get(code);
    }

    delete(code){
        let deletedGraph = this._container.remove(code);
        if (deletedGraph!==null){
            deletedGraph.delete();
        }
    }

    create(graphList){
        for (let graph of graphList){
            graph.create();
            this._container.add(graph);
        }
    }


    listenEvent(willListen){
        //针对stage调用setListening方法貌似没什么用, 但初始化参数里设置listening是有用的
        //this._stage.setListening(willListen);

        let stage = this._stage;
        let self = this;

        if (willListen){
            stage.on('mousedown', function(){
                let pointer = stage.getPointerPosition();
                self._eventHandler.mouseDown(pointer);
            });

            stage.on('mousemove', function(e){
                console.log('mousemove on: ', e.target);
                let pointer = stage.getPointerPosition();
                self._eventHandler.mouseMove(pointer);
            });

            stage.on('mouseup', function(){
                let pointer = stage.getPointerPosition();
                self._eventHandler.mouseUp(pointer);
            });
        }else{
            stage.off('mousedown');
            stage.off('mousemove');
            stage.off('mouseup');
        }
    }

    /*---------------------------------------*/
    /*--------以下是供子类实例调用的方法--------*/
    /*---------------------------------------*/

    /**
     *
     * @param callBack
     * @private
     */

}