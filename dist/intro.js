(() => {
'use strict';
const overlay=document.querySelector('#launch-intro'),canvas=overlay.querySelector('canvas'),ctx=canvas.getContext('2d'),skip=overlay.querySelector('button'),progress=overlay.querySelector('.launch-track i'),stage=overlay.querySelector('#launch-stage'),copy=overlay.querySelector('.launch-copy');
let width=innerWidth,height=innerHeight,finished=false,start=null,previous=0,frameId,seed=931;
const gentle=document.body.classList.contains('reduced'),duration=gentle?1600:4900;
const held=[...document.querySelectorAll('main,header,#nav,.quick-nav,.section-indicator,.sound-control,.motion-control')].map(el=>({el,inert:el.inert}));held.forEach(({el})=>el.inert=true);
function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
const points=Array.from({length:innerWidth<700?260:470},()=>({x:(random()-.5)*1.7,y:(random()-.5)*1.7,z:.04+random()*.96,size:.35+random()*.85,angle:random()*Math.PI*2,spread:.25+random()*.9}));

// Cached gas sprites keep the burst soft without blurring the entire frame.
const gasColors=['115,166,244','72,105,214','217,164,103','167,204,255'];
const gasSprites=gasColors.map(color=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba('+color+',.32)');r.addColorStop(.25,'rgba('+color+',.2)');r.addColorStop(.62,'rgba('+color+',.065)');r.addColorStop(1,'rgba('+color+',0)');g.fillStyle=r;g.fillRect(0,0,128,128);return c});
const gas=Array.from({length:innerWidth<700?45:75},()=>({angle:random()*Math.PI*2,radius:.2+random()*.8,size:.06+random()*.14,twist:(random()-.5)*.8,color:Math.floor(random()*gasSprites.length)}));
function drawExplosion(burst,cx,cy,D){
 const expansion=1-Math.pow(1-burst,3),afterglow=Math.pow(1-burst,1.35),flash=Math.exp(-burst*22);
 ctx.save();ctx.globalCompositeOperation='lighter';
 // One short white-hot ignition, then a warm core and cool expanding gas.
 glow(D*(.12+expansion*.55),afterglow*.48,'124,174,255');
 for(const cloud of gas){const angle=cloud.angle+cloud.twist*expansion,r=expansion*D*.49*cloud.radius,size=D*cloud.size*(.25+expansion*1.7);ctx.globalAlpha=Math.sin(Math.min(1,burst*5)*Math.PI*.5)*afterglow*.7;ctx.drawImage(gasSprites[cloud.color],cx+Math.cos(angle)*r-size/2,cy+Math.sin(angle)*r*.64-size/2,size,size)}
 ctx.globalAlpha=1;
 // Broad luminous shells, with a narrow bright rim rather than a flat circle.
 for(let shell=0;shell<3;shell++){const delayed=Math.max(0,burst-shell*.055),spread=1-Math.pow(1-delayed,2.6),radius=12+spread*D*(.61-shell*.065),a=Math.pow(1-burst,1.8)*(.32-shell*.07);ctx.save();ctx.translate(cx,cy);ctx.rotate(-.12);ctx.scale(1,.57+shell*.08);ctx.shadowColor=shell===0?'#9bcfff':'#e6ba81';ctx.shadowBlur=18;ctx.strokeStyle='rgba(156,206,255,'+a*.18+')';ctx.lineWidth=14-shell*3;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='rgba(219,235,255,'+a+')';ctx.lineWidth=1.3;ctx.stroke();ctx.restore()}
 // Depth-varying fragments streak outward, slow down, and cool as they fade.
 for(const star of points){const distance=expansion*D*.7*star.spread,angle=star.angle+Math.sin(star.angle*3)*burst*.06,x=cx+Math.cos(angle)*distance,y=cy+Math.sin(angle)*distance*.72,tail=(1-burst)*D*.022*star.spread;ctx.strokeStyle='rgba(202,224,255,'+afterglow*(.25+star.spread*.5)+')';ctx.lineWidth=star.size*(1.3-burst*.5);ctx.beginPath();ctx.moveTo(x-Math.cos(angle)*tail,y-Math.sin(angle)*tail*.72);ctx.lineTo(x,y);ctx.stroke()}
 const core=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(1,D*(.025+burst*.13)));core.addColorStop(0,'rgba(255,248,225,'+afterglow*.9+')');core.addColorStop(.16,'rgba(255,200,126,'+afterglow*.55+')');core.addColorStop(.45,'rgba(120,173,255,'+afterglow*.2+')');core.addColorStop(1,'rgba(70,115,210,0)');ctx.fillStyle=core;ctx.fillRect(0,0,width,height);
 const flareWidth=D*(.11+expansion*.7),flare=ctx.createLinearGradient(cx-flareWidth,0,cx+flareWidth,0);flare.addColorStop(0,'rgba(130,185,255,0)');flare.addColorStop(.48,'rgba(170,207,255,'+afterglow*.14+')');flare.addColorStop(.5,'rgba(255,244,215,'+afterglow*.75+')');flare.addColorStop(.52,'rgba(170,207,255,'+afterglow*.14+')');flare.addColorStop(1,'rgba(130,185,255,0)');ctx.fillStyle=flare;ctx.fillRect(cx-flareWidth,cy-1.3,flareWidth*2,2.6);
 ctx.restore();ctx.fillStyle='rgba(225,237,255,'+flash*.78+')';ctx.fillRect(0,0,width,height);
}

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
 overlay.dataset.phase='burst';drawExplosion(burst,cx,cy,D);}
 if(p>=1){finish();return}frameId=requestAnimationFrame(draw)}
if(ctx)frameId=requestAnimationFrame(draw);else finish();
})();
