import BaseScene from './utils/BaseScene';

export default class MainScene extends BaseScene {

    constructor(renderer) {
        super(renderer);
        this.init();
        this.animate();
    }

    init() {
        this.camera.position.set(0,1.5,3);
        this.camera.lookAt(0,0,0);

        var boxGeo = new THREE.BoxGeometry(1,1,1);
        var boXMat = new THREE.MeshNormalMaterial();
        this.box = new THREE.Mesh(boxGeo,boXMat);
        this.scene.add(this.box);

        this.light = new THREE.DirectionalLight();
        this.light.position.y = 10;
        this.scene.add(this.light);
        window.scene = this.scene;
    }

    animate() {
        this.box.rotateY(0.02);
        this.renderer.render(this.scene,this.camera);
    }

    Resize(width,height){
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
    
    onTouchStart(){
    }

    onTouchMove(){
    }

    onTouchEnd(){

    }

}