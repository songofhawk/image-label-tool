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
            text: graphOption.text,
            fontSize:graphOption.fontSize?graphOption.fontSize:12,
            fontFamily:graphOption.fontFamily?graphOption.fontFamily:'Calibri',
            fill:graphOption.color?graphOption.color:'black',
            listening:true
        });
        wrapper.add(text);
        wrapper.text = text;

        let decor = new Konva.Rect({
            x: - 1,
            y: - 1,
            width: graphOption.width+1,
            height: graphOption.height+1,
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

    setEditable(editable){
        if (editable){
            if (this.tr){
                this.tr.show();
                return;
            }
            let tr = new Konva.Transformer();
            this._layer.add(tr);

            let group = this._graphWrapper;
            tr.attachTo(group);
            this.tr = tr;
        }else{
            if (!this.tr){
                return;
            }
            this.tr.hide();
            // this.tr.destroy();
            // this.tr = null;
        }
        //this.ediable = editable;

    }

    onDrawingOver(){
        this._bindEvent(this._image);

        this.genAbsolutePosition();
        super.onDrawingOver();
    }

    onChange(){
        this.genAbsolutePosition();
        super.onChange();
    }

    genAbsolutePosition(){
        let pos = this._graphWrapper.getAbsolutePosition();
        this.x = pos.x;
        this.y = pos.y;
    }

}

export class GraphTextManager extends GraphManager{
    constructor(panel,dataMappingConfig){
        super(panel,dataMappingConfig);
        this._drawingHandler = new ImageDrawingHandler(this);
        //this.create();
    }

    create(data){
        if (!data){
            data = this._dataMapping.data;
        }
        data.forEach((dataOne)=>{
            let desc = this._dataMapping.createGraph(dataOne);
            desc.bindEvent=true;
            let graph = new GraphText(this,desc);
            super.onCreateOne(graph);
        });
        super.create(data);
    }
}

class ImageDrawingHandler extends DrawingHandler{
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



