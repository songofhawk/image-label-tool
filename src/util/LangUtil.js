export class LangUtil {
    static getClassName(obj) {
        let name = obj.constructor.toString().match(/^function([^(]+?)\(/);

        if (name && name[1]) {
            return name[1];
        } else {
            throw '找不到对象的构造函数!';
        }
    }

    static getGuid() {
        //return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        //这里只是临时使用,只要在一张图内不重复就可以啦,不需要标准的36位uuid
        return 'xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static copyProperties(source, target, mappings) {
        if (!mappings) {
            LangUtil.copyAllProperties(source, target);
            return;
        }
        mappings.forEach((mapping) => {
            let sKey = mapping.source.key;
            let sType = mapping.source.type;
            let tKey = mapping.target.key;
            let tType = mapping.target.type;

            let sValue = source[sKey];
            if (typeof (sValue)==='undefined'){
                return;
            }
            let tValue;

            if (sType === PropertyType.Json) {
                tValue = JSON.parse(sValue);
            } else if (sType === PropertyType.Function) {
                tValue = source[sKey]();
            } else if (sType === PropertyType.Normal) {
                tValue = sValue;
            } else if (sType === PropertyType.Array) {
                tValue = [];
                sValue.forEach((subSValue) => {
                    let subTValue = {};
                    LangUtil.copyProperties(subSValue, subTValue, mapping.subMappings);
                    tValue.push(subTValue);
                })
            }

            if (tType === PropertyType.Json) {
                tValue = JSON.stringify(tValue);
            }

            target[tKey] = tValue;
        })
    }

    static copyAllProperties(source, target) {
        let keys = Object.keys(source);
        keys.forEach((key) => {
            if (typeof (source[key])==='undefined'){
                return;
            }
            target[key] = source[key];
        })
    }

    static clone(source){
        let target = {};
        this.copyAllProperties(source,target);
        return target;
    }

    static parseMappingStr(key, type) {
        let typeSym = PropertyType.fromString(type);
        if (typeSym === PropertyType.Unknown) {
            typeSym = PropertyType.detectType(key);
        }
        switch (typeSym) {
            case PropertyType.Array:
                let posLeft = key.indexOf('[');
                let posRight = key.lastIndexOf(']');
                return {
                    key: key.substring(0, posLeft),
                    subMappingArray: key.substring(posLeft + 1, posRight).split(','),
                    type: PropertyType.Array
                };
            case PropertyType.Function:
                let posParenthesis = key.indexOf('(');
                return {
                    key: key.substring(0, posParenthesis),
                    type: PropertyType.Function
                };
            default:
                return {
                    key: key,
                    type: PropertyType.Normal
                }
        }
    }

    static composeMappingArray(sArray, tArray) {
        if (!sArray || !tArray) {
            return null;
        }
        let mappingArray = [];
        for (let i = 0; i < sArray.length; i++) {
            mappingArray.push({
                source:LangUtil.parseMappingStr(sArray[i]),
                target:LangUtil.parseMappingStr(tArray[i])
            });
        }
        return mappingArray;
    }

}

export let PropertyType = {
    Function: Symbol('函数'),
    Normal: Symbol('基本类型或者对象'),
    Json: Symbol('Json字符串表达的数据类型'),
    Array: Symbol('数组'),
    Unknown: Symbol('未知类型'),
    fromString: function (str) {
        if (!str) {
            return this.Unknown;
        }
        switch (str.toLowerCase()) {
            case 'normal':
                return this.Normal;
            case 'function':
                return this.Function;
            case 'json':
                return this.Json;
            case 'array':
                return this.Array;
            default:
                return this.Unknown;
        }
    },
    detectType: function (key) {
        if (!key) {
            return this.Unknown;
        }
        if (key.indexOf('[') > 0) {
            return this.Array;
        }
        if (key.indexOf('(') > 0) {
            return this.Function;
        }
        return this.Normal;
    }
};



