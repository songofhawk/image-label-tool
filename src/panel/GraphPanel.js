import {Graph} from '../graph/Graph';
import {GeneralSelection} from '../drawing/GeneralSelection';
import {Container} from "./Container";
import {EventHandler} from "../drawing/EventHandler";
import Konva from "konva";

export class GraphPanel {

    constructor(canvasElement, bkImgUrl) {
        if (!canvasElement) {
            throw 'canvasElement parameter is mandatory!';
        }

        let stage = this._stage = new Konva.Stage({
            container: 'image-label-area',
            width: 600,
            height: 600
        });
        let bkLayer = new Konva.Layer();
        //bkLayer.setZIndex(-1000);
        let jsImage = new Image();
        jsImage.onload = function() {

            let bkImage = new Konva.Image({
                x: 0,
                y: 0,
                image: jsImage,
                width: 600,
                height: 600
            });

            // add the shape to the layer
            bkLayer.add(bkImage);

            // add the layer to the stage
            stage.add(bkLayer);
            bkLayer.moveToBottom();
        };
        jsImage.src = bkImgUrl;






        // let fCanvas = this._stage = new fabric.Canvas(canvasElement, {
        //     selection: false,   //按照官方文档,是禁止了group selection
        //     width: 600,
        //     height: 600,
        //     hoverCursor: 'pointer'
        // });

        this._generalSelection =  null;
        this._currentDrawing = null;
        this._currentGraph = null;
        this._container = new Container(this);

        this._eventHandler = new EventHandler(this);

        // if (bkImgUrl && typeof bkImgUrl==='string'){
        //     fabric.Image.fromURL(bkImgUrl,function(bkImg) {
        //         fCanvas.setBackgroundImage(bkImg, fCanvas.renderAll.bind(fCanvas), {
        //             width: bkImg.width,
        //             height: bkImg.height,
        //             originX: 'left',
        //             originY: 'top',
        //             crossOrigin: 'anonymous' //放开跨域限制,据说这个属性影响取像素颜色的操作
        //         });
        //     });
        // }

        let self = this;
        stage.on('mousedown', function(){
            let pointer = stage.getPointerPosition();
            self._eventHandler.mouseDown(pointer);
        });

        stage.on('mousemove', function(){
            let pointer = stage.getPointerPosition();
            self._eventHandler.mouseMove(pointer);
        });

        stage.on('mouseup', function(){
            let pointer = stage.getPointerPosition();
            self._eventHandler.mouseUp(pointer);
        });

        stage.on('selection:created', function(o){


        });

        stage.on('selection:updated', function(o){


        });

    }

    get fCanvas(){
        return this._stage;
    }

    get drawingClass(){
        return this._currentDrawing;
    }
    set drawingClass(clazz){
        if (!clazz instanceof Graph){
            throw  'The parameter must be an instance of Graph class';
        }
        clazz.fCanvas = this._stage;

        this._currentDrawing = clazz;
        this._currentDrawing.over = (graph)=>{
            if (graph !== null){
                this._container.add(graph);
            }

            if (this._currentGraph !== null){
                this._currentGraph.unSelect();
            }
            this._currentGraph = graph;
            return graph;
        };
    }

    draw(drawingClass){

        if (!drawingClass && !this.drawingClass){
            return;
        }

        if (drawingClass){
            this.drawingClass = drawingClass;
        }
        this._eventHandler.drawing =  this.drawingClass;
        this._eventHandler.stepStart(()=>{
            this._eventHandler.drawing = this._generalSelection;
        });
    }

    select(){
        this._eventHandler.drawing = this._generalSelection;
        this._eventHandler.stepStart();
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


    /*---------------------------------------*/
    /*--------以下是供子类实例调用的方法--------*/
    /*---------------------------------------*/

    /**
     *
     * @param callBack
     * @private
     */

}