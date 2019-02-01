import {Graph} from '../graph/Graph';
import Konva from "konva";
import {Toolbar} from "../toolbar/Toolbar";

export class GraphPanel {

    constructor(containerId, bkImgUrl) {
        if (!containerId) {
            throw 'containerId parameter is mandatory!';
        }

        let stage = new Konva.Stage({
            container: containerId,
            width: 600,
            height: 600,
            listening:true
        });

        this._loadBkImage(stage, bkImgUrl);

        this._stage = stage;
        this._currentManager = null;

        this._toolbar = new Toolbar(containerId);
    }

    _loadBkImage(stage, bkImgUrl) {
        let bkLayer = new Konva.Layer();
        let jsImage = new Image();
        jsImage.onload = function () {

            let bkImage = new Konva.Image({
                x: 0,
                y: 0,
                image: jsImage,
                width: 600,
                height: 600,
                listening: false
            });
            // add the shape to the layer
            bkLayer.add(bkImage);

            // add the layer to the stage
            stage.add(bkLayer);
            bkLayer.moveToBottom();
        };
        jsImage.src = bkImgUrl;
    }

    get graphManager(){
        return this._currentManager;
    }
    set graphManager(clazz){
        if (!clazz instanceof Graph){
            throw  'The parameter must be an instance of Graph class';
        }
        this._currentManager = clazz;
    }

    draw(graphManager, config){

        if (!graphManager && !this.graphManager){
            return;
        }

        if (graphManager){
            this._currentManager = graphManager;
        }

        this._currentManager.draw(config);
    }

    add(graph) {
        if (!graph) {
            throw 'graph parameter is mandatory!';
        }
        graph.create();
        this._currentManager.add(graph);
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