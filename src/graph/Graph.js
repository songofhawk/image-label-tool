import {StringUtil} from "../util/StringUtil";
import Konva from "konva";

export class Graph {

    static get DEFAULT_COLOR() {return 'gray';}

    static get DEFAULT_STROKE_WITH(){return 1;}
    static get DEFAULT_STROKE_COLOR(){return '#999999';}
    static get HIGHLIGHT_STROKE_WITH(){return 3;}
    static get HIGHLIGHT_STROKE_COLOR(){return '#FFCC99';}
    static get DEFAULT_FILL_COLOR(){return '#CC9933';}

    constructor(manager) {
        this._manager = manager;
        this._layer = manager._layer;
        this.code = StringUtil.getGuid();
        // this._graphWrapper = null;
        this._graphWrapper = new Konva.Group({
            x:0,
            y:0,
            draggable:true
        });
        this._layer.add(this._graphWrapper);
    }

    create(callBack) {
        if (callBack) {
            callBack();
        }
    }

    moveTo() {

    }

    onBoradcast(msgName, sourceCode){
        if (msgName==='select'){
            this.deSelect();
        }
    }

    select() {
        this.selected = true;
        this._manager._container.broadcast('select', this.code);
    }

    deSelect() {
        this.selected = false;
    }

    toggleSelect() {
        if (this.selected) {
            this.deSelect();
        } else {
            this.select();
        }
    }

    delete() {

    }

    isPointOn(point) {

    }

    highlight() {
    }

    unHighlight() {

    }

    mouseOver() {
        this.highlight();
        this._layer.draw();
    }

    mouseOut() {
        this.unHighlight();
        this._layer.draw();
    }

    mouseClick() {
        this.toggleSelect();
        this._layer.draw();
    }

    _bindEvent(graph) {
        let self = this;
        graph.on("mouseover", function (e) {
            //console.log('mouse over on image: '+self.code);
            self.mouseOver();
        });

        graph.on("mouseout", function (e) {
            //console.log('mouse out from image: '+self.code);
            self.mouseOut();
        });

        graph.on("click", function (e) {
            //console.log('mouse click on image: '+self.code);
            self.mouseClick();
        });
    }


    /**
     * 获取图形内所有形状的外界矩形, 需要各子类重写
     * @return {{x: number, y: number, width: number, height: number}}
     */
    getBoundary(){
        throw 'Graph的子类没有重写这个方法!';
        // return {
        //     x:0,
        //     y:0,
        //     width:0,
        //     height:0
        // }
    }

    createBoundaryBox(){
        let wrapper = this._graphWrapper;;
        let box = new Konva.Rect({
            x: wrapper.x(),
            y: wrapper.y(),
            width: wrapper.width(),
            height: wrapper.height(),
            fill:'rgba(153, 204, 255, 15)',
            opacity: 0.5,
            stroke: Graph.DEFAULT_STROKE_COLOR,
            strokeWidth: Graph.DEFAULT_STROKE_WITH,
            draggable:true
        });
        //this._graphWrapper.add(box);
        //box.moveToBottom();
        let self = this;
        box.on("dragmove", function (e) {
            self._graphWrapper.setAbsolutePosition(box.getAbsolutePosition());
        });


        this._layer.add(box);
    }
}

