import {Graph} from '../graph/Graph';
import {GeneralSelection} from '../drawing/GeneralSelection';
import {Container} from "./Container";

export class GraphPanel {

    constructor(canvasElement) {
        if (!canvasElement) {
            throw 'canvasElement parameter is mandatory!';
        }

        this.canvas = new fabric.Canvas(canvasElement, {
            selection: false,   //按照官方文档,是禁止了group selection
            width: 600,
            height: 600,
            hoverCursor: 'pointer'
        });
        this._currentDrawing = new GeneralSelection(this);
        this._currentGraph = null;
        this._container = new Container();

    }

    get drawingClass(){
        return this._currentDrawing;
    }
    set drawingClass(clazz){
        if (!clazz instanceof Graph){
            throw  'The parameter must be an instance of Graph class';
        }
        this._currentDrawing = clazz;
    }

    draw(){
        if (!this._currentDrawing){
            return;
        }
        this._currentDrawing.do((graph)=>{
            if (graph !== null){
                this._container.add(graph);
            }

            if (this._currentGraph !== null){
                this._currentGraph.unselect();
            }
            this._currentGraph = graph;
            return graph;
        });
    }

    select(){
        this._currentDrawing =
        this._currentDrawing.select((graph)=>{
            if (graph == null){
                return null;
            }
            if (!graph instanceof Graph){
                throw 'select method must return an instance of Graph class';
            }
            this._currentGraph = graph;
            return graph;
        })
    }

    add(graph) {
        if (!graph) {
            throw 'graph parameter is mandatory!';
        }
        graph.create(()=> {
            this._container.add(graph);
        });
    }


}