export class AbstractOperator {
    constructor(manager){
        this._manager = manager;
        this._layer = manager._layer;
    }

    /**
     * 开始操作
     * @return {boolean} 是否重绘(true:重绘, false:不重绘)
     */
    stepStart(){
    }


    /**
     * 单步移动
     * @param screenPoint 当前鼠标位置
     * @param step 步骤数
     * @return {boolean} 是否渲染
     */
    stepMove(screenPoint, step){

    }
    /**
     * 单步鼠标按下
     * @param screenPoint 当前鼠标位置
     * @param step 步骤数
     * @return {boolean} 是否渲染
     */
    stepDown(screenPoint, step){

    }
    /**
     * 单步鼠标抬起
     * @param screenPoint 当前鼠标位置
     * @param step 步骤数
     * @return {boolean} 是否渲染
     */
    stepUp(screenPoint, step){

    }
    /**
     * 操作结束
     * @param screenPoint 当前鼠标位置
     * @param step 步骤数
     * @return {Graph} 绘制对象
     */
    stepOver(screenPoint, step){

    }


    render(){
        this._layer.draw();
    }

    get stepCount(){
        return 1;
    }

    get defaultColor(){
        return 'rgba(80,80,80,0.5)';
    }
}