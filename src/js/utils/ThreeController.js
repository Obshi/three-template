import Cursor from './Cursor';
import * as THREE from 'three';

window.THREE = THREE;

export default class ThreeGraphic{
        constructor(){
        this.currentScene;
        this.canvas = document.querySelector('#canvas');

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
        });
        
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.setPixelRatio(1);

        this.cursor = new Cursor();
        this.userAgent = navigator.userAgent;    
        this.isTouch = false;
    
        this.init();
        this.animate();
    }

    init(){ 
        if(this.userAgent.indexOf('iPhone') >= 0 || this.userAgent.indexOf('iPad') >= 0 || this.userAgent.indexOf('Android') >= 0){    
            window.addEventListener('touchstart',this.onTouchStart.bind(this));
            window.addEventListener('touchmove',this.onTouchMove.bind(this),{passive: false});
            window.addEventListener('touchend',this.onTouchEnd.bind(this));
        }else{
            window.addEventListener('mousedown',this.onTouchStart.bind(this));
            window.addEventListener('mousemove',this.onTouchMove.bind(this));
            window.addEventListener('mouseup',this.onTouchEnd.bind(this));
        }
        window.addEventListener('orientationchange',this.onOrientationDevice.bind(this));
        window.addEventListener('resize',this.onWindowResize.bind(this));
    }
    
    animate(){
        if(this.currentScene){
            this.currentScene.tick();
        }
        requestAnimationFrame(this.animate.bind(this));
    }

    setScene(scene){
        console.log('setScene');
        this.currentScene = scene;
    }

    onWindowResize(){
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.renderer.setSize(width,height);

        if(this.currentScene){
            this.currentScene.Resize(width,height);
        }
    }

    onOrientationDevice(){
        this.onWindowResize();
    }

    onTouchStart(event){
        this.isTouch = true;

        if(this.cursor){
            this.cursor.TouchStart(event);
        }

        if(this.currentScene){
            this.currentScene.onTouchStart(this.cursor);
        }
    }

    onTouchMove(event){
        event.preventDefault();
        if(!this.isTouch) return;
        if(this.cursor){
            this.cursor.TouchMove(event);
        }

        if(this.currentScene){
            this.currentScene.onTouchMove(this.cursor);
        }
    }

    onTouchEnd(event){
        this.isTouch = false;

        if(this.cursor){
            this.cursor.TouchEnd(event);
        }

        if(this.currentScene){
            this.currentScene.onTouchEnd(this.cursor);
        }
    }
}