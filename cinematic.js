/* =========================================================================
   AADYA · Baby Pink Cinematic 3D Scroll Engine
   ========================================================================= */
(function(){
'use strict';

const C={
  bg:0xFDF5F8,
  pink:0xF4A7B9,
  pinkDeep:0xE87A95,
  peach:0xFFD4A3,
  lavender:0xE8D4F0,
  mint:0xD4F0E8,
  cream:0xFFFDF9,
  white:0xFFFFFF,
};
const isMobile=window.matchMedia('(max-width:720px)').matches;

/* RENDERER */
const canvas=document.getElementById('three-canvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:!isMobile,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,isMobile?1.5:2));
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor(C.bg,1);
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.2;
renderer.outputEncoding=THREE.sRGBEncoding;

const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(C.bg,0.018);

const camera=new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,200);
camera.position.set(0,0,9);

/* LIGHTS */
scene.add(new THREE.AmbientLight(0xFFF0F5,0.8));
const pinkLight=new THREE.PointLight(C.pink,1.8,30,1.4);
pinkLight.position.set(3,2,5);scene.add(pinkLight);
const peachLight=new THREE.PointLight(C.peach,1.4,25,1.6);
peachLight.position.set(-3,-1,4);scene.add(peachLight);
const lavLight=new THREE.PointLight(C.lavender,0.8,20,1.8);
lavLight.position.set(0,4,3);scene.add(lavLight);

/* TEXTURES */
function makeSparkle(color='rgba(244,167,185,1)'){
  const c=document.createElement('canvas');c.width=c.height=64;
  const g=c.getContext('2d');
  const grad=g.createRadialGradient(32,32,0,32,32,32);
  grad.addColorStop(0,color);
  grad.addColorStop(0.3,color.replace(',1)',',0.6)'));
  grad.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=grad;g.fillRect(0,0,64,64);
  const tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;
  return tex;
}
function makeLetterTexture(letter){
  const c=document.createElement('canvas');c.width=256;c.height=320;
  const g=c.getContext('2d');
  const grad=g.createLinearGradient(0,40,0,280);
  grad.addColorStop(0,'#F4A7B9');
  grad.addColorStop(0.5,'#E87A95');
  grad.addColorStop(1,'#C05070');
  g.fillStyle=grad;
  g.font='300 260px "Cormorant Garamond",serif';
  g.textAlign='center';g.textBaseline='middle';
  g.shadowColor='rgba(244,167,185,0.6)';g.shadowBlur=20;
  g.fillText(letter,128,170);
  const tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;tex.anisotropy=8;
  return tex;
}

const sparkleTex=makeSparkle('rgba(244,167,185,1)');
const peachTex=makeSparkle('rgba(255,212,163,1)');

/* WORLD GROUP */
const world=new THREE.Group();
scene.add(world);

/* AADYA LETTERS */
const lettersGroup=new THREE.Group();
lettersGroup.position.set(0,0,2);
const letterStr='AADYA';
const letterMeshes=[];
const lspacing=1.1;
const totalW=(letterStr.length-1)*lspacing;
for(let i=0;i<letterStr.length;i++){
  const tex=makeLetterTexture(letterStr[i]);
  const mat=new THREE.MeshBasicMaterial({
    map:tex,transparent:true,depthWrite:false,
    blending:THREE.NormalBlending,opacity:0,
  });
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.3,1.6),mat);
  mesh.userData.target=new THREE.Vector3(-totalW/2+i*lspacing,0,0);
  mesh.userData.scatter=new THREE.Vector3(
    (Math.random()-0.5)*5,(Math.random()-0.5)*3,(Math.random()-0.5)*2-1
  );
  mesh.userData.scatterRot=new THREE.Vector3(
    (Math.random()-0.5)*Math.PI*0.6,(Math.random()-0.5)*Math.PI*0.6,(Math.random()-0.5)*Math.PI*0.4
  );
  mesh.position.copy(mesh.userData.scatter);
  mesh.userData.assemble=0;
  lettersGroup.add(mesh);letterMeshes.push(mesh);
}
world.add(lettersGroup);

/* PINK SPARKLE PARTICLES */
const dustCount=isMobile?600:1400;
const dustGeo=new THREE.BufferGeometry();
const dustPos=new Float32Array(dustCount*3);
const dustData=[];
for(let i=0;i<dustCount;i++){
  dustPos[i*3]=(Math.random()-0.5)*50;
  dustPos[i*3+1]=(Math.random()-0.5)*100-30;
  dustPos[i*3+2]=(Math.random()-0.5)*25-5;
  dustData.push({
    vx:(Math.random()-0.5)*0.002,
    vy:Math.random()*0.006+0.001,
    vz:(Math.random()-0.5)*0.002,
    phase:Math.random()*Math.PI*2,
    amp:0.4+Math.random()*0.6,
  });
}
dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));
const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({
  map:sparkleTex,color:0xF4A7B9,size:0.2,sizeAttenuation:true,
  transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0.7,
}));
scene.add(dust);

/* PEACH BUBBLES (larger, fewer) */
const bubbleCount=isMobile?80:200;
const bubbleGeo=new THREE.BufferGeometry();
const bubblePos=new Float32Array(bubbleCount*3);
const bubbleData=[];
for(let i=0;i<bubbleCount;i++){
  bubblePos[i*3]=(Math.random()-0.5)*40;
  bubblePos[i*3+1]=(Math.random()-0.5)*80-20;
  bubblePos[i*3+2]=(Math.random()-0.5)*18-4;
  bubbleData.push({
    vy:Math.random()*0.008+0.003,
    phase:Math.random()*Math.PI*2,
    amp:0.6+Math.random()*1.0,
  });
}
bubbleGeo.setAttribute('position',new THREE.BufferAttribute(bubblePos,3));
const bubbles=new THREE.Points(bubbleGeo,new THREE.PointsMaterial({
  map:peachTex,color:0xFFD4A3,size:0.45,sizeAttenuation:true,
  transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0.5,
}));
scene.add(bubbles);

/* LOTUS (ceremony depth, z=-14) */
const lotusGroup=new THREE.Group();
lotusGroup.position.set(0,-14,-6);
const petalGeoL=new THREE.ConeGeometry(0.28,1.1,8,1,true);
const petalMatL=new THREE.MeshStandardMaterial({
  color:C.pink,emissive:C.pink,emissiveIntensity:0.3,
  metalness:0.2,roughness:0.5,side:THREE.DoubleSide,
  transparent:true,opacity:0.85,
});
const lotusPetals=[];
for(let i=0;i<10;i++){
  const p=new THREE.Mesh(petalGeoL,petalMatL);
  p.userData.angle=(i/10)*Math.PI*2;
  p.userData.openTilt=1.0;
  lotusGroup.add(p);lotusPetals.push(p);
}
const innerMatL=petalMatL.clone();
innerMatL.color.set(C.peach);innerMatL.emissive.set(C.peach);
for(let i=0;i<6;i++){
  const p=new THREE.Mesh(petalGeoL,innerMatL);
  p.scale.setScalar(0.6);
  p.userData.angle=(i/6)*Math.PI*2+0.3;
  p.userData.openTilt=0.55;
  lotusGroup.add(p);lotusPetals.push(p);
}
const lotusBud=new THREE.Mesh(
  new THREE.SphereGeometry(0.2,24,24),
  new THREE.MeshStandardMaterial({
    color:C.peach,emissive:C.peach,emissiveIntensity:0.6,
    metalness:0.5,roughness:0.3,
  })
);
lotusGroup.add(lotusBud);
lotusGroup.scale.setScalar(0.001);
world.add(lotusGroup);

/* CANDLE (message section, z=-28) */
const candleGroup=new THREE.Group();
candleGroup.position.set(0,-28,-3);
const candleBody=new THREE.Mesh(
  new THREE.CylinderGeometry(0.18,0.22,1.2,24),
  new THREE.MeshStandardMaterial({color:0xFFF0F0,roughness:0.8,metalness:0})
);
candleBody.position.y=-0.2;candleGroup.add(candleBody);
const flameMat=new THREE.ShaderMaterial({
  uniforms:{uTime:{value:0}},
  transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`
    varying vec2 vUv;uniform float uTime;
    vec2 hash(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.0+2.0*fract(sin(p)*43758.5453123);}
    float noise(vec2 p){
      const float K1=0.366025404,K2=0.211324865;
      vec2 i=floor(p+(p.x+p.y)*K1);vec2 a=p-i+(i.x+i.y)*K2;
      vec2 o=(a.x>a.y)?vec2(1.0,0.0):vec2(0.0,1.0);
      vec2 b=a-o+K2;vec2 c=a-1.0+2.0*K2;
      vec3 h=max(0.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.0);
      vec3 n=h*h*h*h*vec3(dot(a,hash(i)),dot(b,hash(i+o)),dot(c,hash(i+1.0)));
      return dot(n,vec3(70.0));
    }
    void main(){
      vec2 uv=vUv;vec2 p=uv*2.0-1.0;
      float taper=smoothstep(0.0,0.15,uv.y)*(1.0-smoothstep(0.55,1.0,uv.y));
      float width=1.0-pow(abs(p.x)*(1.4-uv.y*0.5),2.0);
      float shape=max(width*taper,0.0);
      float n=noise(vec2(p.x*3.0,uv.y*4.0-uTime*1.6));
      shape+=(n*0.35)*(uv.y*0.4);
      shape=max(shape-abs(p.x)*0.55,0.0);shape=pow(shape,1.4);
      vec3 col=mix(vec3(0.96,0.65,0.72),vec3(1.0,0.85,0.7),smoothstep(0.0,0.6,shape));
      col=mix(col,vec3(1.0,0.95,0.9),smoothstep(0.55,0.9,shape));
      float a=smoothstep(0.0,0.05,shape)*0.85;
      if(a<0.01)discard;
      gl_FragColor=vec4(col,a);
    }`
});
const flame=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.9),flameMat);
flame.position.y=0.7;candleGroup.add(flame);
const flameLight=new THREE.PointLight(0xFFB0C0,1.8,8,2);
flameLight.position.y=0.6;candleGroup.add(flameLight);
world.add(candleGroup);

/* CLOSING DOME */
const closingGroup=new THREE.Group();
closingGroup.position.set(0,-68,-8);
const domeMat=new THREE.MeshBasicMaterial({
  color:C.pink,transparent:true,opacity:0.0,side:THREE.BackSide,
});
const dome=new THREE.Mesh(new THREE.SphereGeometry(8,32,16,0,Math.PI*2,0,Math.PI/2),domeMat);
dome.position.y=-2;closingGroup.add(dome);
world.add(closingGroup);

/* BLOOM POST-PROCESSING */
let composer=null;
if(typeof THREE.EffectComposer!=='undefined'&&typeof THREE.UnrealBloomPass!=='undefined'){
  composer=new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene,camera));
  const bloom=new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth,window.innerHeight),
    isMobile?0.5:0.8, 0.9, 0.75
  );
  composer.addPass(bloom);
}

/* SCROLL CAMERA WAYPOINTS */
const sections=[
  {id:'hero',    pos:new THREE.Vector3(0,0,9),   look:new THREE.Vector3(0,0,0)},
  {id:'ceremony',pos:new THREE.Vector3(0,-14,7), look:new THREE.Vector3(0,-14,-3)},
  {id:'closing', pos:new THREE.Vector3(0,-68,20),look:new THREE.Vector3(0,-64,-8)},
];
const camTarget=camera.position.clone();
const lookTarget=new THREE.Vector3(0,0,0);

function computeCamera(){
  const docH=document.documentElement.scrollHeight-window.innerHeight;
  const t=Math.max(0,Math.min(1,window.scrollY/docH));
  const f=t*(sections.length-1);
  const i=Math.floor(f);
  const i2=Math.min(i+1,sections.length-1);
  const k=f-i;
  const e=k*k*(3-2*k);
  camTarget.lerpVectors(sections[i].pos,sections[i2].pos,e);
  lookTarget.lerpVectors(sections[i].look,sections[i2].look,e);
}

/* SCROLL REVEALS */
if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'){
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('section.scene').forEach(sec=>{
    ScrollTrigger.create({
      trigger:sec,start:'top 70%',end:'bottom 30%',
      onEnter:()=>sec.classList.add('reveal'),
      onEnterBack:()=>sec.classList.add('reveal'),
    });
  });
}else{
  document.querySelectorAll('section.scene').forEach(s=>s.classList.add('reveal'));
}

/* MOUSE PARALLAX */
const mouse={x:0,y:0,tx:0,ty:0};
window.addEventListener('mousemove',e=>{
  mouse.tx=(e.clientX/window.innerWidth-0.5)*2;
  mouse.ty=(e.clientY/window.innerHeight-0.5)*2;
});

/* ANIMATION LOOP */
const clock=new THREE.Clock();

function animate(){
  const dt=Math.min(clock.getDelta(),0.05);
  const elapsed=clock.getElapsedTime();

  computeCamera();
  camera.position.lerp(camTarget,0.08);
  mouse.x+=(mouse.tx-mouse.x)*0.05;
  mouse.y+=(mouse.ty-mouse.y)*0.05;
  const lookFinal=new THREE.Vector3().copy(lookTarget);
  lookFinal.x+=mouse.x*0.35;lookFinal.y+=-mouse.y*0.25;
  camera.lookAt(lookFinal);

  /* Lights orbit */
  pinkLight.position.x=Math.cos(elapsed*0.35)*4;
  pinkLight.position.z=Math.sin(elapsed*0.35)*4+3;
  pinkLight.position.y=Math.sin(elapsed*0.5)*1+camera.position.y*0.95;
  peachLight.position.x=Math.cos(elapsed*0.28+Math.PI)*3.5;
  peachLight.position.z=Math.sin(elapsed*0.28+Math.PI)*3.5+2;
  peachLight.position.y=Math.cos(elapsed*0.4)*0.8+camera.position.y*0.95;

  /* AADYA letter assembly */
  const heroProg=THREE.MathUtils.clamp(1-window.scrollY/(window.innerHeight*0.9),0,1);
  letterMeshes.forEach((m,idx)=>{
    m.userData.assemble+=(heroProg-m.userData.assemble)*0.06;
    const k=m.userData.assemble;
    const ek=k*k*(3-2*k);
    m.position.lerpVectors(m.userData.scatter,m.userData.target,ek);
    m.rotation.x=m.userData.scatterRot.x*(1-ek);
    m.rotation.y=m.userData.scatterRot.y*(1-ek);
    m.rotation.z=m.userData.scatterRot.z*(1-ek)+Math.sin(elapsed*0.5+idx)*0.015;
    m.material.opacity=ek*0.9;
    m.scale.setScalar(1+Math.sin(elapsed*0.7+idx*0.3)*0.01);
  });

  /* Pink sparkles */
  const dPos=dustGeo.attributes.position.array;
  for(let i=0;i<dustCount;i++){
    const d=dustData[i];
    dPos[i*3]+=d.vx+Math.sin(elapsed*0.4+d.phase)*0.0006*d.amp;
    dPos[i*3+1]+=d.vy;
    dPos[i*3+2]+=d.vz+Math.cos(elapsed*0.35+d.phase)*0.0005*d.amp;
    if(dPos[i*3+1]>camera.position.y+30)dPos[i*3+1]=camera.position.y-30;
    if(dPos[i*3+1]<camera.position.y-40)dPos[i*3+1]=camera.position.y+25;
    if(dPos[i*3]>28)dPos[i*3]=-28;
    if(dPos[i*3]<-28)dPos[i*3]=28;
  }
  dustGeo.attributes.position.needsUpdate=true;

  /* Peach bubbles */
  const bPos=bubbleGeo.attributes.position.array;
  for(let i=0;i<bubbleCount;i++){
    const d=bubbleData[i];
    bPos[i*3]+=Math.sin(elapsed*0.3+d.phase)*0.002*d.amp;
    bPos[i*3+1]+=d.vy;
    bPos[i*3+2]+=Math.cos(elapsed*0.25+d.phase)*0.001;
    if(bPos[i*3+1]>camera.position.y+25)bPos[i*3+1]=camera.position.y-30;
    if(bPos[i*3+1]<camera.position.y-35)bPos[i*3+1]=camera.position.y+20;
  }
  bubbleGeo.attributes.position.needsUpdate=true;

  /* Lotus bloom */
  const cerSec=document.getElementById('ceremony');
  if(cerSec){
    const r=cerSec.getBoundingClientRect();
    const cerProg=THREE.MathUtils.clamp(1-r.top/window.innerHeight,0,1);
    const bloomP=THREE.MathUtils.clamp((cerProg-0.2)*1.6,0,1);
    const ek=bloomP*bloomP*(3-2*bloomP);
    lotusGroup.scale.setScalar(THREE.MathUtils.lerp(0.001,1.2,ek));
    lotusGroup.rotation.y=elapsed*0.12;
    lotusPetals.forEach(p=>{
      const opening=ek*p.userData.openTilt;
      const rad=0.1+opening*0.7;
      p.position.set(Math.cos(p.userData.angle)*rad,0.1+(1-ek)*0.5,Math.sin(p.userData.angle)*rad);
      p.rotation.set(Math.PI/2-opening*1.1,-p.userData.angle,0);
    });
    lotusBud.scale.setScalar(0.5+ek*0.6);
  }

  /* Candle flame */
  flameMat.uniforms.uTime.value=elapsed;
  flameLight.intensity=1.5+Math.sin(elapsed*5)*0.3+Math.sin(elapsed*9)*0.15;
  candleGroup.rotation.y=Math.sin(elapsed*0.25)*0.04;

  /* Closing dome */
  const closingSec=document.getElementById('closing');
  if(closingSec){
    const r=closingSec.getBoundingClientRect();
    const p=THREE.MathUtils.clamp(1-r.top/window.innerHeight,0,1);
    domeMat.opacity=p*0.12;
  }

  world.position.y=Math.sin(elapsed*0.35)*0.04;

  if(composer)composer.render();
  else renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
animate();

/* RESIZE */
window.addEventListener('resize',()=>{
  const w=window.innerWidth,h=window.innerHeight;
  camera.aspect=w/h;camera.updateProjectionMatrix();
  renderer.setSize(w,h);if(composer)composer.setSize(w,h);
});

/* PRELOADER */
window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('preloader').classList.add('ready'),1600);
});

})();

/* RSVP + CALENDAR */
function handleRSVP(){
  const name=document.getElementById('rsvpName').value.trim();
  const phone=document.getElementById('rsvpPhone').value.trim();
  if(!name||!phone)return;
  const msg=encodeURIComponent(`🌸 RSVP for Aadya's Naamkaran 🌸\n\nName: ${name}\nPhone: ${phone}\nDate: 15 June 2025, 10:30 AM\nVenue: The Grand Ballroom, Mumbai\n\nWith love,\nPuneet & Bulbul Agarwal`);
  window.open(`https://wa.me/?text=${msg}`,'_blank');
}
const _addCalBtn=document.getElementById('addToCalendarBtn');
if(_addCalBtn){_addCalBtn.addEventListener('click',()=>{
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Aadya//EN','BEGIN:VEVENT',
    'UID:aadya-naamkaran@2025','DTSTAMP:20250101T000000Z',
    'DTSTART:20250615T050000Z','DTEND:20250615T080000Z',
    'SUMMARY:Naamkaran - Baby Aadya',
    'DESCRIPTION:Join us for baby Aadya\'s naming ceremony.',
    'LOCATION:The Grand Ballroom, Taj Lands End, Mumbai',
    'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const blob=new Blob([ics],{type:'text/calendar'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='Aadya-Naamkaran.ics';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});}
