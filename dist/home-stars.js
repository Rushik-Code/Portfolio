(() => {
'use strict';
const surfaces=new Map();let pointer={x:Infinity,y:Infinity},last=0;
function clearPointer(){pointer.x=pointer.y=Infinity}
function track(event){pointer.x=event.clientX;pointer.y=event.clientY}
addEventListener('pointermove',track,{passive:true});addEventListener('pointerdown',track,{passive:true});addEventListener('blur',clearPointer);document.addEventListener('pointerout',e=>{if(!e.relatedTarget)clearPointer()});
function mount(host){
 const old=surfaces.get(host);if(old?.canvas.isConnected)return;if(old)old.observer.disconnect();
 const canvas=document.createElement('canvas');canvas.className='section-reactive-stars';canvas.setAttribute('aria-hidden','true');host.classList.add('has-background-stars');host.prepend(canvas);const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return}
 const surface={host,canvas,ctx,width:0,height:0,stars:[],light:host.tagName==='FOOTER'};surfaces.set(host,surface);
 function resize(){const width=host.clientWidth,height=Math.max(host.clientHeight,host.scrollHeight);if(!width||!height)return;if(surface.width===width&&surface.height===height)return;surface.width=width;surface.height=height;const ratio=Math.min(devicePixelRatio,1.5);canvas.style.height=height+'px';canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);let seed=2026+[...surfaces.keys()].indexOf(host)*7919;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};surface.stars=Array.from({length:Math.round(Math.min(400,Math.max(65,width*height/5200)))},()=>({u:random(),v:random(),r:.45+random()*.85,phase:random()*6.28,depth:.6+random()*.6,x:0,y:0,vx:0,vy:0}))}
 surface.resize=resize;surface.observer=new ResizeObserver(resize);surface.observer.observe(host);resize();
}
document.querySelectorAll('main>section,footer').forEach(mount);
document.addEventListener('celestial:arrived',()=>requestAnimationFrame(()=>mount(document.querySelector('#destination-content'))));
addEventListener('resize',()=>surfaces.forEach(s=>s.resize()),{passive:true});
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.035)||.016;last=now;if(document.hidden||document.body.classList.contains('is-intro'))return;
 const reduced=document.body.classList.contains('reduced'),radius=innerWidth<700?90:125;
 for(const s of surfaces.values()){
 if(!s.canvas.isConnected)continue;const rect=s.canvas.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight||getComputedStyle(s.host).visibility==='hidden'||s.host.closest('[hidden]'))continue;
 const {ctx,width,height}=s;ctx.clearRect(0,0,width,height);const px=pointer.x-rect.left,py=pointer.y-rect.top;
 for(const star of s.stars){const baseX=star.u*width,baseY=star.v*height,dx=baseX+star.x-px,dy=baseY+star.y-py,dist=Math.hypot(dx,dy);let fx=0,fy=0;
 if(!reduced&&dist<radius){const force=(1-dist/radius)*2200*star.depth;fx=(dist>1?dx/dist:Math.cos(star.phase))*force;fy=(dist>1?dy/dist:Math.sin(star.phase))*force}
 if(reduced){star.x=star.y=star.vx=star.vy=0}else{star.vx+=(fx-star.x*19)*dt;star.vy+=(fy-star.y*19)*dt;star.vx*=Math.exp(-8*dt);star.vy*=Math.exp(-8*dt);star.x+=star.vx*dt;star.y+=star.vy*dt}
 const near=dist<radius,alpha=(.3+star.r*.15)*(reduced?1:.88+.12*Math.sin(now*.0008+star.phase));ctx.fillStyle=s.light?'rgba(30,66,63,'+alpha*.5+')':near?'rgba(224,246,181,'+alpha+')':'rgba(180,210,240,'+alpha+')';ctx.shadowColor=near?'#d7ed9c':'#9ac9ff';ctx.shadowBlur=s.light?0:3;ctx.beginPath();ctx.arc(baseX+star.x,baseY+star.y,star.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 }
 }
}requestAnimationFrame(frame);
})();
