// import  {LangUtil} from '../util/LangUtil';
import {LangUtil, PropertyType} from "../util/LangUtil";
import {JsonUtil} from "../util/JsonUtil";

export class DataMapping{
    /**
     *
     * @param config 映射配置信息
     */
    constructor(config) {

        if (!config) {
            throw '没有映射配置信息，无法创建数据映射对象！';
        }
        if (!config.data) {
            throw '没有源数据，无法创建数据映射对象！';
        }
        if (!config.mapping) {
            throw '没有映射规则，无法创建数据映射对象！';
        }

        this.rule = {
            dataKey:config.dataKey,
            mapping:this._parseMappingConfig(config.mapping)
        };
        this.dataPath = config.for;
        this.dataFilter = config.filter;
        this.setData(config.data);
    }

    setData(data){
        this._data = JsonUtil.getNodeByPath(data, this.dataPath);
        if (this.dataFilter){
            this._filtedData = this._data.filter(this.dataFilter);
        }else {
            delete this._filtedData;
        }
    }

    setDataOption(dataOption){
        this._dataOption = dataOption;
    }

    setGraphOption(graphOption){
        this._graphOption = graphOption;
    }

    /**
     * 根据图形对象,创建数据节点
     *
     * @param graphs
     */
    createDataMulti(graphs){
        if (graphs instanceof Array){
            for (let i=0;i<graphs.length;i++){
                let graphObj = graphs[i];
                this.createData(graphObj);
            }
        }else{
            this.createData(graphs);
        }
    };


    /**
     * 根据指定的图形对象key, 删除数据节点
     * @param key
     */
    deleteData(key){
        let rootData = this._data;
        let keyName = this.rule.dataKey;
        let i;
        for (i=0; i<rootData.length; i++){
            let data = rootData[i];
            if (data[keyName]===key){
                break;
            }
        }
        if (i<rootData.length){
            rootData.splice(i,1);
        }
    };

    /**
     *清除所有数据节点
     */
    clear(){
        this._data.splice(0,this._data.length);
    }

    /**
     * 创建一个数据节点
     * @param graph
     */
    createData(graph){
        let data = this._generateOne(graph);
        if (this._data instanceof Array){
            this._data.push(data);
        }else{
            LangUtil.copyAllProperties(data, this._data);
        }
    }

    /**
     * 更新一个数据节点
     * @param graph
     */
    updateData(graph){
        let rootData = this._data;
        let rule = this.rule;
        let newData = this._generateOne(graph);

        let i=0;
        for (; i<rootData.length; i++){
            let item = rootData[i];
            if (item[rule.dataKey] && item[rule.dataKey] === graph.code){
                break;
            }
        }
        if (i<rootData.length){
            LangUtil.copyAllProperties(newData, rootData[i]);
        }
    }

    /**
     * 生成一个数据节点(创建和更新的时候都需要)
     * @param {Object} graph
     */
    _generateOne(graph){
        let data = {};
        if (graph.code && this.rule.dataKey){
            data[this.rule.dataKey]=graph.code;
        }
        let g2dRules = this.rule.mapping.g2d;

        LangUtil.copyProperties(graph,data,g2dRules);
        let dataOption = this._dataOption;
        if (dataOption){
            LangUtil.copyProperties(dataOption,data);
        }
        return data;
    }

    /**
     * 根据给定的数据节点,生成对应的图形描述对象(graphConfig, 真正的图形对象,是要由具体的manager生成的,这里只负责处理映射关系, 生成需要的参数)
     * @param {Object} data 数据节点,可以是数组, 也可以是一个单节点
     * @return {Array} 图形包装对象
     */
    createGraphMulti(data){
        if (!data){
            data = this._data;
        }
        if (!data){
            return null;
        }
        if (data instanceof Array){
            let descriptions = [];
            data.forEach((dataOne)=>{
                let desc = this.createGraph(dataOne);
                descriptions.push(desc);
            });
            return descriptions;
        }else{
            return this.createGraph(data);
        }
    }

    /**
     * 根据给定的单个数据节点,生成对应的图形描述对象
     * @param {Object} data 单数据节点
     */
    createGraph(data){
        let description = {};
        let dataKey = this.rule.dataKey;
        if (dataKey && data[dataKey]){
            description.code=data[dataKey];
        }
        let d2gRules = this.rule.mapping.d2g;

        LangUtil.copyProperties(data,description,d2gRules);
        // let dataOption = this._dataOption;
        // if (dataOption){
        //     LangUtil.copyProperties(dataOption,description);
        // }
        return description;
    }

    _parseMappingConfig(mappingConfigArray) {
        let d2g = [];
        let g2d = [];
        mappingConfigArray.forEach((configItem) => {
            let item = DataMapping._parseMappingConfigItem(configItem);
            d2g.push(item.d2g);
            g2d.push(item.g2d);
        });
        return {
            d2g,
            g2d
        };
    }

    static _parseMappingConfigItem(configItem) {
        let data = LangUtil.parseMappingStr(configItem.data, null);
        let graph = LangUtil.parseMappingStr(configItem.graph, null);

        let d2gSub = LangUtil.composeMappingArray(data.subMappingArray, graph.subMappingArray);
        let g2dSub = LangUtil.composeMappingArray(graph.subMappingArray, data.subMappingArray);
        data.subMappingArray=null;
        graph.subMappingArray=null;


        let dataTypeFromConfig = PropertyType.fromString(configItem.dataType);

        let d2gSource = LangUtil.clone(data);
        d2gSource.type = (dataTypeFromConfig===PropertyType.Unknown) ?
            d2gSource.type : dataTypeFromConfig;

        let g2dTarget = LangUtil.clone(data);
        g2dTarget.type = (dataTypeFromConfig===PropertyType.Unknown) ?
            g2dTarget.type : dataTypeFromConfig;

        return {
            d2g: {
                source: d2gSource,
                target: graph,
                subMappings: d2gSub
            },
            g2d: {
                source: graph,
                target: g2dTarget,
                subMappings: g2dSub
            }
        }
    }

    getDataItemByGraphCode(code){
        if (!code){
            return null;
        }
        let dataKeyValue = code;
        let data = this.data;

        for (let i=0;i<data.length;i++){
            if (data[i][this.rule.dataKey]===dataKeyValue){
                return data[i];
            }
        }
        return null;
    }

    get data(){
        return this._filtedData? this._filtedData : this._data;
    }
}


