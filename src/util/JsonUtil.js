export class JsonUtil {
    static getNodeByPath(jsonData, mappingPath){
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