export class Container {
    constructor(){
        this._graphList = [];
        this._graphMap = {};
        this._graphClassMap = {};
    }

    /**
     * 添加指定图形
     * @param graph 被添加的图形
     */
    add(graph){
        let i = this._graphList.push(graph) - 1;
        this._graphMap[graph.code] = i;

        let className = graph.name;
        let classList = this._graphClassMap[className];
        if (!classList){
            classList = [];
            this._graphClassMap[className] = classList;
        }
        classList.push(i);
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
     * 获取指定类别的所有图形
     * @param className 类别名称
     * @returns {Array of Graph} 图形列表
     */
    getAllInClass(className)
    {
        let graphList = [];
        let indexList = this._graphClassMap(className);
        if (indexList==null){
            return graphList;
        }
        for (let i of indexList){
            graphList.push(this._graphList[i]);
        }
        return graphList;
    }
}