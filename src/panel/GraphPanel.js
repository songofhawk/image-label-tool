import {Graph} from '../graph/Graph';
import {GraphAxis} from '../graph/GraphAxis';


export class GraphPanel {

    constructor(canvasElement) {
        if (!canvasElement) {
            throw "canvasElement parameter is mandatory!";
        }

        this.canvas = new fabric.Canvas(canvasElement, {
            selection: false,   //按照官方文档,是禁止了group selection
            width: 600,
            height: 600,
            hoverCursor: 'pointer'
        });
        this.container = [];
        this._currentDrawing = GraphAxis;
        this._currentGraph = null;
    }

    add(graph) {
        if (!graph) {
            throw "graph parameter is mandatory!";
        }
        console.log(this.canvas);
    }


}