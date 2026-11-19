(() => {
'use strict';
const overlay=document.querySelector('#launch-intro'),canvas=overlay.querySelector('canvas'),ctx=canvas.getContext('2d'),skip=overlay.querySelector('button'),progress=overlay.querySelector('.launch-track i'),stage=overlay.querySelector('#launch-stage'),copy=overlay.querySelector('.launch-copy');
let width=innerWidth,height=innerHeight,finished=false,start=null,previous=0,frameId,seed=931;
const gentle=document.body.classList.contains('reduced'),duration=gentle?1600:4900;
const held=[...document.querySelectorAll('main,header,#nav,.quick-nav,.section-indicator,.sound-control,.motion-control')].map(el=>({el,inert:el.inert}));held.forEach(({el})=>el.inert=true);
function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
const points=Array.from({length:innerWidth<700?260:470},()=>({x:(random()-.5)*1.7,y:(random()-.5)*1.7,z:.04+random()*.96,size:.35+random()*.85,angle:random()*Math.PI*2,spread:.25+random()*.9}));
function resize(){width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio,1.5);canvas.width=width*ratio;canvas.height=height*ratio;ctx?.setTransform(ratio,0,0,ratio,0,0)}resize();addEventListener('resize',resize);
function glow(radius,alpha,color='161,197,244'){if(radius<1||alpha<=0)return;const g=ctx.createRadialGradient(width/2,height*.45,0,width/2,height*.45,radius);g.addColorStop(0,'rgba(236,244,255,'+alpha+')');g.addColorStop(.15,'rgba('+color+','+alpha*.7+')');g.addColorStop(.5,'rgba(85,125,213,'+alpha*.24+')');g.addColorStop(1,'rgba(16,28,65,0)');ctx.fillStyle=g;ctx.fillRect(0,0,width,height)}
function finish(){if(finished)return;finished=true;cancelAnimationFrame(frameId);clearTimeout(watchdog);removeEventListener('resize',resize);document.removeEventListener('keydown',onKey);held.forEach(({el,inert})=>el.inert=inert);document.body.classList.remove('is-intro');overlay.classList.add('launch-intro-out');
 const titles=[...document.querySelectorAll('.angle-title,.angle-detail')].filter(el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight});titles.forEach(el=>el.classList.remove('text-in'));requestAnimationFrame(()=>requestAnimationFrame(()=>titles.forEach(el=>el.classList.add('text-in'))));
 if(overlay.contains(document.activeElement))document.querySelector('header .wordmark').focus({preventScroll:true});setTimeout(()=>overlay.remove(),gentle?350:1000);
}
function onKey(event){if(event.key==='Escape'){event.preventDefault();finish()}else if(event.key==='Tab'){event.preventDefault();skip.focus()}}document.addEventListener('keydown',onKey);skip.onclick=finish;
const watchdog=setTimeout(finish,8500);
function draw(now){if(finished)return;if(document.hidden){previous=now;frameId=requestAnimationFrame(draw);return}if(start===null)start=now;const dt=Math.min((now-previous)/1000,.04)||.016;previous=now;const p=Math.min(1,(now-start)/duration),cx=width/2,cy=height*.45,D=Math.hypot(width,height);ctx.fillStyle='#03060d';ctx.fillRect(0,0,width,height);progress.style.width=Math.round(p*100)+'%';
 if(gentle){glow(Math.min(width,height)*.6,.2*Math.sin(p*Math.PI));stage.textContent='A UNIVERSE OF POSSIBILITIES';}
 else if(p<.67){const acceleration=Math.pow(p/.67,3),speed=.035+acceleration*2.5;stage.textContent=p<.2?'01 / FINDING THE FIRST LIGHT':p<.49?'02 / ACCELERATING INTO THE UNKNOWN':'03 / EVERYTHING, IN ONE MOMENT';copy.classList.toggle('is-burst',p>.55);
 for(const star of points){star.z-=speed*dt;if(star.z<.025)star.z+=1;const scale=Math.min(width,height)*.62,x=cx+star.x/star.z*scale,y=cy+star.y/star.z*scale,oldZ=star.z+speed*dt*(2+acceleration*7),ox=cx+star.x/oldZ*scale,oy=cy+star.y/oldZ*scale;if(x<0||x>width||y<0||y>height)continue;const a=.2+Math.min(.75,(1-star.z)*.8);ctx.strokeStyle='rgba(188,215,255,'+a+')';ctx.lineWidth=star.size*(.6+acceleration);ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(x,y);ctx.stroke();if(acceleration<.2){ctx.fillStyle='rgba(222,236,255,'+a+')';ctx.fillRect(x,y,star.size,star.size)}}glow(25+Math.pow(p/.67,5)*Math.min(width,height)*.24,.13+Math.pow(p/.67,4)*.55);
 }else{const burst=(p-.67)/.33,expansion=1-Math.pow(1-burst,3);copy.classList.remove('is-burst');copy.style.opacity=String(Math.min(1,burst*4));stage.textContent='04 / A UNIVERSE IS BORN';overlay.querySelector('.launch-copy p').innerHTML='And then, <em>everything.</em>';
 glow(45+expansion*D*.65,(1-burst)*.62,'190,218,239');const ringRadius=15+expansion*D*.55;ctx.strokeStyle='rgba(202,225,255,'+(1-burst)*.6+')';ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(cx,cy,ringRadius,ringRadius*.65,0,0,Math.PI*2);ctx.stroke();
 for(const star of points){const radius=expansion*D*.6*star.spread,x=cx+Math.cos(star.angle)*radius,y=cy+Math.sin(star.angle)*radius*.72;ctx.fillStyle='rgba(218,233,255,'+(1-burst*.8)*.7+')';ctx.beginPath();ctx.arc(x,y,star.size*(1+burst),0,Math.PI*2);ctx.fill()}}
 if(p>=1){finish();return}frameId=requestAnimationFrame(draw)}
if(ctx)frameId=requestAnimationFrame(draw);else finish();
})();
