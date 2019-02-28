export default class BaseScene {
    constructor(renderer) {
        this.renderer = renderer;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
        this.time = 0;
    }

    tick(){
        this.time += this.clock.getDelta();
        this.animate();
    }

    animate(){
    }

    onTouchStart(){
    }

    onTouchMove(){
    }

    onTouchEnd(){
    }
}