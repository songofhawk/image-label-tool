export class StringUtil{
    static getGuid(){
        //这里只是临时使用,只要在一张图内不重复就可以啦,不需要标准的36位uuid
        //return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        return 'xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}