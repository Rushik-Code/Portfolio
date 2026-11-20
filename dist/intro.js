(() => {
'use strict';
const overlay=document.querySelector('#launch-intro'),canvas=overlay.querySelector('canvas'),ctx=canvas.getContext('2d'),skip=overlay.querySelector('button'),progress=overlay.querySelector('.launch-track i'),stage=overlay.querySelector('#launch-stage'),copy=overlay.querySelector('.launch-copy');
let width=innerWidth,height=innerHeight,finished=false,revealing=false,start=null,previous=0,frameId,seed=931;
const gentle=document.body.classList.contains('reduced'),duration=gentle?1600:4900;
const held=[...document.querySelectorAll('main,header,#nav,.quick-nav,.section-indicator,.sound-control,.motion-control,#star-map-launch,#scope-return')].map(el=>({el,inert:el.inert}));held.forEach(({el})=>el.inert=true);
function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
const points=Array.from({length:innerWidth<700?260:470},()=>({x:(random()-.5)*1.7,y:(random()-.5)*1.7,z:.04+random()*.96,size:.35+random()*.85,angle:random()*Math.PI*2,spread:.25+random()*.9}));

// Turbulent gas textures are baked once; expansion only moves cached sprites.
const gasColors=[[178,201,242],[84,123,188],[224,164,102],[140,169,219]];
function hash(x,y){let n=Math.imul(x,374761393)+Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295}
function noise(x,y){const ix=Math.floor(x),iy=Math.floor(y);let u=x-ix,v=y-iy;u=u*u*(3-2*u);v=v*v*(3-2*v);return (hash(ix,iy)*(1-u)+hash(ix+1,iy)*u)*(1-v)+(hash(ix,iy+1)*(1-u)+hash(ix+1,iy+1)*u)*v}
const gasSprites=gasColors.map((color,index)=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),pixels=g.createImageData(128,128);for(let y=0;y<128;y++)for(let x=0;x<128;x++){const nx=(x-64)/64,ny=(y-64)/64,r=Math.hypot(nx,ny),cloud=noise(x/23+index*9,y/23)*.58+noise(x/11,y/11+index*4)*.28+noise(x/5,y/5)*.14,density=Math.pow(Math.max(0,1-r*r),2)*Math.max(0,cloud-.22)*1.6,k=(y*128+x)*4;pixels.data[k]=color[0];pixels.data[k+1]=color[1];pixels.data[k+2]=color[2];pixels.data[k+3]=Math.min(255,density*210)}g.putImageData(pixels,0,0);return c});
const gas=Array.from({length:innerWidth<700?60:100},()=>{const angle=random()*Math.PI*2,depth=(random()-.5)*1.6;return {angle,depth,radius:.2+random()*.8,size:.06+random()*.13,twist:(random()-.5)*.35,color:Math.floor(random()*gasSprites.length),phase:random()*6.28}});
function drawExplosion(burst,cx,cy,D){
 const expansion=1-Math.exp(-burst*4),fade=Math.pow(1-burst,1.25),ignition=Math.exp(-burst*18);
 ctx.save();ctx.globalCompositeOperation='lighter';glow(D*(.045+expansion*.42),fade*.32,'166,194,239');
 for(const cloud of gas){const angle=cloud.angle+cloud.twist*burst,r=expansion*D*.56*cloud.radius,perspective=1/(1-cloud.depth*.23*expansion),x=cx+Math.cos(angle)*r*perspective,y=cy+Math.sin(angle)*r*.8*perspective,size=D*cloud.size*(.35+expansion*1.8)*perspective;ctx.globalAlpha=Math.min(1,burst*12)*fade*(cloud.depth>.2?.5:.7);ctx.save();ctx.translate(x,y);ctx.rotate(angle+cloud.phase);ctx.drawImage(gasSprites[cloud.color],-size/2,-size*.42,size,size*.84);ctx.restore()}
 ctx.globalAlpha=1;
 // An irregular, cooling shock front replaces the diagram-like concentric rings.
 const shockRadius=8+expansion*D*.59;for(let layer=0;layer<2;layer++){ctx.beginPath();for(let i=0;i<=128;i++){const a=i/128*Math.PI*2,r=shockRadius*(1+Math.sin(a*7+burst*.6)*.015+Math.sin(a*13)*.009);const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*.8;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.strokeStyle='rgba(170,202,241,'+fade*(layer?.12:.035)+')';ctx.lineWidth=layer?1:12;ctx.stroke()}
 for(const star of points){const radius=expansion*D*.67*star.spread,x=cx+Math.cos(star.angle)*radius,y=cy+Math.sin(star.angle)*radius*.8,tail=D*.009*fade*star.spread;ctx.strokeStyle='rgba(220,228,237,'+fade*.35+')';ctx.lineWidth=star.size*.7;ctx.beginPath();ctx.moveTo(x-Math.cos(star.angle)*tail,y-Math.sin(star.angle)*tail*.8);ctx.lineTo(x,y);ctx.stroke()}
 const coreRadius=Math.max(1,D*(.018+burst*.085)),core=ctx.createRadialGradient(cx,cy,0,cx,cy,coreRadius);core.addColorStop(0,'rgba(255,248,225,'+fade*.95+')');core.addColorStop(.12,'rgba(255,218,163,'+fade*.7+')');core.addColorStop(.38,'rgba(174,195,230,'+fade*.22+')');core.addColorStop(1,'rgba(80,110,175,0)');ctx.fillStyle=core;ctx.fillRect(0,0,width,height);ctx.restore();
 ctx.fillStyle='rgba(230,238,249,'+ignition*.45+')';ctx.fillRect(0,0,width,height);
}
function beginReveal(){if(revealing)return;revealing=true;document.body.classList.remove('is-intro');document.body.classList.add('is-intro-reveal');overlay.dataset.phase='revealing';const titles=[...document.querySelectorAll('.angle-title,.angle-detail')].filter(el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight});titles.forEach(el=>el.classList.remove('text-in'));requestAnimationFrame(()=>requestAnimationFrame(()=>titles.forEach(el=>el.classList.add('text-in'))))}

function resize(){width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio,1.5);canvas.width=width*ratio;canvas.height=height*ratio;ctx?.setTransform(ratio,0,0,ratio,0,0)}resize();addEventListener('resize',resize);
function glow(radius,alpha,color='161,197,244'){if(radius<1||alpha<=0)return;const g=ctx.createRadialGradient(width/2,height*.45,0,width/2,height*.45,radius);g.addColorStop(0,'rgba(236,244,255,'+alpha+')');g.addColorStop(.15,'rgba('+color+','+alpha*.7+')');g.addColorStop(.5,'rgba(85,125,213,'+alpha*.24+')');g.addColorStop(1,'rgba(16,28,65,0)');ctx.fillStyle=g;ctx.fillRect(0,0,width,height)}
function finish(){if(finished)return;beginReveal();finished=true;cancelAnimationFrame(frameId);clearTimeout(watchdog);removeEventListener('resize',resize);document.removeEventListener('keydown',onKey);held.forEach(({el,inert})=>el.inert=inert);document.body.classList.remove('is-intro','is-intro-reveal');overlay.style.opacity='0';overlay.classList.add('launch-intro-out');if(overlay.contains(document.activeElement))document.querySelector('header .wordmark').focus({preventScroll:true});setTimeout(()=>overlay.remove(),gentle?350:900)}

function onKey(event){if(event.key==='Escape'){event.preventDefault();finish()}else if(event.key==='Tab'){event.preventDefault();skip.focus()}}document.addEventListener('keydown',onKey);skip.onclick=finish;
const watchdog=setTimeout(finish,8500);
function draw(now){if(finished)return;if(document.hidden){previous=now;frameId=requestAnimationFrame(draw);return}if(start===null)start=now;const dt=Math.min((now-previous)/1000,.04)||.016;previous=now;const p=Math.min(1,(now-start)/duration),cx=width/2,cy=height*.45,D=Math.hypot(width,height);ctx.fillStyle='#03060d';ctx.fillRect(0,0,width,height);progress.style.width=Math.round(p*100)+'%';
 if(gentle){glow(Math.min(width,height)*.6,.2*Math.sin(p*Math.PI));stage.textContent='A UNIVERSE OF POSSIBILITIES';}
 else if(p<.67){const acceleration=Math.pow(p/.67,3),speed=.035+acceleration*2.5;stage.textContent=p<.2?'01 / FINDING THE FIRST LIGHT':p<.49?'02 / ACCELERATING INTO THE UNKNOWN':'03 / EVERYTHING, IN ONE MOMENT';copy.classList.toggle('is-burst',p>.55);
 for(const star of points){star.z-=speed*dt;if(star.z<.025)star.z+=1;const scale=Math.min(width,height)*.62,x=cx+star.x/star.z*scale,y=cy+star.y/star.z*scale,oldZ=star.z+speed*dt*(2+acceleration*7),ox=cx+star.x/oldZ*scale,oy=cy+star.y/oldZ*scale;if(x<0||x>width||y<0||y>height)continue;const a=.2+Math.min(.75,(1-star.z)*.8);ctx.strokeStyle='rgba(188,215,255,'+a+')';ctx.lineWidth=star.size*(.6+acceleration);ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(x,y);ctx.stroke();if(acceleration<.2){ctx.fillStyle='rgba(222,236,255,'+a+')';ctx.fillRect(x,y,star.size,star.size)}}glow(25+Math.pow(p/.67,5)*Math.min(width,height)*.24,.13+Math.pow(p/.67,4)*.55);
 }else{const burst=(p-.67)/.33,expansion=1-Math.pow(1-burst,3);copy.classList.remove('is-burst');copy.style.opacity=String(Math.min(1,burst*4));stage.textContent='04 / A UNIVERSE IS BORN';overlay.querySelector('.launch-copy p').innerHTML='And then, <em>everything.</em>';
 if(!revealing)overlay.dataset.phase='burst';drawExplosion(burst,cx,cy,D);if(burst>.38){beginReveal();const reveal=Math.min(1,(burst-.38)/.62),smooth=reveal*reveal*(3-2*reveal);overlay.style.opacity=String(1-smooth);copy.style.opacity=String(1-Math.min(1,reveal*1.8))}}
 if(p>=1){finish();return}frameId=requestAnimationFrame(draw)}
if(ctx)frameId=requestAnimationFrame(draw);else finish();
})();
