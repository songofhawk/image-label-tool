import Konva from 'konva';
import {Graph} from "./Graph";
import {GraphManager} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";


export class GraphText extends Graph{
    constructor(manager,graphOption) {
        super(manager,graphOption);

        let wrapper = this._graphWrapper;

        let self = this;

        let text = this._text = new Konva.Text({
            x: 0,
            y: 0,
            width: graphOption.realWidth,
            height: graphOption.realHeight,
            text: graphOption.text,
            fontSize:graphOption.realHeight?graphOption.realHeight - 2:12,
            fontFamily:graphOption.fontFamily?graphOption.fontFamily:'Calibri',
            fontStyle:graphOption.fontStyle?graphOption.fontStyle:'normal',
            fill:graphOption.color?graphOption.color:'FloralWhite',
            listening:true
        });
        wrapper.add(text);
        wrapper.text = text;

        let decor = new Konva.Rect({
            x: - 1,
            y: - 1,
            width: graphOption.realWidth+1,
            height: graphOption.realHeight+1,
            fillEnabled: false,
            stroke: 'LightGray',
            strokeWidth: 3
        });
        decor.hide();
        wrapper.decor = decor;
        wrapper.add(decor);

        if (graphOption.bindEvent){
            self._bindEvent(text);
        }

    }

    select(){
        this.setEditable(true);
        super.select();
    }

    /**
     * 取消选择
     */
    deSelect(){
        this.setEditable(false);
        super.deSelect();
    }

    delete(){
        this.setEditable(false);
        super.delete();
    }

    highlight(){
        this._graphWrapper.decor.show();
        super.highlight();
    }

    unHighlight(){
        this._graphWrapper.decor.hide();
        super.unHighlight();
    }

    onDrawingOver(){
        this._bindEvent(this._text);

        this.genAbsolutePosition();
        super.onDrawingOver();
    }

    onChange(){
        this.genAbsolutePosition();
        super.onChange();
    }

    genAbsolutePosition(){
        let wrapper = this._graphWrapper;
        let pos = wrapper.getAbsolutePosition();
        this.x = pos.x;
        this.y = pos.y;
        this.realWidth = wrapper.width()*wrapper.scaleX();
        this.realHeight = wrapper.height()*wrapper.scaleY();
    }

    get text(){
        return this._text.text();
    }

    setFontFamily(fontName){
        this._graphWrapper.text.fontFamily(fontName);
        this._layer.draw();
    }

    setFontSize(fontSize){
        this._graphWrapper.text.fontSize(fontSize);
        this._layer.draw();
    }

    setFontStyle(fontStyle){
        this._graphWrapper.text.fontStyle(fontStyle);
        this._layer.draw();
    }

    setColor(color){
        this._graphWrapper.text.fill(color);
        this._layer.draw();
    }
}

export class GraphTextManager extends GraphManager{
    constructor(panel,dataMappingConfig){
        super(panel,dataMappingConfig);
        this._drawingHandler = new TextDrawingHandler(this);
        //this.create();
    }

    _createGraphObjByDesc(desc){
        return new GraphText(this,desc);
    }
}

class TextDrawingHandler extends DrawingHandler{
    constructor(manager){
        super(manager);
    }

    stepStart(graphOption){
        let graph = new GraphText(this._manager, graphOption);
        this._stage.container().style.cursor = 'crosshair';
        super.stepStart(graph);
    }

    stepMove(screenPoint, step){
        this._graph.moveTo(screenPoint);
        super.stepMove();
    }

    stepDown(screenPoint, step){
        super.stepDown();
    }

    stepUp(screenPoint, step){
        super.stepUp();
    }

    stepOver(screenPoint, step){
        this._stage.container().style.cursor = 'default';
        this._graph.onDrawingOver();
        super.stepOver(screenPoint, step);
    }


    get stepCount(){
        return 1;
    }
}



