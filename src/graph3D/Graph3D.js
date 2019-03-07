import Konva from 'konva';
import {Graph} from "../graph/Graph";
import {GraphManager} from "../manager/GraphManager";
import {DrawingHandler} from "../manager/DrawingHandler";


export class Graph3D extends Graph{
    constructor(manager,graphOption) {
        super(manager,graphOption);
        this._graphOption = graphOption;

        let wrapper = this._graphWrapper;
        let offsetX = wrapper.width()/2, offsetY = wrapper.height()/2;
        wrapper.offsetX(offsetX);
        wrapper.offsetY(offsetY);

        let self = this;

        let imageElement = new Image();
        imageElement.onload = function() {
            self._initLocation(imageElement);
            self._attachMethodsToElement(imageElement);
            self._addElementToContainer(imageElement);
            if (graphOption.bindEvent){
                self._bindImageEvent(imageElement);
            }
            self._createRect();
            if (graphOption.bindEvent){
                self._bindWrapperEvent(wrapper, self);
            }
        };
        imageElement.src = graphOption.src;

    }

    _initLocation(element) {
        const  graphOption = this._graphOption;
        element.width = graphOption.realWidth;
        element.height = graphOption.realHeight;
        element.style.position = 'absolute';
        element.style.left = graphOption.x + 'px';
        element.style.top = graphOption.y + 'px';
        element.style.marginLeft = -offsetX + 'px';
        element.style.marginTop = -offsetY + 'px';
    }

    _attachMethodsToElement(element) {
        element.show = function () {
            this.style.display = '';
        };
        element.hide = function () {
            this.style.display = 'none';
        };
        element.moveTo = function (x, y) {
            let left = this.style.left;
            let top = this.style.top;
            this.style.left = x + 'px';
            this.style.top = y + 'px';
        };
        element.moveLeftUp = function (distance) {
            let left = this.style.left;
            let top = this.style.top;
            this.style.left = parseInt(left.substring(0, left.indexOf('px'))) - distance + 'px';
            this.style.top = parseInt(top.substring(0, top.indexOf('px'))) - distance + 'px';
        };
        element.resize = function (width, height) {
            this.width = width;
            this.height = height;
            this.style.marginLeft = -width / 2 + 'px';
            this.style.marginTop = -height / 2 + 'px';
        };
        element.rotateX = function (x) {
            imageElement._setTransformOne(x, 'X');
            imageElement._composeStyleTransform();
        };
        element.rotateY = function (y) {
            imageElement._setTransformOne(y, 'Y');
            imageElement._composeStyleTransform();
        };
        element.rotateZ = function (z) {
            imageElement._setTransformOne(z, 'Z');
            imageElement._composeStyleTransform();
        };
        element.rotateXY = function (x, y) {
            imageElement._setTransformOne(x, 'X');
            imageElement._setTransformOne(y, 'Y');
            imageElement._composeStyleTransform();
        };
        element.rotateXYZ = function (x, y, z) {
            imageElement._setTransformOne(x, 'X');
            imageElement._setTransformOne(y, 'Y');
            imageElement._setTransformOne(z, 'Z');
            imageElement._composeStyleTransform();
        };
        element._setTransformOne = function (value, name) {
            if (typeof(value) === "undefined" || value === null) {
                return false;
            }
            if (!imageElement.transform) {
                imageElement.transform = {}
            }
            imageElement.transform['rotate' + name] = value;
            return true;
        };
        element._composeStyleTransform = function () {
            let trans = imageElement.transform;
            let x = typeof(trans.rotateX) === 'undefined' ? '' : ('rotateX(' + trans.rotateX + 'deg) ');
            let y = typeof(trans.rotateY) === 'undefined' ? '' : ('rotateY(' + trans.rotateY + 'deg) ');
            let z = typeof(trans.rotateZ) === 'undefined' ? '' : ('rotateZ(' + trans.rotateZ + 'deg) ');
            this.style.transform = x + y + z;
        };

    }

     _addElementToContainer(element) {
        element.hide();
        let container = self._panel._container;
        container.appendChild(element);
        self._element = element;
    }


    _createRect() {
        let rect = new Konva.Rect({
            x: 0,
            y: 0,
            fillEnabled: true,
            fill: Graph.DEFAULT_FILL_COLOR,
            width: graphOption.realWidth,
            height: graphOption.realHeight,
            listening: true
        });
        wrapper.add(rect);

        if (graphOption.bindEvent) {
            self._bindEvent(wrapper);
        }
    }

    _bindWrapperEvent(wrapper, self) {
        wrapper.on("dragstart", function () {
            wrapper.listening(false);
        });

        wrapper.on("dragend", function () {
            let pos = wrapper.getAbsolutePosition();
            self._element.moveTo(pos.x, pos.y);
            wrapper.listening(true);
        })
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

        this._element.moveTo(screenPoint.x, screenPoint.y);
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
        this._element.hide();
        //this._graphWrapper.image.show();
        super.highlight();
    }

    unHighlight(){
        //this._graphWrapper.decor.hide();
        this._element.show();
        //this._graphWrapper.image.hide();
        super.unHighlight();
    }

    onDrawingOver(){
        //this._element.moveLeftUp(1);
        this._element.show();

        this._bindEvent(this._graphWrapper);
        this._bindImageEvent(this._element);


        this.genAbsolutePosition();
        super.onDrawingOver();
    }

    onResize(){
        super.onResize();
        this._graphWrapper.offsetX(this._graphWrapper.width()/2);
        this._graphWrapper.offsetY(this._graphWrapper.height()/2);

        this._element.moveTo(this.x, this.y);
        this._element.resize(this.realWidth, this.realHeight);

    }

    onRotate(rotationDegree){
        this._element.rotateZ(rotationDegree);
        super.onRotate();
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

            let self = this;
            rotate3dHandler.on('dragmove',()=>{
                //console.log('x:'+rotate3dHandler.x()+', y:'+rotate3dHandler.y());
                self._element.rotateXY(rotate3dHandler.y(),rotate3dHandler.x());
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
        let self = this;
        let container = this._panel._container;
        container.style.transformStyle = 'preserve-3d';

        container.style.perspective = container.clientWidth+'px';
        let centerX =container.clientWidth/2;
        let centerY =container.clientHeight/2;
        container.style.perspectiveOrigin = centerX+'px'+' '+ centerY+'px';

        let perspectiveHandler = this._createEyeIcon(centerX, centerY, 0.15, true, 'LightGray');
        perspectiveHandler.on('dragmove',function () {
            container.style.perspectiveOrigin = perspectiveHandler.x()+'px'+' '+ perspectiveHandler.y()+'px';
        });
        this._layer.add(perspectiveHandler);

        let eyeSwitch = this._createEyeIcon(container.clientWidth*0.9,
            container.clientWidth*0.1,
            0.25, true, 'black');
        eyeSwitch.on('click',function () {
            let switchOn = eyeSwitch.toggleSwitch();
            if (switchOn){
                perspectiveHandler.show();
            }else {
                perspectiveHandler.hide();
            }
            self._layer.draw();
        });
        this._layer.add(eyeSwitch);



        this._drawingHandler = new Graph3DHandler(this);
        //this.create();
    }

    _createEyeIcon(x,y,scale,draggable, color){
        const baseWidth = 140*scale, baseHeight = 90*scale;
        let group = new Konva.Group({
            x: x,
            y: y,
            width: baseWidth,
            height: baseHeight,
            draggable:draggable
        });
        this._layer.add(group);

        group.offsetX(baseWidth/2);
        group.offsetY(baseHeight/2);

        let originBackground = new Konva.Rect({
            x: 0,
            y: 0,
            width:group.width(),
            height:group.height(),
            fillEnabled:true,
            fill:Graph.DEFAULT_FILL_COLOR,
            opacity:0.2
        });
        group.add(originBackground);
        let containerStyle = this._stage.container().style;
        group.on('mouseover',function () {
            containerStyle.cursor = 'pointer';
        });
        group.on('mouseout',function () {
            containerStyle.cursor = 'default';
        });


        //这两个图标不一样大, 所以开关切换(toggleSwitch)的时候, 还得调整位置和缩放
        const onPathData = 'M89.668,38.786c0-10.773-8.731-19.512-19.51-19.512S50.646,28.01,50.646,38.786c0,10.774,8.732,19.511,19.512,19.511   C80.934,58.297,89.668,49.561,89.668,38.786 M128.352,38.727c-13.315,17.599-34.426,28.972-58.193,28.972   c-23.77,0-44.879-11.373-58.194-28.972C25.279,21.129,46.389,9.756,70.158,9.756C93.927,9.756,115.036,21.129,128.352,38.727    M140.314,38.76C125.666,15.478,99.725,0,70.158,0S14.648,15.478,0,38.76c14.648,23.312,40.591,38.81,70.158,38.81   S125.666,62.072,140.314,38.76';
        const offPathData = 'M8.10869891,20.8913011 C4.61720816,18.8301147 3,16 3,16 C3,16 7,9 16,9 C17.3045107,9 18.5039752,9.14706466 19.6014388,9.39856122 L18.7519017,10.2480983 C17.8971484,10.0900546 16.9800929,10 16,10 C8,10 4.19995117,16 4.19995117,16 C4.19995117,16 5.71472808,18.3917225 8.84492713,20.1550729 L8.10869891,20.8913011 L8.10869891,20.8913011 L8.10869891,20.8913011 Z M12.398561,22.601439 C13.4960246,22.8529356 14.6954892,23.0000001 16,23 C25,22.999999 29,16 29,16 C29,16 27.3827918,13.1698856 23.8913008,11.1086992 L23.1550727,11.8449273 C26.2852719,13.6082776 27.8000488,16 27.8000488,16 C27.8000488,16 24,21.999999 16,22 C15.019907,22.0000001 14.1028515,21.9099455 13.2480981,21.7519019 L12.398561,22.601439 L12.398561,22.601439 L12.398561,22.601439 Z M19.8986531,15.1013469 C19.9649658,15.3902115 20,15.6910144 20,16 C20,18.2091391 18.2091391,20 16,20 C15.6910144,20 15.3902115,19.9649658 15.1013469,19.8986531 L16,19 C16.7677669,19.0000001 17.5355339,18.7071068 18.1213203,18.1213203 C18.7071068,17.5355339 19.0000001,16.7677669 19,16 L19.8986531,15.1013469 L19.8986531,15.1013469 L19.8986531,15.1013469 Z M16.8986531,12.1013469 C16.6097885,12.0350342 16.3089856,12 16,12 C13.7908609,12 12,13.7908609 12,16 C12,16.3089856 12.0350342,16.6097885 12.1013469,16.8986531 L13,16 C12.9999999,15.2322331 13.2928932,14.4644661 13.8786797,13.8786797 C14.4644661,13.2928932 15.2322331,12.9999999 16,13 L16.8986531,12.1013469 L16.8986531,12.1013469 L16.8986531,12.1013469 Z M24,7 L7,24 L8,25 L25,8 L24,7 L24,7 Z';
        let icon = new Konva.Path({
            x: 0,
            y: 0,
            data: onPathData,
            fill: color,
            scale: {
                x: scale,
                y: scale
            }
        });
        group.add(icon);
        let switchOn = true;
        group.toggleSwitch=function () {
            if (switchOn){
                icon.data(offPathData);
                icon.scaleX(icon.scaleX()*5);
                icon.scaleY(icon.scaleY()*5);
                icon.offsetY(8);
                icon.offsetX(1);
                switchOn=false;
            }else {
                icon.data(onPathData);
                icon.scaleX(icon.scaleX()/5);
                icon.scaleY(icon.scaleY()/5);
                icon.offsetY(-8);
                icon.offsetX(-1);
                switchOn=true;
            }
            return switchOn;
        };
        return group;
    }

    _createGraphObjByDesc(desc){
        let textTypes = this.textTypes ? this.textTypes: ['TEXT'];
        if (textTypes.indexOf(desc.graphType)>=0){
            return new Graph3DText(this, desc);
        }else{
            return new Graph3DImage(this, desc);
        }
    }
}

class Graph3DHandler extends DrawingHandler{
    constructor(manager){
        super(manager);
    }

    stepStart(graphOption){
        if (graphOption.graphType.is);
        let graph = this._manager._createGraphObjByDesc(graphOption);
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



