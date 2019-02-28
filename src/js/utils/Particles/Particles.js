import comShaderPosition from './shaders/computePosition.glsl';
import comShaderVelocity from './shaders/computeVelocity.glsl';
import comShaderTime from './shaders/computeTime.glsl';
import frag from './shaders/fragment.glsl';
import vert from './shaders/vertex.glsl';

import GPUComputationRenderer from '../../plugins/GPUComputationRenderer';

export default class Particles{

    constructor(renderer,color){
        this.renderer = renderer;

        this.computeRenderer;
        this.computeTextureWidth = 128;
        this.numParticle = this.computeTextureWidth * this.computeTextureWidth;
        
        this.obj;
        this.geo;
        this.mat;
        this.uni;
        this.color = color;
        this.time = 0;
        this.clock = new THREE.Clock();

        this.comTexs = {
            position:{
                texture: null,
                uniforms: null,
            },
            velocity:{
                texture: null,
                uniforms: null,
            },
            time:{
                texture: null,
                uniforms: null,
            },
        }

        this.startPos = new THREE.Vector3(0,1,0);
        this.goalPos = new THREE.Vector3(0,0,0);

        this.initComputeRenderer();
        this.initParticles();
    }

    initComputeRenderer(){
        this.computeRenderer = new GPUComputationRenderer(this.computeTextureWidth,this.computeTextureWidth,this.renderer);
        
        let initPositionTex = this.computeRenderer.createTexture();
        let initVelocityTex = this.computeRenderer.createTexture();
        let initTimeTex = this.computeRenderer.createTexture();

        this.initPosition(initPositionTex);
        this.initVelocity(initVelocityTex);
        this.initTime(initTimeTex);

    
        this.comTexs.position.texture = this.computeRenderer.addVariable("texturePosition",comShaderPosition,initPositionTex);
        this.comTexs.velocity.texture = this.computeRenderer.addVariable("textureVelocity",comShaderVelocity,initVelocityTex);
        this.comTexs.time.texture = this.computeRenderer.addVariable("textureTime",comShaderTime,initTimeTex);

        
        this.computeRenderer.setVariableDependencies( this.comTexs.time.texture, [ this.comTexs.position.texture, this.comTexs.velocity.texture,this.comTexs.time.texture ] );
        this.comTexs.time.uniforms = this.comTexs.time.texture.material.uniforms;
        this.comTexs.time.uniforms.deltaTime =  { type: "f" , value : 0.0 };

        this.computeRenderer.setVariableDependencies( this.comTexs.position.texture, [ this.comTexs.position.texture, this.comTexs.velocity.texture,this.comTexs.time.texture ] );
        this.comTexs.position.uniforms = this.comTexs.position.texture.material.uniforms;
        this.comTexs.position.uniforms.start =  { type:"v3", value : this.startPos};
        this.comTexs.position.uniforms.mouse =  { type:"v2" , value : new THREE.Vector2(0,0)};
        this.comTexs.position.uniforms.shot =  { type:"b" , value : false};

        this.computeRenderer.setVariableDependencies( this.comTexs.velocity.texture, [ this.comTexs.position.texture, this.comTexs.velocity.texture,this.comTexs.time.texture ] );  
        this.comTexs.velocity.uniforms = this.comTexs.velocity.texture.material.uniforms;
        this.comTexs.velocity.uniforms.mouse =  { type:"v2", value : new THREE.Vector2(0,0)};
        this.comTexs.velocity.uniforms.start =  { type:"v3", value : this.startPos};
        this.comTexs.velocity.uniforms.goal =  { type:"v3", value : this.goalPos};
        this.comTexs.velocity.uniforms.time = { type: "f",value : 0.0 };


        this.computeRenderer.init();
    }

    initTime(tex){
        var texArray = tex.image.data;
        var maxRandom = 2000;
        //ready emmit
        var z = 0.0;
        
        for(var i = 0; i < texArray.length; i +=4){
            //lifetime
            var x = Math.random() * maxRandom;
            //currentTime
            var y = x * (i / 4) / (texArray.length / 4);
            texArray[i + 0] = x;
            texArray[i + 1] = y;
            texArray[i + 2] = z;
            texArray[i + 3] = 0.0;
        }  
    }

    initPosition(tex){
        var texArray = tex.image.data;     
        for(var i = 0; i < texArray.length; i +=4){
            texArray[i + 0] = Math.random() * 20 - 10;
            texArray[i + 1] = Math.random() * 20 - 10;
            texArray[i + 2] = Math.random() * 20 - 10;
            texArray[i + 3] = 0.0;
        }
    }

    initVelocity(tex){
        var texArray = tex.image.data;
        for(var i = 0; i < texArray.length; i +=4){
            texArray[i + 0] = Math.random() * 20 - 10;
            texArray[i + 1] = Math.random() * 20 - 10;
            texArray[i + 2] = Math.random() * 20 - 10;
            texArray[i + 3] = 0;
        }
    }

    initParticles(){
        let geo = new THREE.BufferGeometry();

        //ジオメトリ初期化用の配列
        var pArray = new Float32Array(this.numParticle * 3);
        for(var i = 0; i < pArray.length; i++){
            pArray[i] = 0;
        }

        //テクスチャ参照用のuvを取得
        var uv = new Float32Array(this.numParticle * 2);
        var p = 0;
        for(var i = 0;i < this.computeTextureWidth; i ++){
            for(var j = 0;j < this.computeTextureWidth; j ++){
                uv[p++] = i / ( this.computeTextureWidth - 1);
                uv[p++] = j / ( this.computeTextureWidth - 1);
            }
        }
        geo.addAttribute('position', new THREE.BufferAttribute( pArray, 3 ) );
        geo.addAttribute('uv', new THREE.BufferAttribute( uv, 2 ) );

        this.uni = {
            texturePosition : {value: null},
            textureVelocity : {value: null},
            textureTime : {value : null},
            cameraConstant: { value: 4.0},
            color:{ value: this.color},
        }

        let mat = new THREE.ShaderMaterial({
            uniforms: this.uni,
            vertexShader: vert,
            fragmentShader: frag,
            transparent: true,
        });

        this.obj = new THREE.Points(geo,mat);
        this.obj.matrixAutoUpdate = false;
        this.obj.updateMatrix();
    }

    update(){
        this.time += this.clock.getDelta();
        this.comTexs.time.uniforms.deltaTime.value = this.clock.getDelta();
        this.comTexs.velocity.uniforms.time.value = this.time;
        this.comTexs.position.uniforms.start =  { type:"v3", value : this.startPos};
        this.comTexs.velocity.uniforms.start =  { type:"v3", value : this.startPos};
        this.comTexs.velocity.uniforms.goal =  { type:"v3", value : this.goalPos};

        this.computeRenderer.compute();
        this.uni.texturePosition.value = this.computeRenderer.getCurrentRenderTarget(this.comTexs.position.texture).texture;
        this.uni.textureVelocity.value = this.computeRenderer.getCurrentRenderTarget(this.comTexs.velocity.texture).texture;
        this.uni.textureTime.value = this.computeRenderer.getCurrentRenderTarget(this.comTexs.time.texture).texture;
    }



}