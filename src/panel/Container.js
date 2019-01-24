export class Container {
    constructor(){
        this._graphList = [];
        this._graphMap = {};
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

    getAll(){
        return this._graphList;
    }

}