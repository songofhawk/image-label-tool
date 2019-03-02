import Konva from "konva";
import {LangUtil} from "../util/LangUtil";

export class Graph {

    static get DEFAULT_COLOR() {return 'gray';}

    static get DEFAULT_STROKE_WITH(){return 1;}
    static get HIGHLIGHT_STROKE_WITH(){return 3;}

    static get DEFAULT_STROKE_COLOR(){return '#999999';}
    static get HIGHLIGHT_STROKE_COLOR(){return '#FFCC99';}
    static get DEFAULT_FILL_COLOR(){return '#CC9933';}
    static get AREA_FILL_COLOR(){return 'rgba(153, 204, 255, 15)';}
    static get SELECTED_STROKE_COLOR(){return '#FF6600';}



    constructor(manager,graphOption) {
        this._panel = manager._panel;
        this._manager = manager;
        this._layer = manager._layer;

        if (!graphOption){
            graphOption={};
        }
        this.code = graphOption.code ? graphOption.code : LangUtil.getGuid();

        let wrapper = this._graphWrapper = new Konva.Group({
            x:graphOption.x ? graphOption.x :0,
            y:graphOption.y?graphOption.y:0,
            width: graphOption.realWidth?graphOption.realWidth:50,
            height: graphOption.realHeight?graphOption.realHeight:50,
            draggable:true
        });

        let self = this;
        wrapper.on("dragmove", function () {
            self.onMove(wrapper.getAbsolutePosition());
        });

        wrapper.on("dragend", function () {
            self.onChange();
        });

        wrapper.on('dblclick',function () {
            let onDbClick = self._panel._onDbClick;
            if (onDbClick){
                onDbClick(self);
            }
        });


        if (graphOption.graphType){
            this.graphType = graphOption.graphType;
        }

        this._layer.add(this._graphWrapper);

    }

    create(callBack) {
        if (callBack) {
            callBack();
        }
    }

    moveTo(screenPoint){
        if (!this._graphWrapper){
            return;
        }
        this._graphWrapper.setX(screenPoint.x);
        this._graphWrapper.setY(screenPoint.y);
    }

    onBoradcast(msgName){
        if (msgName==='select'){
            this.deSelect();
        }
    }

    select() {
        this.selected = true;
        this._manager._container.broadcast('select', this.code);
        this._layer.draw();
        this._panel._toolbar.show(this);
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
        this._manager.onDelete(this);
        this._graphWrapper.remove();
        this._layer.draw();
    }

    highlight() {
        this._layer.draw();
    }

    unHighlight() {
        this._layer.draw();
    }

    mouseOver() {
        this.highlight();
    }

    mouseOut() {
        this.unHighlight();
    }

    mouseClick() {
        this.toggleSelect();
        this._layer.draw();
    }

    _bindEvent(graph) {
        let self = this;
        graph.on("mouseover", function () {
            //console.log('mouse over on graph: '+self.code);
            self.mouseOver();
        });

        graph.on("mouseout", function () {
            //console.log('mouse out from graph: '+self.code);
            self.mouseOut();
        });

        graph.on("click", function () {
            //console.log('mouse click on graph: '+self.code);
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

    setEditable(editable){
        if (editable){
            if (this.tr){
                this.tr.show();
                return;
            }
            let tr = new Konva.Transformer();
            this._layer.add(tr);

            let graph = this._graphWrapper;
            tr.attachTo(graph);
            this.tr = tr;

            let self = this;

            graph.on('transformstart', function () {
                console.log('transform start');
                graph.startRotation = graph.rotation();
            });

            graph.on('transformend', function () {
                console.log('transform end');
                let currentRotation = graph.rotation();
                if (currentRotation!==graph.startRotation){
                    console.log('rotate!');
                    self.onRotate(currentRotation);
                }else{
                    console.log('resize!');
                    self.onResize();
                }
            });

        }else{
            if (!this.tr){
                return;
            }
            this.tr.hide();
            // this.tr.destroy();
            // this.tr = null;
        }
        //this.editable = editable;

    }

    getPosition(){
        return {
            x:this._graphWrapper.x(),
            y:this._graphWrapper.y()
        }
    }

    getMappingData(){
        let mapping = this._manager._dataMapping;
        if (!mapping){
            return null;
        }
        return mapping.getDataItemByGraphCode(this.code);
    }

    // createBoundaryBox(){
    //     let wrapper = this._graphWrapper;;
    //     let box = new Konva.Rect({
    //         x: wrapper.x(),
    //         y: wrapper.y(),
    //         width: wrapper.width(),
    //         height: wrapper.height(),
    //         fill:'rgba(153, 204, 255, 15)',
    //         opacity: 0.5,
    //         stroke: Graph.DEFAULT_STROKE_COLOR,
    //         strokeWidth: Graph.DEFAULT_STROKE_WITH,
    //         draggable:true
    //     });
    //     //this._graphWrapper.add(box);
    //     //box.moveToBottom();
    //     let self = this;
    //     box.on("dragmove", function (e) {
    //         self._graphWrapper.setAbsolutePosition(box.getAbsolutePosition());
    //     });
    //
    //
    //     this._layer.add(box);
    // }

    onDrawingOver(){
        this._manager.onDrawingOver(this);
    }

    onMove(position){
        this._panel._toolbar.onMove(position, this);
    }

    onResize(){
        let wrapper = this._graphWrapper;
        this.realWidth = wrapper.getWidth()*wrapper.scaleX();
        this.realHeight = wrapper.getHeight()*wrapper.scaleY();
        this.onChange();
    }

    onRotate(rotationDegree){
        this.onChange();
    }

    onChange(){
        this._manager.onChange(this);
    }
}

