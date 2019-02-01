export class Toolbar {
    constructor(containerId){
        let container = this._container = document.getElementById(containerId);
        if (!container){
            throw 'can not find an element with id "'+containerId+'"!';
        }
        let bar = this._bar = document.createElement('div');
        bar.style.cssText = "\
                    position : absolute;\
                    left : 0;\
                    top: 0;\
                    ";
        bar.innerText = 'toolbar';
        container.appendChild(bar);
    }
}