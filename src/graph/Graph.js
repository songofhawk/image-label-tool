import {StringUtil} from "../util/StringUtil";
import Konva from "konva";

export class Graph {
    static get DEFAULT_STROKE_WITH(){return 1;}
    static get DEFAULT_STROKE_COLOR(){return '#999999';}
    static get HIGHLIGHT_STROKE_WITH(){return 3;}
    static get HIGHLIGHT_STROKE_COLOR(){return '#FFCC99';}
    static get DEFAULT_FILL_COLOR(){return '#CC9933';}

    constructor(manager) {
        this._manager = manager;
        this._layer = manager._layer;
        this.code = StringUtil.getGuid();
        this._graphWrapper = new Konva.Group({
            x:0,
            y:0
        });
    }

    static get DEFAULT_COLOR() {
        return 'gray';
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

}

