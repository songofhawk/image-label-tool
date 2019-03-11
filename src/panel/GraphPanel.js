import {Graph} from '../graph/Graph';
import Konva from "konva";
import {Toolbar} from "../toolbar/Toolbar";

import {GraphImageTextManager} from "../graph/GraphImageText";
import {GraphAxisManager} from "../graph/GraphAxis";
import {GraphPointAreaManager} from "../graph/GraphPointArea";
import {Graph3DImageTextManager} from "../graph3D/Graph3D";
import {GraphText} from "../graph/GraphText";


export class GraphPanel {
    /**
     * 画板初始化
     * @param containerId 画板容器元素的id
     * @param width 画布宽度,缺省值800
     * @param height 画布高度,缺省值800
     * @param bkImgUrl 背景图url
     * @param onDrawn 绘制完成图形以后的回调函数
     * @param onSetProperty 点击图形设置属性以后的回调函数
     * @param onDelete 删除图形以后的回调函数
     * @param onChange 修改图形以后的回调函数
     * @param onDbClick 双击图形以后的回调函数
     * @param onCreate panel创建成功以后的回调函数
     */
    constructor({containerId, width, height, bkImgUrl, onDrawn, onSetProperty, onDelete, onChange, onDbClick, onCreate}) {
        if (!containerId) {
            throw 'containerId parameter is mandatory!';
        }
        this._stage= new Konva.Stage({
            container: containerId,
            width: width?width:200,
            height: height?height:200,
            listening:true
        });

        let self = this;
        this._loadBkImage(bkImgUrl,width,height,function() {
            if (self._onCreate){
                self._onCreate();
            }
        });

        this._currentManager = null;
        this._toolbar = new Toolbar(containerId, onSetProperty, onDelete);
        this._onDrawn = onDrawn;
        this._onChange = onChange;
        this._onDbClick = onDbClick;
        this._container = document.getElementById(containerId);
        this._onCreate = onCreate;
    }

    _unloadBkImage(){
        this._bkLayer.destroy();
    }

    _loadBkImage(bkImgUrl,width,height, callBack) {
        let bkLayer = new Konva.Layer();
        let imageElement = new Image();
        let self = this;
        imageElement.onload = function () {
            console.log(imageElement.width, imageElement.height);
            width = width?width:imageElement.width;
            height = height?height:imageElement.height;
            let bkImage = new Konva.Image({
                x: 0,
                y: 0,
                image: imageElement,
                width: width,
                height: height,
                listening: false
            });
            bkLayer.add(bkImage);

            // add the layer to the stage
            self._stage.width(width);
            self._stage.height(height);
            self._stage.add(bkLayer);
            self._bkLayer = bkLayer;
            bkLayer.moveToBottom();

            if (callBack){
                callBack(width,height,bkLayer);
            }
        };
        imageElement.src = bkImgUrl;
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

    reloadBackground(bkImgUrl,callBack){
        this._unloadBkImage();
        this._loadBkImage(bkImgUrl,callBack);
    }

    toDataURL(){
        return this._stage.toDataURL();
    }
}

if(window){
    window.GraphPanel = GraphPanel;
    window.GraphImageTextManager = GraphImageTextManager;
    window.GraphAxisManager = GraphAxisManager;
    window.GraphPointAreaManager = GraphPointAreaManager;
    window.Graph3DImageTextManager = Graph3DImageTextManager;
    window.GraphText = GraphText;
}

