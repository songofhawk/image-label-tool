import {StringUtil} from "../util/StringUtil";

export class Graph {
    constructor(manager) {
        this._manager = manager;
        this._layer = manager._layer;
        this.code = StringUtil.getGuid();
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

    moveOn() {

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
}

