import Konva from "konva";
import {AbstractOperator} from "./AbstractOperator";

export class AbstractManager {
    constructor(panel){
        this._stage = panel._stage;
        this._layer = new Konva.Layer();
        this._stage.add(this._layer);
        this._panel = panel;

        this._drawingOperator = null;

        this._container = new Container();
    }

    get drawingOperator(){
        throw 'Drawing operator is not defined in concrete class!';
    }
    get selectingOperator(){
        throw 'Selecting operator is not defined in concrete class!';
    }
    get editingOperator(){
        throw 'Editing operator is not defined in concrete class!';
    }
}

export class AbstractDrawingOperator extends AbstractOperator{
    constructor(manager){
        super(manager);
    }

    stepStart(){
        return false;
    }

    stepMove(screenPoint, step){
        return true;
    }

    stepDown(screenPoint, step){

    }
    stepUp(screenPoint, step){

    }
    stepOver(screenPoint, step){
        super.stepOver(screenPoint, step);
    }
    afterStepOver(graph){
        this._manager._container.add(graph);
    }

    get stepCount(){
        return 1;
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
}