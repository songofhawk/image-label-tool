import {Graph} from '../graph/Graph';
import Konva from "konva";
import {Toolbar} from "../toolbar/Toolbar";

import {GraphImageTextManager} from "../graph/GraphImageText";
import {GraphAxisManager} from "../graph/GraphAxis";
import {GraphPointAreaManager} from "../graph/GraphPointArea";
import {Graph3DImageTextManager} from "../cssgraph/Graph3DImageText";


export class GraphPanel {
    /**
     * 画板初始化
     * @param containerId 画板容器元素的id
     * @param bkImgUrl 背景图url
     * @param onDrawn 绘制完成图形以后的回调函数
     * @param onSetProperty 点击图形设置属性以后的回调函数
     * @param onDelete 删除图形以后的回调函数
     * @param onChange 修改图形以后的回调函数
     */
    constructor({containerId, bkImgUrl, onDrawn, onSetProperty, onDelete, onChange}) {
        if (!containerId) {
            throw 'containerId parameter is mandatory!';
        }

        this._stage= new Konva.Stage({
            container: containerId,
            width: 600,
            height: 600,
            listening:true
        });

        this._loadBkImage(bkImgUrl);
        this._currentManager = null;

        this._toolbar = new Toolbar(containerId, onSetProperty, onDelete);
        this._onDrawn = onDrawn;
        this._onChange = onChange;

        this._container = document.getElementById(containerId);
    }

    _unloadBkImage(){
        this._bkLayer.destroy();
    }

    _loadBkImage(bkImgUrl) {
        let bkLayer = new Konva.Layer();
        let jsImage = new Image();
        let self = this;
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
            self._stage.add(bkLayer);
            bkLayer.moveToBottom();
            self._bkLayer = bkLayer;
            self.render();
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
     * 重绘整个画板
     * @private
     */

    render(){
        this._stage.draw();
    }

    regist(manager){
        if (!this._managers){
            this._managers = [];
        }
        this._managers.push(manager);
    }

    reloadBackground(bkImgUrl){
        this._unloadBkImage();
        this._loadBkImage(bkImgUrl);
    }
}

if(window){
    window.GraphPanel = GraphPanel;
    window.GraphImageTextManager = GraphImageTextManager;
    window.GraphAxisManager = GraphAxisManager;
    window.GraphPointAreaManager = GraphPointAreaManager;
    window.Graph3DImageTextManager = Graph3DImageTextManager;
}

