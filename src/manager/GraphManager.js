import Konva from "konva";
import {DataMapping} from "../datamapping/DataMapping";

/**
 * 这是一个抽象类,封装了图形管理的通用方法
 */
export class GraphManager {

    constructor(panel,dataMappingConfig){
        this._panel = panel;
        this._stage = panel._stage;
        this._layer = new Konva.Layer();
        this._stage.add(this._layer);

        this._drawingHandler = null;
        this._container = new Container(this);

        // 本来用于绘制完成的回调,但可能不在这个地方调用了
        // this.over = (graph)=>{
        //     if (graph !== null){
        //         this._container.add(graph);
        //     }
        //
        //     return graph;
        // };

        if (dataMappingConfig){
            this._dataMapping = new DataMapping(dataMappingConfig);
        }
    }

    draw(graphOption,dataOption){
        this._drawingHandler.stepStart(graphOption);
        if (dataOption){
            this._dataMapping.setDataOption(dataOption);
        }
    }

    getAllGraph(){
        return this._container.getAll();
    }

    onDrawingOver(graph){
        if (this._dataMapping){
            this._dataMapping.create(graph);
        }
        if (this._panel._onDrawn){
            this._panel._onDrawn(graph);
        }
    }

    onChange(graph){
        if (this._dataMapping){
            this._dataMapping.update(graph);
        }
        if (this._panel._onChange){
            this._panel._onChange(graph);
        }
    }

    onDelete(graph){
        if (this._dataMapping){
            this._dataMapping.delete(graph.code);
        }
    }
}

class Container {
    constructor() {
        this._graphList = [];
        this._graphMap = {};
        this.currentGraph = null;
        this.selectedGraph = null;
    }
    /**
     * 添加指定图形
     * @param graph 被添加的图形
     */
    add(graph){
        let i = this._graphList.push(graph) - 1;
        this._graphMap[graph.code] = i;
        graph._index = i;
        graph.container = this;
    }

    /**
     * 获取指定code标识的图形
     * @param code 唯一标识
     * @returns {Graph} 图形
     */
    get(code){
        let i = this._graphMap[code];
        if (i){
            return this._graphList[i];
        }
    }

    /**
     * 删除由code标识指定的图形
     * @return {Graph} 刚刚删除的图形
     */
    remove(code){
        let i = this._graphMap[code];
        if (i){
            let deleted = this._graphList[i];
            //这里不是真的从各种列表和map中删除,只是把主列表中的指向标记为null,可以有效提高性能,get的时候返回null就可以了
            //当然反复删除以后,主列表会越来越大, 但考虑到反正也不会画很多的标注, 这点损失还可以接受
            this._graphList[i]=null;
            return deleted;
        }else{
            return null;
        }
    }

    /**
     * 获取指定本容器下的所有图形
     * @returns {Array of Graph} 图形列表
     */
    getAll(){
        return this._graphList;
    }

    /**
     * 查找指定点是否某个图形对象坐标范围内
     * @param point
     * @return {*}
     */
    findByPoint(point){
        for (let graph of this._graphList){
            if (graph.isPointOn(point)){
                return graph;
            }
        }
        return null;
    }

    /**
     * 将指定点悬浮的图形对象高亮
     * @param point
     * @return {*}
     */
    highlightByPoint(point){
        let theGraph = null;
        for (let graph of this._graphList){
            if (graph.isPointOn(point)){
                graph.highlight();
                theGraph= graph;
                this.currentGraph = theGraph;
            }else{
                graph.unHighlight();
            }
        }
        return theGraph;
    }

    select(graphToBeSelected){
        if (!graphToBeSelected){
            graphToBeSelected = this.currentGraph;
        }
        for (let graph of this._graphList){
            if (graph===graphToBeSelected){
                graph.select();
                this.selectedGraph = graph;
            }else{
                graph.deSelect();
            }
        }
    }

    getSelected(){
        return this.selectedGraph;
    }

    broadcast(msgName, sourceCode){
        this._graphList.
        filter((graph)=>graph.code!=sourceCode).
        forEach((graph)=>graph.onBoradcast(msgName, sourceCode));
    }
}