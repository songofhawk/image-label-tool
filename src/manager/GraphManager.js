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

        this._panel.regist(this);

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

    getAllGraphs(){
        return this._container.getAll();
    }

    onDrawingOver(graph){
        if (this._dataMapping){
            this._dataMapping.createData(graph);
        }
        if (this._panel._onDrawn){
            this._panel._onDrawn(graph);
        }
    }

    onChange(graph){
        if (this._dataMapping){
            this._dataMapping.updateData(graph);
        }
        if (this._panel._onChange){
            this._panel._onChange(graph);
        }
    }

    onDelete(graph){
        if (this._dataMapping){
            this._dataMapping.deleteData(graph.code);
        }
    }

    create(data){
        if (!data){
            data = this._dataMapping._data;
        }

        if (!data){
            throw 'GraphManager的create方法,必须传递data参数';
        }
        if (data instanceof Array) {
            data.forEach(this._createOne, this);
        }else{
            this._createOne(data);
        }
        this._layer.draw();
    }

    /**
     * 按新数据加载新的图形
     * @param data 新的数据
     * @param keepDataMapping 是否保持原来的数据映射,缺省操作是先分离数据映射,清空图形以后,按新的数据重新加载数据映射
     */
    reload(data, keepDataMapping){
        this._panel._toolbar.hide();

        let oldDataMapping = this._dataMapping;

        if (!keepDataMapping){
            this._dataMapping = null;
        }

        this._container.removeAll();

        if (!keepDataMapping){
            this._dataMapping = oldDataMapping;
        }
        oldDataMapping.setData(data);
        this.create();
        this._layer.draw();
    }


    /**
     * 创建一个图形对象,供子类重写
     * 子类的这个方法最后,应该回调父类的onAfterCreateOne方法
     */
    _createOne(dataOne) {
        let desc = this._createGraphDesc(dataOne);
        let graph = this._createGraphObjByDesc(desc);
        this._container.add(graph);
    }

    _createGraphDesc(dataOne){
        let desc = this._dataMapping.createGraph(dataOne);
        desc.bindEvent=true;
        return desc;
    }

    _createGraphObjByDesc(desc){
        throw 'SubClass of GraphManager mush implements _createGraphObjByDesc method!';
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

    replaceLast(graph){
        this._graphList.pop();
        this.add(graph);
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
            this._graphList[i].delete();
            this._graphList[i]=null;
            return deleted;
        }else{
            return null;
        }
    }

    removeAll(){
        this._graphList.forEach((graph)=>{
            graph.delete();
        });
        this._graphList=[];
        this._graphMap={};
    }

    /**
     * 获取指定本容器下的所有图形
     * @returns {Array} 图形对象列表
     */
    getAll(){
        return this._graphList;
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
        filter((graph)=>graph.code!==sourceCode).
        forEach((graph)=>graph.onBoradcast(msgName, sourceCode));
    }
}