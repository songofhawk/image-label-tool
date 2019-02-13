// import  {LangUtil} from '../util/LangUtil';
import {LangUtil, PropertyType} from "../util/LangUtil";
import {JsonUtil} from "../util/JsonUtil";

export class DataMapping{
    /**
     *
     * @param data 原始数据节点
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
        this.data = JsonUtil.getNodeByPath(config.data, config.for);
    }

    setDataOption(dataOption){
        this._dataOption = dataOption;
    }

    /**
     * 根据图形对象,创建数据节点
     *
     * @param graphs
     * @param dataOption
     */
    create(graphs){
        if (graphs instanceof Array){
            for (let i=0;i<graphs.length;i++){
                let graphObj = graphs[i];
                this.createOne(graphObj);
            }
        }else{
            this.createOne(graphs);
        }
    };


    /**
     * 根据指定的图形对象key, 删除数据节点
     * @param key
     */
    delete(key){
        let rootData = this.data;
        let keyName = this.rule.dataKey;
        let i;
        for (i=0; i<rootData.length; i++){
            let data = rootData[i];
            if (data[keyName]==key){
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
        this.data.splice(0,this.data.length);
    }

    /**
     * 创建一个数据节点
     * @param graph
     */
    createOne(graph){
        let data = this._generateOne(graph);
        if (this.data instanceof Array){
            this.data.push(data);
        }else{
            this.data = data;
        }
    }

    /**
     * 更新一个数据节点
     * @param graph
     */
    update(graph){
        let rootData = this.data;
        let rule = this.rule;
        let newData = this._generateOne(graph);

        let i=0;
        for (; i<rootData.length; i++){
            let item = rootData[i];
            if (item[rule.dataKey] && item[rule.dataKey] == graph.code){
                break;
            };
        }
        if (i<rootData.length){
            rootData[i] = newData;
        }
    }

    /**
     * 生成一个数据节点(创建和更新的时候都需要)
     * @param {Object} graph
     * @param {Object} dataOption
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
     * @return 图形包装对象
     */
    createGraphDesciption(data){
        if (!data){
            data = forData;
        }
        if (!data){
            return null;
        }
        if (data instanceof Array){
            let discriptions = [];
            for (let i=0;i<data.length;i++){
                let dataOne = data[i];
                let wrapperOne = this.createOneGraphDescription(dataOne);
                discriptions.push(wrapperOne);
            }
            return discriptions;
        }else{
            return this.createOneGraphDescription(data);
        }
    }

    /**
     * 根据给定的单个数据节点,生成对应的图形描述对象
     * @param {Object} data 单数据节点
     */
    createOneGraphDescription(data){
        let description = {};
        let inRules = this.rule.in;
        for (let i=0; i< inRules.length; i++){
            let inRule = inRules[i];
            let dataItem = data[inRule.data.name];
            let graphItem;
            if (inRule.dataType && inRule.dataType.toLowerCase() == "json"){ //如果数据类型是json, 那么要把graph指向的对象转换成json串
                graphItem = JSON.parse(dataItem);
            }else{ //未指定数据类型, 或者未知的类型, 都
                graphItem = dataItem;
            }

            let graphFiltered = {} //根据指定的properties, 过滤以后的图形属性
            let graphProperArray = inRule.graph.properArray;
            let dataProperMap = inRule.data.properMap;
            if (dataProperMap){ //如果指定了properties, 那么就不能整个对象转换, 而是只转换特定的属性
                graphFiltered = LangUtil.copyPropertiesOfArrayOrObject(graphItem, function(key, obj){
                    let dataProperIndex = dataProperMap[key];
                    if (dataProperIndex==undefined || dataProperIndex==null) {
                        return undefined;
                    }else{
                        return {
                            key: graphProperArray[dataProperMap[key]],
                            value: obj,
                            isMapping: true
                        }
                    }
                })
            }else{
                graphFiltered = graphItem;
            }
            description[inRule.graph.name] = graphFiltered;
        }
        return description;
    }

    _parseMappingConfig(mappingConfigArray) {
        let d2g = [];
        let g2d = [];
        mappingConfigArray.forEach((configItem) => {
            let item = this._parseMappingConfigItem(configItem);
            d2g.push(item.d2g);
            g2d.push(item.g2d);
        });
        return {
            d2g,
            g2d
        };
    }

    _parseMappingConfigItem(configItem) {
        let data = LangUtil.parseMappingStr(configItem.data, null);
        let graph = LangUtil.parseMappingStr(configItem.graph, null);

        let d2gSub = LangUtil.composeMappingArray(data.subMappingArray, graph.subMappingArray);
        let g2dSub = LangUtil.composeMappingArray(graph.subMappingArray, data.subMappingArray);
        data.subMappingArray=null;
        graph.subMappingArray=null;


        let dataType = PropertyType.fromString(configItem.dataType);

        let d2gSource = LangUtil.clone(data);
        d2gSource.type = dataType? dataType: d2gSource.type;

        let g2dTarget = LangUtil.clone(data);
        g2dTarget.type = dataType? dataType: g2dTarget.type;

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

}


