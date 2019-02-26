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
            imageObj.rotateX=function(x){
                imageObj._setTransformOne(x,'X');
                imageObj._composeStyleTransform();
            };
            imageObj.rotateY=function(y){
                imageObj._setTransformOne(y,'Y');
                imageObj._composeStyleTransform();
            };
            imageObj.rotateZ=function(z){
                imageObj._setTransformOne(z,'Z');
                imageObj._composeStyleTransform();
            };
            imageObj.rotateXY=function(x,y){
                imageObj._setTransformOne(x,'X');
                imageObj._setTransformOne(y,'Y');
                imageObj._composeStyleTransform();
            };
            imageObj.rotateXYZ=function(x,y,z){
                imageObj._setTransformOne(x,'X');
                imageObj._setTransformOne(y,'Y');
                imageObj._setTransformOne(z,'Z');
                imageObj._composeStyleTransform();
            };
            imageObj._setTransformOne = function(value, name){
                if (typeof(value) === "undefined" || value===null){
                    return false;
                }
                if (!imageObj.transform){
                    imageObj.transform={}
                }
                imageObj.transform['rotate'+name] = value;
                return true;
            };
            imageObj._composeStyleTransform = function(){
                let trans = imageObj.transform;
                let x = typeof(trans.rotateX)==='undefined' ? '' : ('rotateX('+trans.rotateX+'deg) ');
                let y = typeof(trans.rotateY)==='undefined' ? '' : ('rotateY('+trans.rotateY+'deg) ');
                let z = typeof(trans.rotateZ)==='undefined' ? '' : ('rotateZ('+trans.rotateZ+'deg) ');
                this.style.transform = x+y+z;
            };


            imageObj.hide();
            let container = self._panel._container;
            container.appendChild(imageObj);
            self._image = imageObj;

            let rect = new Konva.Rect({
                x: 0,
                y: 0,
                fillEnabled:true,
                fill:Graph.DEFAULT_FILL_COLOR,
                width: graphOption.realWidth,
                height: graphOption.realHeight,
                listening:true
            });
            wrapper.add(rect);

            if (graphOption.bindEvent){
                self._bindEvent(wrapper);
                self._bindImageEvent(imageObj);
            }
            wrapper.on("dragstart",function () {
                wrapper.listening(false);
            });

            wrapper.on("dragend",function () {
                let pos = wrapper.getAbsolutePosition();
                self._image.moveTo(pos.x, pos.y);
                wrapper.listening(true);
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

        // imageObj.addEventListener('mouseout',function () {
        //     self.mouseOut();
        // });

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
        this._image.hide();
        //this._graphWrapper.image.show();
        super.highlight();
    }

    unHighlight(){
        //this._graphWrapper.decor.hide();
        this._image.show();
        //this._graphWrapper.image.hide();
        super.unHighlight();
    }

    onDrawingOver(){
        //this._image.moveLeftUp(1);
        this._image.show();

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
        this._image.rotateZ(rotationDegree);
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

    setEditable(editable){
        super.setEditable(editable);

        if (editable) {
            let rotate3dGroup = this._rotate3dGroup;
            let wrapper = this._graphWrapper;
            if (rotate3dGroup) {
                // rotate3dGroup.x(wrapper.x());
                // rotate3dGroup.y(wrapper.y()+wrapper.height()*wrapper.scaleY()+45);
                rotate3dGroup.show();
                return;
            }

            rotate3dGroup = new Konva.Group({
                x: wrapper.x(),
                y: wrapper.y()+wrapper.height()*wrapper.scaleY()+45,
                width: 90,
                height: 90
            });
            this._layer.add(rotate3dGroup);
            let offsetX = rotate3dGroup.width()/2, offsetY = rotate3dGroup.height()/2;
            rotate3dGroup.offsetX(offsetX);
            rotate3dGroup.offsetY(offsetY);
            this._rotate3dGroup  = rotate3dGroup;

            let rotate3dArea = new Konva.Rect({
                x: 0,
                y: 0,
                width: rotate3dGroup.width(),
                height: rotate3dGroup.height(),
                fillEnabled: true,
                fill: Graph.AREA_FILL_COLOR,
                opacity: 0.1,
                stroke: Graph.DEFAULT_STROKE_COLOR,
                strokeWidth: 1
            });

            rotate3dGroup.add(rotate3dArea);
            this._rotate3dArea = rotate3dArea;

            let rotate3dHandler = new Konva.Rect({
                x: 0,
                y: 0,
                width: 10,
                height: 10,
                draggable:true,
                fillEnabled: true,
                fill: Graph.DEFAULT_STROKE_COLOR,
                stroke: Graph.DEFAULT_STROKE_COLOR,
                strokeWidth: 1
            });
            rotate3dHandler.offsetX(-offsetX+5);
            rotate3dHandler.offsetY(-offsetY+5);

            rotate3dGroup.add(rotate3dHandler);
            this._rotate3dHandler = rotate3dHandler;

            let self = this;
            rotate3dHandler.on('dragmove',()=>{
                //console.log('x:'+rotate3dHandler.x()+', y:'+rotate3dHandler.y());
                self._image.rotateXY(rotate3dHandler.y(),rotate3dHandler.x());
            })

        }else{
            let rotate3dGroup = this._rotate3dGroup;
            if (rotate3dGroup) {
                rotate3dGroup.hide();
            }
        }
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



