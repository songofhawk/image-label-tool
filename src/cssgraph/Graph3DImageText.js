import Konva from 'konva';
import {Graph} from "../graph/Graph";
import {GraphManager} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";


export class Graph3DImageText extends Graph{
    constructor(manager,graphOption) {
        super(manager,graphOption);

        let wrapper = this._graphWrapper;

        let offsetX = wrapper.width()/2, offsetY = wrapper.height()/2;
        wrapper.offsetX(offsetX);
        wrapper.offsetY(offsetY);

        let imageObj = new Image();
        let self = this;

        imageObj.onload = function() {

            imageObj.width = graphOption.realWidth;
            imageObj.height = graphOption.realHeight;
            imageObj.style.position = 'absolute';
            imageObj.style.left = graphOption.x+'px';
            imageObj.style.top = graphOption.y+'px';
            imageObj.style.marginLeft = - offsetX + 'px';
            imageObj.style.marginTop = - offsetY  + 'px';

            imageObj.show=function(){
                this.style.display = '';
            };
            imageObj.hide=function(){
                this.style.display = 'none';
            };
            imageObj.moveTo=function(x,y){
                let left = this.style.left;
                let top = this.style.top;
                this.style.left =  x  +'px';
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
                this.style.marginLeft = - width/2 + 'px';
                this.style.marginTop = -height/2  + 'px';
            };
            imageObj.rotateZTo=function(rotationDegree){
                this.style.transform='rotateZ('+rotationDegree+'deg)';
            };
            imageObj.hide();

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

            let container = self._panel._container;
            container.appendChild(imageObj);

            self._image = imageObj;

            let decor = new Konva.Rect({
                x: offsetX - (100/2),
                y: offsetY * 2 + 30,
                width: 100,
                height: 100,
                fillEnabled: false,
                stroke: 'LightGray',
                strokeWidth: 1
            });
            // decor.hide();
            wrapper.decor = decor;
            wrapper.add(decor);

            let rotate3dArea = new Konva.Rect({
                x: - 1,
                y: - 1,
                width: graphOption.realWidth+1,
                height: graphOption.realHeight+1,
                fillEnabled: false,
                stroke: 'LightGray',
                strokeWidth: 3
            });
            // decor.hide();
            wrapper.decor = decor;
            wrapper.add(decor);


            if (graphOption.bindEvent){
                self._bindEvent(wrapper);
                self._bindImageEvent(imageObj);
            }
            wrapper.on("dragstart",function () {
                wrapper.listening(false);
            })

            wrapper.on("dragend",function () {
                let pos = wrapper.getAbsolutePosition();
                self._image.moveTo(pos.x, pos.y);
                wrapper.listening(true);
            })

        };
        imageObj.src = graphOption.src;

    }

    _bindImageEvent(imageObj){
        // let self = this;
        // imageObj.addEventListener('mouseover',function () {
        //     imageObj.hide();
        //     self.mouseOver();
        // });
        //
        // imageObj.addEventListener('mouseout',function () {
        //     self.mouseOut();
        // });
        //
        // imageObj.addEventListener('click',function () {
        //     self.mouseClick();
        // });

    }

    moveTo(screenPoint){
        if (!this._graphWrapper){
            return;
        }
        this._graphWrapper.setX(screenPoint.x);
        this._graphWrapper.setY(screenPoint.y);

        this._image.moveTo(screenPoint.x, screenPoint.y);
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
        //this._graphWrapper.decor.show();
        //this._image.hide();
        //this._graphWrapper.image.show();
        super.highlight();
    }

    unHighlight(){
        //this._graphWrapper.decor.hide();
        //this._image.show();
        //this._graphWrapper.image.hide();
        super.unHighlight();
    }

    onDrawingOver(){
        this._image.moveLeftUp(1);

        this._bindEvent(this._graphWrapper);
        this._bindImageEvent(this._image);


        this.genAbsolutePosition();
        super.onDrawingOver();
    }

    onResize(){
        super.onResize();
        this._graphWrapper.offsetX(this._graphWrapper.width()/2);
        this._graphWrapper.offsetY(this._graphWrapper.height()/2);

        this._image.moveTo(this.x, this.y);

        this._image.resize(this.realWidth, this.realHeight);
    }

    onRotate(rotationDegree){
        this._image.rotateZTo(rotationDegree);
        super.onRotate();
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
        let container = this._panel._container;
        container.style.transformStyle = 'preserve-3d';
        container.style.perspective = '600px';

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
        this._graph.moveTo({x:screenPoint.x+1,y:screenPoint.y+1});
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



