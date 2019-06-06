import * as ORE from 'ore-three-ts';
import MainScene from './MainScene';

class APP{
    constructor(){
        this.canvas = document.querySelector("#canvas");
        
        this.controller = new ORE.Controller({
            canvas: this.canvas,
        })

        this.oreScene = new MainScene(this.controller.renderer);
        this.controller.setScene(this.oreScene);
    }
}
window.addEventListener('load',()=>{
    let app = new APP();
})