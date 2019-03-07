import {Graph3D} from "./Graph3D";

export class Graph3DText extends Graph3D{
    constructor(manager,graphOption) {
        super(manager,graphOption);

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

}



