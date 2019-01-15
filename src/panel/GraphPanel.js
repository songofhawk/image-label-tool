import {Graph} from '../graph/Graph';
import {GeneralSelection} from '../drawing/GeneralSelection';
import {Container} from "./Container";
import {EventHandler} from "../drawing/EventHandler";

export class GraphPanel {

    constructor(canvasElement, bkImgUrl) {
        if (!canvasElement) {
            throw 'canvasElement parameter is mandatory!';
        }

        let fCanvas = this._fCanvas = new fabric.Canvas(canvasElement, {
            selection: false,   //按照官方文档,是禁止了group selection
            width: 600,
            height: 600,
            hoverCursor: 'pointer'
        });
        this._currentDrawing = null;
        this._currentGraph = null;
        this._container = new Container(this);
        this._generalSelection =  new GeneralSelection(this);

        this._eventHandler = new EventHandler(fabric);

        if (bkImgUrl && typeof bkImgUrl==='string'){
            fabric.Image.fromURL(bkImgUrl,function(bkImg) {
                fCanvas.setBackgroundImage(bkImg, fCanvas.renderAll.bind(fCanvas), {
                    width: bkImg.width,
                    height: bkImg.height,
                    originX: 'left',
                    originY: 'top',
                    crossOrigin: 'anonymous' //放开跨域限制,据说这个属性影响取像素颜色的操作
                });
            });
        }

        fCanvas.on('mouse:down', function(o){
            let pointer = fCanvas.getPointer(o.e);
            this._eventHandler.mouseDown(pointer);
        });

        fCanvas.on('mouse:move', function(o){
            let pointer = fCanvas.getPointer(o.e);
            this._eventHandler.mouseMove(pointer);
        });

        fCanvas.on('mouse:up', function(o){
            let pointer = fCanvas.getPointer(o.e);
            this._eventHandler.mouseUp(pointer);
        });

        fCanvas.on('selection:created', function(o){


        });

        fCanvas.on('selection:updated', function(o){


        });

    }

    get drawingClass(){
        return this._currentDrawing;
    }
    set drawingClass(clazz){
        if (!clazz instanceof Graph){
            throw  'The parameter must be an instance of Graph class';
        }
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

    draw(){
        if (!this._currentDrawing){
            return;
        }

        this._eventHandler.drawing = this._currentDrawing;
        this._eventHandler.stepStart();
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