import {StyleUtil} from "../util/StyleUtil";

export class Toolbar {
    constructor(containerId, onSetProperty, onDelete) {
        let container = this._container = document.getElementById(containerId);
        if (!container) {
            throw 'can not find an element with id "' + containerId + '"!';
        }
        let bar = this._bar = document.createElement('div');
        bar.style.cssText = "\
                    position : absolute;\
                    left : 0;\
                    top: 0;\
                    display:none;\
                    ";
        bar.innerText = 'toolbar';
        bar.innerHTML = '<span  class="gpanel-toolbar-btn" id="gpanel-btn-config">配置</span>\
                        <span  class="gpanel-toolbar-btn" id="gpanel-btn-delete">删除</span>';
        container.appendChild(bar);

        StyleUtil.addNewStyle('\
                .gpanel-toolbar-btn{\
                    height:20px;\
                    line-height: 20px;\
                    width:40px;\
                    display: inline-block;\
                    background-repeat:no-repeat;\
                    background-size:auto;\
                    background-position:center left;\
                    background-color:rgba(93,169,219,0.3);\
                    padding:2px;\
                    padding-left:28px;\
                    font-size:11px;\
                    letter-spacing:2px;\
                    color:#5DA9DB;\
                    cursor:pointer;\
                    margin:0;\
                    border:1px solid #5DA9DB;\
                    border-radius:6px;\
                }\
                .gpanel-toolbar-btn:hover{\
                    //filter: invert(100%);\
                    background-color:#DDDDDD;\
                }\
                .gpanel-toolbar-btn:active{\
                    //filter: invert(100%);\
                    background-color:#99CCFF;\
                 }\
                #gpanel-btn-config{\
                    background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAABDRJREFUSIm1VetPXFUQ/825d1mUIj5aQqJNayIq7C5gaCjsFta2qUWrLGAL0WiMmvKy9RFTo6ZJ/wK1pLAX1KYmJk1KpBb5QjSGLs8+ILJ7F9ogUWlMjbEgRS0se+8ZP8CSu4WlfOl8mzm/+c2ZmTNngLsstB5QoRYuUJj3MXgjM0kh+Lo0ldODhxyTd/IV6wkgWL4M0C+CRDPIbAXwAIQsWo+vusLCTB5NPyqZnAtq5JXh2m1REKVKNoYH6/PGAMDt18eJKBUAivwj6YBoJ9DxgQZX++10cSU60NamXJ/K+gpAkBkzIFSTRAqIwwum+tHlw9lTAFDYEnSRKY5CIFVAphHEBwy8CUaov8F1PGE6Hn/oU7dfr4/pRf7wLveXV1IT4Yub9c2FLUFXTHdr+kmPFqpaFVzkH0l3N4fG81uH7k1EmLNnT0p+fo0t0fn2Zj3Lo+m61RZXoqLm0D4IeittwV7R9c7jEQDI9fruj4IOkGQphJhliSQiTpHgP0Z7OjqXybWftqpSOUM2+WpfTd54zB7XZNNI7rUlzX3cNZ0ZBQBHsW9zVIqyTWK6NdAbMKzYrJLKTKfXdzgc6DgBAMmmbT6q8Gy/hXw5g8KWoEuF8rBkfhqMyYEGlwaAHCXlb4/2nGtMVJKsnZVbFFNuD/ecawMAj18/BdB5EvgzytGrF+uf+k0AAJniE5Yyj5hnGGY7ALh2+HYpbH6XiBwArnSfnQTjweXbMn8G4k2S5V4V6nvLQLemn7/d2ekte30t8pg4Ssp25np9W622oqbRLR4t9A2wxiSTJF5PACb62zBEWpxNWTAA2IClJhMgSrTRzAWTeTYd18aqnAtMJBaPsGYgwfyoospuAPA2hTdEgAyS8gkWdMOSAbeZUh4jhb9Om0LZ4i0QyPZW7L1zBiIjGOiYAQBD8BEh5AkBegmQK/tXoo1murXg8tt2Fvtqn9xd/lAicmeJ77kcb4UTALzHulVPs37Ze+rX5LgMrcqcQdMEkVnQOH4fAIR7875QDFQ5dlR6rLjHSkvt2cXlr0mi2VDg2zAAGBkbHQwZ+SvlP2nFLk9yfutQWrK0dxKJI311jotWULbXl0cS+QwyFDBJATMyF+mYuNQ1a8W5W/RqmKgeaHC+CFp8JNZJvsWAZIMjlqC24dpt0bFAxwiAkdXKFMMAgJAsJeGfGHlcBgBQ8HnwEZuJs4A4aMC4qULtBPNVEuLkHM3/GCPyNoU3mEI+y4Q6MKnRqP0Fmz3iBfO75q1/n7/wvnsuxhn3F12qyf3d0xrez4Z5WiH1HiKqZoJNMjfakXQDwBAARBVzP5ieYVN5Q1E5S0maH2Cmn22m8PVbyFcEAID+Wue10sbx3TeVaEbf0s51a/qFFbUh/n5pJ08WNoUnBg85J1Yr4bqWvlsLHwRzHdPi0BGDiPjD/vqcH9bjf1flf6b8yCXVQvaOAAAAAElFTkSuQmCC");\
                }\
                #gpanel-btn-delete{\
                    background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAA4hJREFUSInVlW1oW3UUxp/zv1k635jDhrk6RTeRLblp1aK2eWVipEiXJtApFKF+mcxQREEYKDgEZR9FXROHMufrhzqyNmz7Is4lTTNaRNe8VS3MF6brWJlK1a1N7jl+cDfeJelWFASfb/fwnOf3P+de/hf4v4tWYvK8WdgkjPtISRtEiYic0SBT2Vj7qX8OECFfovi4EHYA+F4EOYB+BABFskEYHhBuFZG3cjH3hyCSFQM8b8y0iaoeUCTjNlavpof035r63p65AZXKswTx2gxtMD2kz10V4N1XvI0NHrEpiY3v7Phi2Qkt8sXznQbRXkPj7VNPdpxeFhB859vVSxcWPlGs7ZwYcpVWEm6qO35SV9CGf26lUPlRfcmsK6upcmFhFwT7reFOf+R+19bIpvpA/cFt65y+sNN8PhG7uyjA+zfOy3NWXw0Qeu/kdUTy8ImY+0At3BfuJ6ZFVLBFD0RDtfBApBtLWohgW+v0hfvNeu6svp8EvZ37Pr+2AfD7H1qvQDto/RqIaE1p4tB0KTt6WIgreiAa0gORbgY7itnRD0rZ5AQRrakd9yViKCTtvPqRxhWJ+AlyzDqeKPsR3R8ZAoBSeuy4wKgy2FHOpFKX1jfIpGWsPSzqUyUSaAAQ0x0X1eKs1VxOfzxXMThZg2RSn1nDlVKTM5nkZT12llkQNjYAhNCyce2pRdTp61zqJ4ic3uILP2DWOoJ9t0PBXkwnv6r349y5iwK0NK6IcP6HXze31vvN4JlsatKsTafHviPIrCsQ3lrv5/XrHASZbwCQIL/KUPdYzW5fpFMDrS9mx0YBwO3ve0IPRJ8G/nonSmC4/H0ea0/VqN4LIN8AUIqPskjUahaFDjPc6Y8MGiJTInzIhBTGUxki2nzZCCRRgI7+vRiLvInpYzZDGzDvFFegbxsxNFFoE5bj5WyqDADuYHQDCw8AMgdW50vZ0cMA0JX48hYltndzMfdD9asDAPgSBa83kT9ord0V7G29s6enpYmdurr6r7EWPMOFpDc+3dU0vGZK5F/0xvMvX9HURN5E/hVPvPB8wymaQwp7RNhhZ+2Z5a5qU8G9xeurmrwOyJmJp9pfWBEAAHzD+YihaBeBRgwbfzS5o/1sXfDNFRsPiNB2EtqTi+mpZjlX/GX2vPZNy4J98TEBogTcBEjlUtsqYcwDkvzFoUas1/O/025R2C3q6sb/UH8CSYqA2rCK24kAAAAASUVORK5CYII=");\
                }\
        ');

        let configBtn = bar.querySelector("#gpanel-btn-config");
        configBtn.addEventListener("click",() => {
            if (onSetProperty){
                onSetProperty(this._graph, this._graph.getMappingData());
            }
        });

        let deleteBtn = bar.querySelector("#gpanel-btn-delete");
        deleteBtn.addEventListener("click",() => {
            if (this._graph){
                this._graph.delete();
            }
            this.hide();
            if (onDelete){
                onDelete(this._graph, this._graph.getMappingData());
            }
        });
    }

    show(graph){
        if (!graph){
            throw 'a graph object is mandatory to show toolbar!';
        }
        this._graph = graph;
        let pos = graph.getPosition();
        let bar = this._bar;
        let style = bar.style;
        style.display = 'block';
        style.left = pos.x - 20+'px';
        style.top = pos.y - 30 - bar.offsetHeight + 'px';
    }

    hide(){
        this._bar.style.display = 'none';
    }

    onMove({x,y}, graph){
        if (graph !== this._graph){
            return;
        }
        let bar = this._bar;
        let style = bar.style;
        style.left = x - 20+'px';
        style.top = y - 30 - bar.offsetHeight + 'px';
    }
}
