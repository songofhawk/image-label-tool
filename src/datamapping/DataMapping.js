export class DataMapping{
    /**
     *
     * @param data 原始数据节点
     * @param config 映射配置信息
     */
    constructor (data, config) {
        if (!data) {
            throw '没有源数据，无法创建数据映射对象！';
        }
        if (!config) {
            throw '没有映射规则，无法创建数据映射对象！';
        }

        /**
         * 把映射字符串,解析成映射节点
         * @param mappingStr
         * @return {*}
         */
        function getMappingNode(mappingStr) {
            let pos = mappingStr.indexOf('[');
            if (pos < 0) {
                return {name: mappingStr};
            } else {
                let nodeName = mappingStr.substring(0, pos);
                let properStr = mappingStr.substring(pos);
                let properArray = JSON.parse(properStr);
                let properMap = {};
                for (let i = 0; i < properArray.length; i++) {
                    //把rule里的properties转化成map,便于以后查找
                    properMap[properArray[i]] = i;
                }
                return {
                    name: nodeName,
                    properArray: properArray,
                    properMap: properMap
                }
            }
        }

        //在data中找到要映射的根节点
        let forData = JsonNode.getNodeByPath(config.for, data);
        this.rule = {};
        if (forData instanceof Array) {
            this.rule.key = config.key;
        }
        this.rule.in = LangUtil.copyPropertiesOfArrayOrObject(config.in, function (key, obj) {
            if (key == 'data' || key == 'graph') {
                //把带属性名数组的字符串转化成特定格式的数据结构, 以便以后处理映射
                return getMappingNode(obj);
            } else {
                return obj;
            }
        });

        this.data = forData;
    }

    /**
     * 根据图形对象,创建数据节点
     *
     * @param graphs
     * @param dataOption
     */
    create(graphs, dataOption){
        if (graphs instanceof Array){
            for (let i=0;i<graphs.length;i++){
                let graphObj = graphs[i];
                this.createOne(graphObj, dataOption);
            }
        }else{
            this.createOne(graphs, dataOption);
        }
    };


    /**
     * 根据指定的图形对象key, 删除数据节点
     * @param key
     */
    delete(key){
        let forData = this.data;
        let keyName = this.rule.key;
        for (let i = 0; i<forData.length; i++){
            let data = forData[i];
            if (data[keyName]==key){
                break;
            }
        }
        forData.splice(i,1);
    };

    /**
     * 根据图形对象,更新对应的数据节点
     * @param graphs
     */
    update(graphs){
        if (graphs instanceof Array){
            for (let i=0;i<graphs.length;i++){
                let graph = graphs[i];
                this.updateOne(graph);
            }
        }else{
            this.updateOne(graphs);
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
     * @param dataOption
     */
    createOne(graph, dataOption){
        let data = this._generateOne(graph, dataOption);
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
    updateOne(graph){
        let forData = this.data;
        let mappingRule = this.rule;
        let data = this._generateOne(graph);

        let i=0;
        for (; i<forData.length; i++){
            let item = forData[i];
            if (item[mappingRule.key] && item[mappingRule.key] == graph.key){
                break;
            };
        }
        if (i<forData.length){
            forData[i] = data;
        }
    }

    /**
     * 生成一个数据节点(创建和更新的时候都需要)
     * @param {Object} graph
     * @param {Object} dataOption
     */
    _generateOne(graph, dataOption){
        let data = {};
        let inRules = this.rule.in;
        for (let i=0; i< inRules.length; i++){
            let inRule = inRules[i];
            let graphFiltered = {} //根据指定的properties, 过滤以后的图形属性
            let graphProperMap = inRule.graph.properMap;
            let dataProperArray = inRule.data.properArray;
            if (graphProperMap){ //如果指定了properties, 那么就不能整个对象转换, 而是只转换特定的属性
                graphFiltered = LangUtil.copyPropertiesOfArrayOrObject(graph[inRule.graph.name], function(key, obj){
                    if (graphProperMap[key]==undefined){
                        return undefined;
                    }else{
                        return {
                            key: dataProperArray[graphProperMap[key]],
                            value: obj,
                            isMapping: true
                        }
                    }
                });
            }else{
                graphFiltered = graph[inRule.graph.name];
            }

            if (inRule.dataType && inRule.dataType.toLowerCase() == "json"){ //如果数据类型是json, 那么要把graph指向的对象转换成json串
                data[inRule.data.name] = JSON.stringify(graphFiltered);
            }else{ //未指定数据类型, 或者未知的类型, 都
                data[inRule.data.name] = graphFiltered;
            }
        }
        if (dataOption){
            LangUtil.copyProperties(dataOption, data);
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
}


class JsonNode {
    static getNodeByPath (mappingPath, jsonData){
        if (!jsonData){
            throw '数据为空,无法获取路径节点"'+path+'"';
        }
        let pArray = this.getPArrayByPath(mappingPath);
        return this.getNodeByPArray(pArray, jsonData);
    }

    static getPArrayByPath(path){
        return path.split('.');
    }

    static getNodeByPArray(pArray, jsonData){
        let targetData = jsonData;
        for (let i=0;i<pArray.length;i++){
            let forName = pArray[i];
            if (forName==null && forName==''){
                continue;
            }
            let nextData = targetData[forName];
            if (!nextData){
                nextData = targetData[forName] = {};
            }
            targetData = nextData;
        }
        if (!targetData){
            throw '找不到指定的节点"'+path+'"';
        }
        return targetData;
    }

}