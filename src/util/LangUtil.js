class LangUtil {
    static getClassName (obj){
        let name = obj.constructor.toString().match(/^function([^\(]+?)\(/);

        if(name && name[1]){
            return name[1];
        }else{
            throw '找不到对象的构造函数!';
        }
    }
    static getGuid (){
        //return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        //这里只是临时使用,只要在一张图内不重复就可以啦,不需要标准的36位uuid
        return 'xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
    /**
     * 复制属性
     * @param source: 源对象
     * @param target: 复制前的目标对象
     * @param proerFilter: 每个属性处理的过滤方法
     *      @param key: 过滤方法参数: 属性名
     *      @param obj: 过滤方法参数: 属性对象, 如果不是基本类型,这里就是引用, 也就是说,是浅复制
     *      @returns 过滤方法返回值: 如果返回undifined, 表示这个属性不用复制;
     *                  如果返回一个普通对象, 则把这个对象作为value赋给target的key属性;
     *                  如果返回一个{key:'', value:'', isMapping: true}对象, 则把返回值的key作为target的key, 返回值的value作为target的value
     * @returns 复制后的目标对象
     */
    static copyProperties(source, target, properFilter){
        if (!source && !target){
            return undefined;
        }
        if (!source){
            return target;
        }
        if (!target){
            target = {};
        }

        let keys = Object.keys(source);
        for (var i=0; i<keys.length; i++ ){
            let key = keys[i];
            if (properFilter){
                let ret = properFilter(key, source[key]);
                if (ret==undefined){
                    continue;
                }
                if (ret.isMapping){
                    target[ret.key] = ret.value;
                }else{
                    target[key] = ret;
                }
            }else{
                target[key] = source[key];
            }
        }
        return target;
    }

    static copyPropertiesOfArrayOrObject(source, properFilter){
        if (!source){
            return undefined;
        }
        if (source instanceof Array){
            let target = [];
            for (let i=0;i<source.length;i++){
                let sourceItem = source[i];
                let targetItem = LangUtil.copyProperties(sourceItem, null, properFilter);
                target.push(targetItem);
            }
            return target;
        }else{
            return LangUtil.copyProperties(source, null, properFilter);
        }
    }

}