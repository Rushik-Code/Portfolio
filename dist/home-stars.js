(() => {
'use strict';
const canvas=document.createElement('canvas');canvas.className='page-reactive-stars';canvas.setAttribute('aria-hidden','true');Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'11'});document.body.prepend(canvas);
const ctx=canvas.getContext('2d');let width=0,height=0,stars=[],pointer={x:Infinity,y:Infinity},last=0,seed=2026;
function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
function resize(){width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio,1.7);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);seed=2026;stars=Array.from({length:Math.round(Math.min(155,Math.max(65,width*height/6500)))},()=>({u:random(),v:random(),r:.55+random()*1.1,phase:random()*6.28,depth:.6+random()*.6,x:0,y:0,vx:0,vy:0}))}
addEventListener('resize',resize,{passive:true});resize();

function track(event){pointer.x=event.clientX;pointer.y=event.clientY;if(pointer.x<0||pointer.x>width||pointer.y<0||pointer.y>height)pointer.x=pointer.y=Infinity}
addEventListener('pointermove',track,{passive:true});addEventListener('pointerdown',track,{passive:true});document.addEventListener('pointerout',event=>{if(!event.relatedTarget)pointer.x=pointer.y=Infinity});addEventListener('blur',()=>pointer.x=pointer.y=Infinity);
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.035)||.016;last=now;if(document.hidden)return;ctx.clearRect(0,0,width,height);const reduced=document.body.classList.contains('reduced'),radius=width<700?90:125,footer=document.querySelector('footer').getBoundingClientRect(),pageOffset=document.body.classList.contains('is-exploring')?0:scrollY;
for(const star of stars){const baseX=star.u*width,baseY=((star.v*height-pageOffset*.045*star.depth)%height+height)%height,dx=baseX+star.x-pointer.x,dy=baseY+star.y-pointer.y,dist=Math.hypot(dx,dy);let forceX=0,forceY=0;if(!reduced&&dist<radius){const force=(1-dist/radius)*2200*star.depth;forceX=(dist>1?dx/dist:Math.cos(star.phase))*force;forceY=(dist>1?dy/dist:Math.sin(star.phase))*force}
if(reduced){star.x=star.y=star.vx=star.vy=0}else{star.vx+=(forceX-star.x*19)*dt;star.vy+=(forceY-star.y*19)*dt;star.vx*=Math.exp(-8*dt);star.vy*=Math.exp(-8*dt);star.x+=star.vx*dt;star.y+=star.vy*dt}
const x=baseX+star.x,y=baseY+star.y,near=dist<radius,alpha=(.42+star.r*.2)*(reduced?1:.88+.12*Math.sin(now*.0008+star.phase));const onLight=y>=footer.top&&y<=footer.bottom&&!document.body.classList.contains('is-exploring');ctx.fillStyle=onLight?'rgba(30,66,63,'+alpha*.5+')':near?'rgba(224,246,181,'+alpha+')':'rgba(204,224,248,'+alpha+')';ctx.shadowColor=near?'#d7ed9c':'#9ac9ff';ctx.shadowBlur=onLight?0:star.r>1.3?7:3;ctx.beginPath();ctx.arc(x,y,star.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
if(star.r>1.5){ctx.strokeStyle=onLight?'rgba(30,66,63,'+alpha*.2+')':'rgba(213,235,249,'+alpha*.3+')';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.stroke()}}
}requestAnimationFrame(frame);
})();
