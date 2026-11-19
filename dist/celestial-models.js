(() => {
'use strict';
let glowTexture;
window.createCelestialObject=(T,kind)=>{
 if(!glowTexture){const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d'),g=c.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'#ffffff');g.addColorStop(.12,'#ffffffcc');g.addColorStop(.4,'#ffffff24');g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(0,0,128,128);glowTexture=new T.CanvasTexture(canvas)}
 const root=new T.Group(),updates=[];root.userData.kind=kind;let seed=291+kind.length;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 function mesh(geometry,material,parent=root){const m=new T.Mesh(geometry,material);parent.add(m);return m}
 function halo(color,size,opacity,parent=root){const s=new T.Sprite(new T.SpriteMaterial({map:glowTexture,color,transparent:true,opacity,depthWrite:false,blending:T.AdditiveBlending}));s.scale.set(size,size,1);parent.add(s);return s}
 function particles(positions,colors,size,parent=root){const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));if(colors)geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));const p=new T.Points(geometry,new T.PointsMaterial({map:glowTexture,size,vertexColors:!!colors,color:colors?0xffffff:0xc4eaff,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));parent.add(p);return p}
 if(kind==='blackhole'){
  root.userData.radius=3.3;
  // Ray-bent accretion light: the far disk is folded above and below the shadow.
  const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:{value:0},fade:{value:1}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`precision highp float;varying vec2 v;uniform float time;uniform float fade;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
  vec3 diskLight(vec3 p){float r=length(p.xz);float a=atan(p.z,p.x);float bands=.6+.25*sin(r*105.+noise(vec2(a*7.-time*.32,r*11.))*4.)+.15*sin(r*223.+a*8.-time*2.);float flow=.55+.45*noise(vec2(a*13.-time*1.8/max(r,.5),r*16.));float heat=pow(clamp(1.-(r-1.45)/3.2,0.,1.),.65);vec3 col=mix(vec3(.49,.24,.14),vec3(1.,.9,.73),heat);return col*(.8+bands*.55+flow*.5)*(1.+.45*cos(a));}
  void main(){vec2 p=(v-.5)*vec2(4.0,3.25);float turn=.16;mat2 rot=mat2(cos(turn),-sin(turn),sin(turn),cos(turn));p=rot*p;vec3 pos=vec3(0.,.72,8.5),ray=normalize(vec3(p.x,p.y-.06,-2.65));vec3 color=vec3(0.);float alpha=0.,ring=0.;bool captured=false;
  for(int i=0;i<100;i++){float r=length(pos);if(r<.92){captured=true;break;}if(r>19.)break;float stepSize=clamp(r*.075,.055,.6);vec3 previous=pos;vec3 bending=-pos*(1.45/(r*r*r));ray=normalize(ray+bending*stepSize);pos+=ray*stepSize;ring+=exp(-abs(r-1.18)*20.)*.012;
  if(previous.y*pos.y<=0.){float fraction=previous.y/(previous.y-pos.y);vec3 hit=mix(previous,pos,fraction);float radius=length(hit.xz);float edge=smoothstep(1.35,1.75,radius)*(1.-smoothstep(4.2,4.8,radius));if(edge>.001){float emission=edge*.9*(1.-alpha);color+=diskLight(hit)*emission;alpha+=emission*.8;}}
  }color+=vec3(1.,.74,.46)*ring;if(captured)alpha=1.;alpha=max(alpha,clamp(ring*2.,0.,.65));float edgeFade=smoothstep(0.,.065,v.x)*smoothstep(0.,.065,1.-v.x)*smoothstep(0.,.065,v.y)*smoothstep(0.,.065,1.-v.y);gl_FragColor=vec4(color,alpha*fade*edgeFade);}`});
  const lens=mesh(new T.PlaneGeometry(7.4,5.6),material);lens.onBeforeRender=(renderer,scene,camera)=>{lens.quaternion.copy(camera.quaternion);lens.updateMatrixWorld()};updates.push(t=>material.uniforms.time.value=t);
 }else if(kind==='pulsar'){
  root.userData.radius=3.25;
  const star=mesh(new T.SphereGeometry(.4,48,32),new T.MeshStandardMaterial({color:0xb9e9f5,emissive:0x62b7d4,emissiveIntensity:1.1,roughness:.55}));halo(0x8dbfff,2.8,.4);halo(0xe1ffff,.95,.85);
  const spin=new T.Group();root.add(spin);const axis=new T.Group();axis.rotation.z=.47;spin.add(axis);
  const beamMat=new T.ShaderMaterial({transparent:true,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,uniforms:{fade:{value:1}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 v;uniform float fade;void main(){float q=pow(v.y,1.7);float soft=.45+.55*pow(abs(sin(v.x*6.28318)),2.);float streak=.75+.25*sin(v.x*88.+v.y*27.);gl_FragColor=vec4(.45+.55*q,.75+.25*q,1.,q*.22*soft*streak*fade);}'});
  for(const sign of [-1,1]){const beam=mesh(new T.ConeGeometry(.5,3.1,40,1,true),beamMat,axis);beam.position.y=sign*1.85;beam.rotation.z=sign>0?Math.PI:0;const line=mesh(new T.CylinderGeometry(.018,.045,3.4,12),new T.MeshBasicMaterial({color:0xc2f4ff,transparent:true,opacity:.35,depthWrite:false}),axis);line.position.y=sign*1.85;}
  for(const sign of [-1,1])for(let k=0;k<3;k++){const points=[];for(let i=0;i<=90;i++){const a=i/90*Math.PI*2;points.push(new T.Vector3(sign*(.3+k*.14)*(1-Math.cos(a)),Math.sin(a)*(1.1+k*.34),Math.sin(a*2)*.08))}axis.add(new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0x5c9ed6,transparent:true,opacity:.14})))}
  updates.push(t=>{spin.rotation.y=t*.9;star.rotation.y=t*.2});root.rotation.z=-.24;
 }else if(kind==='nebula'){
  root.userData.radius=3.1;
  const material=new T.ShaderMaterial({transparent:true,side:T.FrontSide,depthWrite:false,uniforms:{time:{value:0},fade:{value:1},eye:{value:new T.Vector3()}},vertexShader:'varying vec3 local;void main(){local=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`precision highp float;varying vec3 local;uniform vec3 eye;uniform float time;uniform float fade;
  float h(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}float n(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
  float fbm(vec3 p){return n(p)*.56+n(p*2.03)*.28+n(p*4.07)*.12+n(p*8.1)*.04;}
  void main(){vec3 ray=normalize(local-eye),inverse=1./ray,a=(-vec3(3.,2.,2.)-eye)*inverse,b=(vec3(3.,2.,2.)-eye)*inverse,near=min(a,b),far=max(a,b);float begin=max(max(near.x,near.y),near.z),end=min(min(far.x,far.y),far.z),stepSize=(end-max(begin,0.))/52.;vec3 p=eye+ray*max(begin,0.);vec3 color=vec3(0.);float opacity=0.;
  for(int i=0;i<52;i++){p+=ray*stepSize;vec3 q=p+vec3(time*.006,0.,-time*.003);float shape=exp(-dot(p*vec3(.34,.48,.46),p*vec3(.34,.48,.46))*1.7);float cloud=max(0.,fbm(q*2.)-.39)*shape*3.3;float filaments=.45+.55*fbm(q*5.);float alpha=(1.-exp(-cloud*stepSize*2.5))*(1.-opacity);float palette=fbm(q*.7+vec3(4.));vec3 gas=mix(vec3(.2,.43,.72),vec3(.85,.3,.56),smoothstep(.35,.68,palette));float illumination=.7+1.2*exp(-length(p-vec3(-.4,.3,0.))*.7);color+=gas*alpha*illumination*filaments*2.7;opacity+=alpha;}
  gl_FragColor=vec4(color,opacity*fade);}`});
  const volume=mesh(new T.BoxGeometry(6,4,4),material);volume.onBeforeRender=(renderer,scene,camera)=>{root.updateWorldMatrix(true,false);material.uniforms.eye.value.copy(camera.position);root.worldToLocal(material.uniforms.eye.value)};
  const pos=[],colors=[];for(let i=0;i<380;i++){pos.push((random()-.5)*5.7,(random()-.5)*3.6,(random()-.5)*3);const c=new T.Color().setHSL(.58+random()*.15,.15,.7+random()*.25);colors.push(c.r,c.g,c.b)}particles(pos,colors,.025);
  for(let i=0;i<6;i++){const s=halo(0xd7eaff,.21,.8);s.position.set((random()-.5)*3.5,(random()-.5)*2,(random()-.5)*1.5)}updates.push(t=>material.uniforms.time.value=t);
 }else{
  root.userData.radius=3.1;
  const nucleus=mesh(new T.IcosahedronGeometry(.46,4),new T.MeshStandardMaterial({color:0x332e27,roughness:1,metalness:0}));const rockVertices=nucleus.geometry.attributes.position;for(let i=0;i<rockVertices.count;i++){const x=rockVertices.getX(i),y=rockVertices.getY(i),z=rockVertices.getZ(i),bump=1+Math.sin(x*39)*Math.cos(y*31)*.1+Math.sin(z*43)*.055;rockVertices.setXYZ(i,x*bump,y*bump,z*bump)}const rockColor=[];for(let i=0;i<rockVertices.count;i++){const grain=.45+.16*Math.sin(rockVertices.getX(i)*74)*Math.cos(rockVertices.getZ(i)*59);rockColor.push(grain,grain*.88,grain*.73)}nucleus.geometry.setAttribute('color',new T.Float32BufferAttribute(rockColor,3));nucleus.material.vertexColors=true;nucleus.geometry.computeVertexNormals();nucleus.scale.set(1,.77,.85);halo(0xbce9ed,1.4,.6);
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
