import MainScene from './/MainScene';
import ThreeController from './utils/ThreeController';

window.addEventListener('load',()=>{
    var tc = new ThreeController();        
    tc.setScene(new MainScene(tc.renderer));
})