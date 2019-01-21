import Konva from 'konva';
import {Graph} from "./Graph";
import {AbstractManager} from "../drawing/AbstractManager";
import {AbstractDrawingOperator} from "../drawing/AbstractManager";


export class GraphImage extends Graph{
    constructor(layer,config) {
        super(layer);

        this._group = new Konva.Group({
            x:0,
            y:0,
            width: config.width,
            height: config.height,
            draggable:true
        });
        layer.add(this._group);

        let imageObj = new Image();
        let self = this;

        imageObj.onload = function() {
            let image = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: config.width,
                height: config.height,
                listening:true
            });
            self._group.add(image);
            self._group.image = image;

            let decor = new Konva.Rect({
                x: - 1,
                y: - 1,
                width: config.width+1,
                height: config.height+1,
                fillEnabled: false,
                stroke: 'LightGray',
                strokeWidth: 3
            })
            decor.hide();
            self._group.decor = decor;
            self._group.add(decor);

            image.on("mouseover", function (e) {
                console.log('mouse over on image: '+self.code);
                self.mouseOver();
            });

            image.on("mouseout", function (e) {
                console.log('mouse out from image: '+self.code);
                self.mouseOut();
            });
        };
        imageObj.src = config.src;

        // this._group.on("mouseover", function (e) {
        //     console.log('mouse over on group: '+self.code);
        // })


    }

    create(callBack){

    }

    moveTo(point){
        if (!this._group){
            return;
        }
        this._group.setX(point.x);
        this._group.setY(point.y);
    }

    moveOn(){

    }

    select(){
        this._group.decor.stroke('#FFCC99');
        this._group.decor.show();

        super.select();
    }

    /**
     * 取消选择
     */
    deSelect(){
        this._group.decor.stroke('LightGray');
        this._group.decor.hide();
        super.deSelect();
    }

    delete(){

    }

    isPointOn(point){
        let x=point.x, y=point.y;
        let graph = this._group;
        let minX = graph.x(), minY = graph.y(),
            maxX = graph.x()+graph.width(),
            maxY = graph.y()+graph.height();
        if (x>=minX && y>=minY && x<=maxX && y<=maxY){
            return true;
        }
        return false;
    }

    highlight(){
        this._group.decor.show();
    }

    unHighlight(){
        this._group.decor.hide();
    }

    enableEdit(){
        let tr = new Konva.Transformer();
        this._layer.add(tr);

        let group = this._group;
        tr.attachTo(group);

        // 在transform结束的时候,把scale调整为实际的宽和高,但效果并不好, 点击图片中心会缩回去
        // 代码来自官网的一个回答: https://konvajs.github.io/docs/select_and_transform/Basic_demo.html
        // group.on('transformend', function () {
        //     console.log('transform end');
        //     group.setAttrs({
        //         width: group.width() * group.scaleX(),
        //         height: group.height() * group.scaleY(),
        //         scaleX: 1,
        //         scaleY: 1,
        //     })
        // });
    }
}

export class GraphImageManager extends AbstractManager{
    constructor(panel){
        super(panel);
        this._axis = null;
        this._drawingOperator = new ImageDrawingOperator(this);
        this._selectingOperator = new ImageSelectingOperator(this);
        this._editingOperator = new ImageEditingOperator(this);
    }

    get drawingOperator(){
        return this._drawingOperator;
    }
    get selectingOperator(){
        return this._selectingOperator;
    }
    get editingOperator(){
        return this._editingOperator;
    }

}

class ImageDrawingOperator extends AbstractDrawingOperator{
    constructor(manager){
        super(manager);
    }

    stepStart(config){
        this._manager.currentGraph = new GraphImage(this._layer, config);
        this._manager._stage.container().style.cursor = 'crosshair';
        return false;
    }

    stepMove(screenPoint, step){
        this._manager.currentGraph.moveTo(screenPoint);
        return true;
    }

    stepDown(screenPoint, step){

    }
    stepUp(screenPoint, step){

    }
    stepOver(screenPoint, step){
        super.stepOver(screenPoint, step);
        this._manager._stage.container().style.cursor = 'default';
        super.afterStepOver(this._manager.currentGraph);
        return this._manager.currentGraph;
    }

    get stepCount(){
        return 1;
    }
}

class ImageSelectingOperator{
    constructor(manager){

    }

    stepStart(){
        return false;
    }

    stepMove(screenPoint, step){
        this._manager._container.highlightByPoint(screenPoint);
        return true;
    }

    stepDown(screenPoint, step){

    }
    stepUp(screenPoint, step){

    }
    stepOver(screenPoint, step){
        super.stepOver(screenPoint, step);
        super.afterStepOver();
    }


    get stepCount(){
        return 1;
    }

}

class ImageEditingOperator{
    constructor(manager){

    }

    stepStart(){
        let graph = this._manager._container.getSelected();
        if (!graph){
            return;
        }
        graph.enableEdit();
        return true;
    }

    stepMove(screenPoint, step){
       return false;
    }

    stepDown(screenPoint, step){

    }

    stepUp(screenPoint, step){

    }

    stepOver(screenPoint, step){
        super.stepOver(screenPoint, step);

    }

    get stepCount(){
        return 1;
    }
}

