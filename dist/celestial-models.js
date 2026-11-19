(() => {
'use strict';
let glowTexture;
window.createCelestialObject=(T,kind)=>{
 if(!glowTexture){const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d'),g=c.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'#ffffff');g.addColorStop(.12,'#ffffffcc');g.addColorStop(.4,'#ffffff24');g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(0,0,128,128);glowTexture=new T.CanvasTexture(canvas)}
 const root=new T.Group(),updates=[];root.userData.kind=kind;let seed=291+kind.length;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 function mesh(geometry,material,parent=root){const m=new T.Mesh(geometry,material);parent.add(m);return m}
 function halo(color,size,opacity,parent=root){const s=new T.Sprite(new T.SpriteMaterial({map:glowTexture,color,transparent:true,opacity,depthWrite:false,blending:T.AdditiveBlending}));s.scale.set(size,size,1);parent.add(s);return s}
 const surfaceNoise=`float hash3(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash3(i),hash3(i+vec3(1,0,0)),f.x),mix(hash3(i+vec3(0,1,0)),hash3(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash3(i+vec3(0,0,1)),hash3(i+vec3(1,0,1)),f.x),mix(hash3(i+vec3(0,1,1)),hash3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fractal(vec3 p){return noise3(p)*.51+noise3(p*2.02)*.25+noise3(p*4.03)*.13+noise3(p*8.07)*.065+noise3(p*16.11)*.032+noise3(p*32.17)*.013;}`;
 function particles(positions,colors,size,parent=root){const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));if(colors)geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));const p=new T.Points(geometry,new T.PointsMaterial({map:glowTexture,size,vertexColors:!!colors,color:colors?0xffffff:0xc4eaff,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));parent.add(p);return p}
 if(kind==='blackhole'){
  root.userData.radius=3.3;
  // Ray-bent accretion light: the far disk is folded above and below the shadow.
  const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:{value:0},fade:{value:1}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`precision highp float;varying vec2 v;uniform float time;uniform float fade;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
  vec3 diskLight(vec3 p){float r=length(p.xz),a=atan(p.z,p.x);float shear=a-time*.65/pow(r,1.5);vec2 uv=vec2(shear*7.,r*25.);float lanes=noise(uv)*.6+noise(uv*2.07)*.27+noise(uv*4.13)*.13;float filaments=pow(lanes,1.5);float temperature=exp(-(r-1.9)*.8);vec3 col=mix(vec3(.19,.075,.028),vec3(1.,.9,.73),temperature);float approaching=.5+.5*cos(a+.45);float doppler=.5+approaching*.9;return col*(.16+filaments*1.8)*doppler;}
  void main(){vec2 p=(v-.5)*vec2(4.0,3.25);float turn=.24;mat2 rot=mat2(cos(turn),-sin(turn),sin(turn),cos(turn));p=rot*p;vec3 pos=vec3(0.,.36,8.5),ray=normalize(vec3(p.x,p.y-.06,-2.65));vec3 color=vec3(0.);float alpha=0.,ring=0.;bool captured=false;
  for(int i=0;i<144;i++){float r=length(pos);if(r<.92){captured=true;break;}if(r>19.)break;float stepSize=clamp(r*.052,.038,.45);vec3 previous=pos;vec3 bending=-pos*(1.45/(r*r*r));ray=normalize(ray+bending*stepSize);pos+=ray*stepSize;ring+=exp(-abs(r-1.18)*20.)*.012;
  if(previous.y*pos.y<=0.){float fraction=previous.y/(previous.y-pos.y);vec3 hit=mix(previous,pos,fraction);float radius=length(hit.xz);float edge=smoothstep(1.7,1.94,radius)*(1.-smoothstep(4.4,5.,radius))*exp(-max(radius-2.,0.)*.85);if(edge>.001){float emission=edge*.9*(1.-alpha);color+=diskLight(hit)*emission;alpha+=emission*.8;}}
  }if(captured)ring=0.;color+=vec3(1.,.74,.46)*ring;if(captured)alpha=1.;alpha=max(alpha,clamp(ring*2.,0.,.65));float edgeFade=smoothstep(0.,.065,v.x)*smoothstep(0.,.065,1.-v.x)*smoothstep(0.,.065,v.y)*smoothstep(0.,.065,1.-v.y);gl_FragColor=vec4(color*1.15,alpha*fade*edgeFade);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});
  const lens=mesh(new T.PlaneGeometry(7.4,5.6),material);lens.onBeforeRender=(renderer,scene,camera)=>{lens.quaternion.copy(camera.quaternion);lens.updateMatrixWorld()};updates.push(t=>material.uniforms.time.value=t);
 }else if(kind==='pulsar'){
  root.userData.radius=3.25;
  const starMaterial=new T.ShaderMaterial({uniforms:{time:{value:0},fade:{value:1}},vertexShader:'varying vec3 p;varying vec3 normalView;void main(){p=position;normalView=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:surfaceNoise+`varying vec3 p;varying vec3 normalView;uniform float time;uniform float fade;void main(){vec3 q=normalize(p)*8.+vec3(0.,time*.025,0.);float cells=fractal(q*1.7);float fissures=pow(1.-abs(fractal(q*1.8)*2.-1.),9.);float limb=pow(max(normalView.z,0.),.32);vec3 heat=mix(vec3(.16,.35,.58),vec3(.75,.9,1.),cells);heat+=fissures*.12;gl_FragColor=vec4(heat*(.35+limb*.8),fade);}`});
  const star=mesh(new T.SphereGeometry(.32,96,64),starMaterial);halo(0x9ccfff,.86,.38);halo(0x9ccfff,1.9,.09);
  const spin=new T.Group();root.add(spin);const axis=new T.Group();axis.rotation.z=.47;spin.add(axis);
  const beamMat=new T.ShaderMaterial({transparent:true,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,uniforms:{fade:{value:1},time:{value:0}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:surfaceNoise+'varying vec2 v;uniform float fade;uniform float time;void main(){float tip=pow(v.y,1.1);float stripe=pow(.5+.5*cos(v.x*6.283185),5.);float wisps=fractal(vec3(v.x*14.,v.y*23.-time*.9,time*.08));float a=tip*(.035+stripe*.2)*(.4+wisps);gl_FragColor=vec4(.45,.72,1.,a*fade);}'});
  for(const sign of [-1,1]){const beam=mesh(new T.ConeGeometry(.32,3.25,64,12,true),beamMat,axis);beam.position.y=sign*1.87;beam.rotation.z=sign>0?Math.PI:0;const core=mesh(new T.ConeGeometry(.055,3.4,32,1,true),beamMat,axis);core.position.y=sign*1.9;core.rotation.z=sign>0?Math.PI:0;}
  // Emission wisps replace diagram-like magnetic field outlines.
  updates.push(t=>{spin.rotation.y=t*.65;star.rotation.y=t*.2;starMaterial.uniforms.time.value=t;beamMat.uniforms.time.value=t});root.rotation.z=-.24;
 }else if(kind==='nebula'){
  root.userData.radius=3.1;
  const texture=new T.TextureLoader().load(window.nebulaTextureSource||new URL('assets/nebula-reflection-v2.png',document.baseURI).href);texture.colorSpace=T.SRGBColorSpace;
  const material=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{image:{value:texture},time:{value:0},fade:{value:1}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:surfaceNoise+`varying vec2 v;uniform sampler2D image;uniform float time;uniform float fade;
  void main(){vec2 uv=v;vec2 center=uv-.5;float cloud=fractal(vec3(uv*5.,0.));vec2 drift=vec2(sin(time*.027),cos(time*.021))*.002;uv+=drift*cloud;vec3 photographic=texture2D(image,uv).rgb;float luminance=dot(photographic,vec3(.2126,.7152,.0722));float border=smoothstep(0.,.12,v.x)*smoothstep(0.,.12,1.-v.x)*smoothstep(0.,.12,v.y)*smoothstep(0.,.12,1.-v.y);float opacity=smoothstep(.001,.016,luminance)*border;gl_FragColor=vec4(photographic*.88,opacity*fade);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});
  const cloud=mesh(new T.PlaneGeometry(6.1,6.1,48,48),material);cloud.onBeforeRender=(renderer,scene,camera)=>{cloud.quaternion.copy(camera.quaternion);cloud.updateMatrixWorld()};
  // Depth-separated illuminated dust adds gentle parallax in front of the photographic gas.
  const pos=[],colors=[];for(let i=0;i<150;i++){pos.push((random()-.5)*5.2,(random()-.5)*4.8,(random()-.5)*1.5);const c=new T.Color().setHSL(.1+random()*.55,.12,.7+random()*.25);colors.push(c.r,c.g,c.b)}particles(pos,colors,.018);
  updates.push(t=>material.uniforms.time.value=t);
 }else{
  root.userData.radius=3.1;
  const rockMaterial=new T.ShaderMaterial({uniforms:{fade:{value:1}},vertexShader:'varying vec3 p;varying vec3 n;varying vec3 viewP;void main(){p=position;n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);viewP=mv.xyz;gl_Position=projectionMatrix*mv;}',fragmentShader:surfaceNoise+`varying vec3 p;varying vec3 n;varying vec3 viewP;uniform float fade;
  float height(vec3 q){return fractal(q*36.)*.65+fractal(q*115.)*.2;}
  void main(){vec3 N=normalize(n);float e=.001;float base=height(p);vec3 grad=vec3(height(p+vec3(e,0,0))-base,height(p+vec3(0,e,0))-base,height(p+vec3(0,0,e))-base)/e;N=normalize(N-(grad-N*dot(grad,N))*.11);vec3 L=normalize(vec3(-.75,.65,1.));float diffuse=max(dot(N,L),0.);float grain=fractal(p*72.);float terrain=fractal(p*12.);vec3 albedo=mix(vec3(.075,.07,.063),vec3(.28,.26,.23),terrain);albedo*=.6+grain*.7;float rim=pow(1.-max(dot(N,normalize(-viewP)),0.),4.)*.025;vec3 col=albedo*(.055+diffuse*2.4)+rim*vec3(.3,.45,.6);gl_FragColor=vec4(pow(col,vec3(.4545)),fade);}`});
  const geo=new T.SphereGeometry(.56,160,112),vertices=geo.attributes.position;
  for(let i=0;i<vertices.count;i++){const x=vertices.getX(i)/.56,y=vertices.getY(i)/.56,z=vertices.getZ(i)/.56;const terrain=1+.1*Math.sin(x*7.+z*3.)*Math.cos(y*9.)+.045*Math.sin(z*21.+y*8.)*Math.cos(x*17.)+.014*Math.sin(x*67.+z*39.)*Math.cos(y*59.);const neck=1-.19*Math.exp(-Math.pow((y-.12)*4.,2.));vertices.setXYZ(i,x*.56*terrain*neck,y*.56*terrain,z*.56*terrain*neck)}geo.computeVertexNormals();
  const nucleus=mesh(geo,rockMaterial);nucleus.scale.set(1.15,.85,.9);halo(0xa8c5d2,1.7,.1);
  const position=[],colors=[],tailData=[];
  for(let i=0;i<1800;i++){const distance=random(),angle=random()*Math.PI*2,spread=random();tailData.push({distance,angle,spread});const x=distance*5;position.push(x,Math.sin(angle)*spread*(.1+distance*.7)+distance*distance*.65,Math.cos(angle)*spread*(.1+distance*.6));const c=new T.Color().setHSL(i%3===0?.12:.51,.3,.65);colors.push(c.r,c.g,c.b)}const tail=particles(position,colors,.07);tail.position.x=-.1;
  // Ion tail stays directed away from a fixed light source; dust fans out alongside it.
  for(let i=0;i<12;i++){const s=halo(0x79b7e3,.3+i*.13,.08);s.position.set(i*.43,0,0)}root.rotation.z=.3;root.position.x=0;
  updates.push(t=>{nucleus.rotation.y=t*.12;nucleus.rotation.z=t*.035;const array=tail.geometry.attributes.position.array;tailData.forEach((p,i)=>{const d=(p.distance+t*.035)%1;array[i*3]=d*5;array[i*3+1]=Math.sin(p.angle)*p.spread*(.1+d*.7)+d*d*.65;array[i*3+2]=Math.cos(p.angle)*p.spread*(.1+d*.6)});tail.geometry.attributes.position.needsUpdate=true});
 }
 root.userData.update=t=>updates.forEach(update=>update(t));
 root.traverse(child=>{if(!child.material)return;for(const m of Array.isArray(child.material)?child.material:[child.material]){m.userData.originalOpacity=m.opacity;m.userData.originalTransparent=m.transparent}});
 return root;
};
window.setCelestialOpacity=(root,opacity)=>root.traverse(child=>{if(!child.material)return;for(const m of Array.isArray(child.material)?child.material:[child.material]){m.opacity=(m.userData.originalOpacity??1)*opacity;if(m.uniforms?.fade)m.uniforms.fade.value=opacity;const transparent=m.userData.originalTransparent||opacity<.999;if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true}}});
})();
