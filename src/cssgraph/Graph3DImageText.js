import Konva from 'konva';
import {Graph} from "../graph/Graph";
import {GraphManager} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";


export class Graph3DImageText extends Graph{
    constructor(manager,graphOption) {
        super(manager,graphOption);

        let wrapper = this._graphWrapper;

        let imageObj = new Image();
        let self = this;

        imageObj.onload = function() {

            imageObj.width = graphOption.realWidth;
            imageObj.height = graphOption.realHeight;
            imageObj.style.position = 'absolute';
            imageObj.style.left = graphOption.x+'px';
            imageObj.style.top = graphOption.y+'px';
            imageObj.show=function(){
                this.style.display = '';
            };
            imageObj.hide=function(){
                this.style.display = 'none';
            };
            imageObj.moveTo=function(x,y){
                let left = this.style.left;
                let top = this.style.top;
                this.style.left =  x +'px';
                this.style.top =  y + 'px';
            };
            imageObj.moveLeftUp=function(distance){
                let left = this.style.left;
                let top = this.style.top;
                this.style.left =  parseInt(left.substring(0,left.indexOf('px'))) - distance +'px';
                this.style.top =  parseInt(top.substring(0,top.indexOf('px'))) - distance + 'px';
            };
            imageObj.resize=function(width, height){
                this.width = width;
                this.height = height;
            };

            let image = self._image = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: graphOption.realWidth,
                height: graphOption.realHeight,
                listening:true
            });
            wrapper.add(image);
            wrapper.image = image;


            self._panel._container.appendChild(imageObj);

            self._image = imageObj;

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
                self._bindEvent(image);
                self._bindImageEvent(imageObj);
            }

            wrapper.on("dragend",function () {
                let pos = wrapper.getAbsolutePosition();
                self._image.moveTo(pos.x, pos.y);
            })

        };
        imageObj.src = graphOption.src;

    }

    _bindImageEvent(imageObj){
        let self = this;
        imageObj.addEventListener('mouseover',function () {
            imageObj.hide();
            self.mouseOver();
        });

        imageObj.addEventListener('mouseout',function () {
            //self.mouseOut();
        });

        imageObj.addEventListener('click',function () {
            self.mouseClick();
        });

    }

    moveTo(screenPoint){
        if (!this._graphWrapper){
            return;
        }
        this._graphWrapper.setX(screenPoint.x);
        this._graphWrapper.setY(screenPoint.y);

        this._image.moveTo(screenPoint.x+1, screenPoint.y+1);
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
        this._image.hide();
        super.highlight();
    }

    unHighlight(){
        this._graphWrapper.decor.hide();
        this._image.show();
        super.unHighlight();
    }

    onDrawingOver(){
        this._image.moveLeftUp(1);

        this._bindEvent(this._graphWrapper.image);
        this._bindImageEvent(this._image);


        this.genAbsolutePosition();
        super.onDrawingOver();
    }

    onResize(){
        super.onResize();
        this._image.resize(this.realWidth, this.realHeight);
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

export class Graph3DImageTextManager extends GraphManager{
    constructor(panel,dataMappingConfig){
        super(panel,dataMappingConfig);
        this._drawingHandler = new Graph3DImageTextDrawingHandler(this);
        //this.create();
    }

    _createGraphObjByDesc(desc){
        return new Graph3DImageText(this,desc);
    }
}

class Graph3DImageTextDrawingHandler extends DrawingHandler{
    constructor(manager){
        super(manager);
    }

    stepStart(graphOption){
        let graph = new Graph3DImageText(this._manager, graphOption);
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



