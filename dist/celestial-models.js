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
  mesh(new T.SphereGeometry(.93,64,48),new T.MeshBasicMaterial({color:0x010106}));
  const photon=mesh(new T.TorusGeometry(.99,.022,12,128),new T.MeshBasicMaterial({color:0xffd5a4}));photon.rotation.x=Math.PI/2;
  const diskMaterial=new T.ShaderMaterial({transparent:true,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,uniforms:{time:{value:0},fade:{value:1}},vertexShader:'varying vec2 v; void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 v;uniform float time;uniform float fade;
   void main(){vec2 p=(v-.5)*6.6;float r=length(p);float a=atan(p.y,p.x);float edge=smoothstep(1.0,1.2,r)*(1.-smoothstep(2.5,3.3,r));float bands=.5+.5*sin(r*88.+sin(a*6.+time*.8)*.6);float turbulence=.55+.45*sin(a*11.-time*(4./max(r,.3))+r*13.);float hot=pow(max(0.,1.-(r-1.)/2.3),1.5);vec3 warm=mix(vec3(.66,.14,.035),vec3(1.,.82,.53),hot);float doppler=.65+.35*cos(a);gl_FragColor=vec4(warm*(.65+bands*.45)*doppler,edge*(.38+turbulence*.35)*fade);}`});
  const disk=mesh(new T.PlaneGeometry(6.6,6.6),diskMaterial);disk.rotation.x=-Math.PI/2;root.rotation.set(.43,0,-.15);
  // Lensed light from the rear disk wraps above the otherwise dark shadow.
  const arc=mesh(new T.TorusGeometry(1.02,.035,12,100,Math.PI),new T.MeshBasicMaterial({color:0xffc98b,transparent:true,opacity:.75}));arc.rotation.z=.05;arc.position.z=.07;
  const glow=halo(0xffa04e,5,.12);glow.position.y=.05;
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=256;const sc=shadowCanvas.getContext('2d'),shadowGradient=sc.createRadialGradient(128,128,0,128,128,126);shadowGradient.addColorStop(0,'#010106');shadowGradient.addColorStop(.84,'#010106');shadowGradient.addColorStop(.88,'#22110b');shadowGradient.addColorStop(.9,'#ffddb1');shadowGradient.addColorStop(.93,'#a9642d99');shadowGradient.addColorStop(1,'#a9642d00');sc.fillStyle=shadowGradient;sc.fillRect(0,0,256,256);const shadow=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(shadowCanvas),transparent:true,depthTest:false,depthWrite:false}));shadow.scale.set(2.17,2.17,1);shadow.renderOrder=8;root.add(shadow);
  const positions=[],colors=[];for(let i=0;i<1200;i++){const r=1.12+Math.pow(random(),.8)*2.1,a=random()*Math.PI*2;positions.push(Math.cos(a)*r,(random()-.5)*.065,Math.sin(a)*r);const c=new T.Color().setHSL(.06+random()*.055,.65,.48+random()*.3);colors.push(c.r,c.g,c.b)}const orbit=particles(positions,colors,.055);
  updates.push(t=>{diskMaterial.uniforms.time.value=t;orbit.rotation.y=-t*.2});
 }else if(kind==='pulsar'){
  root.userData.radius=3.25;
  const star=mesh(new T.SphereGeometry(.4,48,32),new T.MeshStandardMaterial({color:0xdaf8ff,emissive:0x93d9ff,emissiveIntensity:2,roughness:.4}));halo(0x8dbfff,2.8,.4);halo(0xe1ffff,.95,.85);
  const spin=new T.Group();root.add(spin);const axis=new T.Group();axis.rotation.z=.47;spin.add(axis);
  const beamMat=new T.ShaderMaterial({transparent:true,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,uniforms:{fade:{value:1}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 v;uniform float fade;void main(){float q=pow(v.y,1.5);gl_FragColor=vec4(.3+.7*q,.65+.35*q,1.,q*.33*fade);}'});
  for(const sign of [-1,1]){const beam=mesh(new T.ConeGeometry(.5,3.1,40,1,true),beamMat,axis);beam.position.y=sign*1.85;beam.rotation.z=sign>0?Math.PI:0;const line=mesh(new T.CylinderGeometry(.018,.045,3.4,12),new T.MeshBasicMaterial({color:0xc2f4ff,transparent:true,opacity:.35,depthWrite:false}),axis);line.position.y=sign*1.85;}
  for(const sign of [-1,1])for(let k=0;k<3;k++){const points=[];for(let i=0;i<=90;i++){const a=i/90*Math.PI*2;points.push(new T.Vector3(sign*(.3+k*.14)*(1-Math.cos(a)),Math.sin(a)*(1.1+k*.34),Math.sin(a*2)*.08))}axis.add(new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0x5c9ed6,transparent:true,opacity:.14})))}
  updates.push(t=>{spin.rotation.y=t*.9;star.rotation.y=t*.2});root.rotation.z=-.24;
 }else if(kind==='nebula'){
  root.userData.radius=3.1;const clouds=new T.Group();root.add(clouds);
  for(let i=0;i<75;i++){const a=random()*Math.PI*2,r=Math.sqrt(random())*2.6,s=halo(i%3===0?0xc65ea8:i%3===1?0x518bcc:0x91c3ca,1+random()*1.7,.11+random()*.08,clouds);s.position.set(Math.cos(a)*r,Math.sin(a)*r*.65,(random()-.5)*2.5);s.userData.origin=s.position.clone();s.userData.phase=random()*6.28}
  const pos=[],colors=[];for(let i=0;i<900;i++){pos.push((random()-.5)*5.7,(random()-.5)*3.6,(random()-.5)*3);const c=new T.Color().setHSL(.58+random()*.15,.15,.7+random()*.25);colors.push(c.r,c.g,c.b)}particles(pos,colors,.035);
  for(let i=0;i<8;i++){const s=halo(0xd7eaff,.3,.8);s.position.set((random()-.5)*3.5,(random()-.5)*2,(random()-.5)*1.5)}
  updates.push(t=>{clouds.children.forEach(s=>{s.position.copy(s.userData.origin);s.position.x+=Math.sin(t*.055+s.userData.phase)*.09;s.position.y+=Math.cos(t*.04+s.userData.phase)*.06})});
 }else{
  root.userData.radius=3.1;
  const nucleus=mesh(new T.IcosahedronGeometry(.29,3),new T.MeshStandardMaterial({color:0x332e27,roughness:1,metalness:0}));const rockVertices=nucleus.geometry.attributes.position;for(let i=0;i<rockVertices.count;i++){const x=rockVertices.getX(i),y=rockVertices.getY(i),z=rockVertices.getZ(i),bump=1+Math.sin(x*39)*Math.cos(y*31)*.1+Math.sin(z*43)*.055;rockVertices.setXYZ(i,x*bump,y*bump,z*bump)}nucleus.geometry.computeVertexNormals();nucleus.scale.set(1,.77,.85);halo(0xbce9ed,1.4,.6);
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
