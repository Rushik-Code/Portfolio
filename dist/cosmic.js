(() => {
'use strict';
const objects=[...document.querySelectorAll('.cosmic-object')].map(canvas=>({canvas,ctx:canvas.getContext('2d'),kind:canvas.dataset.object,visible:false}));
const observer=new IntersectionObserver(entries=>{for(const e of entries){const item=objects.find(o=>o.canvas===e.target);item.visible=e.isIntersecting}},{rootMargin:'150px'});objects.forEach(o=>observer.observe(o.canvas));
let seed=87;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}const dust=Array.from({length:340},()=>({a:random()*Math.PI*2,r:random(),s:random(),p:random()*6.28}));
function glow(ctx,x,y,r,stops){const g=ctx.createRadialGradient(x,y,0,x,y,r);stops.forEach(([p,c])=>g.addColorStop(p,c));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function blackhole(c,t){
 glow(c,0,0,175,[[0,'#ffbd6a22'],[.4,'#c8753618'],[1,'#00000000']]);
 c.save();c.rotate(-.22);
 // An edge-on accretion disk and the gravitationally lensed rear arc.
 c.save();c.scale(1,.27);for(let i=0;i<45;i++){const r=61+i*1.75;c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.strokeStyle=`rgba(255,${Math.round(220-i*2.7)},${Math.round(150-i*2.4)},${.5-i*.009})`;c.lineWidth=1.8;c.stroke()}c.restore();
 c.save();c.shadowBlur=18;c.shadowColor='#ffb34e';for(let i=0;i<12;i++){c.beginPath();c.ellipse(0,-2,65+i*.55,60+i*.6,0,Math.PI,Math.PI*2);c.strokeStyle=`rgba(255,${225-i*6},${175-i*10},${.3-i*.017})`;c.lineWidth=2;c.stroke()}c.restore();
 const horizon=c.createRadialGradient(-5,-5,32,0,0,58);horizon.addColorStop(0,'#010208');horizon.addColorStop(.87,'#010208');horizon.addColorStop(.96,'#391b14');horizon.addColorStop(1,'#ffcb85');c.fillStyle=horizon;c.beginPath();c.arc(0,0,58,0,Math.PI*2);c.fill();
 c.save();c.shadowBlur=8;c.shadowColor='#ffce89';c.beginPath();c.ellipse(0,12,125,12,0,0,Math.PI);c.strokeStyle='#ffe3ad';c.lineWidth=2.3;c.stroke();c.restore();
 for(const p of dust.slice(0,100)){const a=p.a+t*.1,r=76+p.r*60,x=Math.cos(a)*r,y=Math.sin(a)*r*.27;if(y<0&&Math.abs(x)<59)continue;c.fillStyle=`rgba(255,210,147,${p.s*.6})`;c.fillRect(x,y,p.s*1.8+.3,.8)}c.restore();
}
function pulsar(c,t){
 c.save();c.rotate(-.55+t*1.5);
 // Twin polar beams emerge from a compact neutron star.
 for(const sign of [-1,1]){const g=c.createLinearGradient(0,sign*14,0,sign*165);g.addColorStop(0,'#e1fbffb0');g.addColorStop(.18,'#74cfff70');g.addColorStop(1,'#386fff00');c.fillStyle=g;c.beginPath();c.moveTo(-5,sign*10);c.lineTo(-31,sign*165);c.quadraticCurveTo(0,sign*190,31,sign*165);c.lineTo(5,sign*10);c.closePath();c.fill();c.strokeStyle='#baf6ff88';c.lineWidth=1.2;c.beginPath();c.moveTo(0,sign*12);c.lineTo(0,sign*145);c.stroke()}
 for(const sign of [-1,1])for(let i=0;i<5;i++){c.beginPath();c.ellipse(sign*(24+i*7),0,32+i*9,62+i*10,sign*.25,0,Math.PI*2);c.strokeStyle=`rgba(93,169,255,${.14-i*.022})`;c.lineWidth=1;c.stroke()}
 const pulse=.9+.1*Math.sin(t*3);glow(c,0,0,82*pulse,[[0,'#f3fffff0'],[.1,'#b7f3ffcc'],[.25,'#66bfff55'],[1,'#428dff00']]);glow(c,0,0,16,[[0,'#ffffff'],[.45,'#f1ffff'],[.8,'#a3e8ff'],[1,'#4c98d900']]);c.restore();
}
function nebula(c,t){
 c.save();c.rotate(-.4+t*.008);for(let i=0;i<70;i++){const p=dust[i],a=p.a,r=25+p.r*85,x=Math.cos(a)*r,y=Math.sin(a)*r*.56;glow(c,x,y,25+p.s*36,[[0,i%3===0?'#e5a3cf20':'#77bfdb18'],[.45,i%3===0?'#b15caa18':'#456bca13'],[1,'#00000000']])}
 c.globalCompositeOperation='destination-out';for(let i=0;i<8;i++)glow(c,-70+i*18,Math.sin(i*.7)*14,20,[[0,'#00000066'],[1,'#00000000']]);c.globalCompositeOperation='source-over';
 for(const p of dust){const x=Math.cos(p.a)*p.r*137,y=Math.sin(p.a)*p.r*90,r=.4+p.s*1.1;c.fillStyle=`rgba(220,234,255,${.25+p.s*.7})`;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
 for(const p of dust.slice(0,7)){const x=Math.cos(p.a)*p.r*90,y=Math.sin(p.a)*p.r*65;glow(c,x,y,9,[[0,'#ffffff'],[.12,'#c5e9ffcc'],[1,'#80b7ff00']])}c.restore();
}
function comet(c,t){c.save();c.rotate(-.55);for(let i=0;i<18;i++){const x=20+i*7,y=-10-i*.8;glow(c,x,y,16+i*1.8,[[0,'rgba(108,224,217,'+(.18-i*.008)+')'],[1,'#65cce000']])}c.save();c.scale(1,.36);glow(c,45,-10,125,[[0,'#c9f5e744'],[.4,'#91dfe22a'],[1,'#6cdbf000']]);c.restore();glow(c,-55,0,42,[[0,'#ffffff'],[.08,'#ffffff'],[.22,'#d7fffccc'],[.5,'#9aebe25a'],[1,'#77cfdd00']]);c.strokeStyle='#d8fff9aa';c.lineWidth=1;c.beginPath();c.moveTo(-72,0);c.lineTo(-38,0);c.moveTo(-55,-17);c.lineTo(-55,17);c.stroke();for(const p of dust.slice(0,55)){const x=10+p.r*125,y=Math.sin(p.a+t*.3)*p.r*15;c.fillStyle='rgba(186,245,242,'+p.s*.5+')';c.fillRect(x,y,1,1)}c.restore();}

function astronaut(c,t){c.save();c.translate(0,Math.sin(t*.7)*4);c.rotate(-.12);glow(c,0,0,145,[[0,'#91c6d01b'],[1,'#00000000']]);c.lineCap='round';function limb(x,y,x2,y2,w){c.strokeStyle='#263d50';c.lineWidth=w+5;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();c.strokeStyle='#c1d2dc';c.lineWidth=w;c.stroke()}
limb(-18,30,-25,97,22);limb(18,30,27,97,22);limb(-28,-20,-63,-3,19);limb(-63,-3,-67,-57,16);limb(28,-20,54,27,19);c.fillStyle='#c5d5dd';c.beginPath();c.roundRect(-32,-40,64,91,25);c.fill();c.fillStyle='#253d51';c.fillRect(-17,-21,34,28);c.fillStyle='#91d3c0';c.fillRect(-11,-16,22,10);
const helmet=c.createRadialGradient(-11,-85,1,0,-72,45);helmet.addColorStop(0,'#f5f7ec');helmet.addColorStop(1,'#90a8b9');c.fillStyle=helmet;c.beginPath();c.arc(0,-71,43,0,Math.PI*2);c.fill();c.fillStyle='#263b50';c.beginPath();c.ellipse(3,-68,34,30,0,0,Math.PI*2);c.fill();const visor=c.createLinearGradient(-23,-90,28,-45);visor.addColorStop(0,'#eadb9b');visor.addColorStop(.35,'#99845b');visor.addColorStop(1,'#211f25');c.fillStyle=visor;c.beginPath();c.ellipse(5,-68,29,25,0,0,Math.PI*2);c.fill();c.fillStyle='#243f53';c.fillRect(-78,-83,22,34);c.strokeStyle='#9fd8d5';c.lineWidth=2;c.beginPath();c.moveTo(-67,-83);c.lineTo(-67,-109);c.stroke();for(let i=0;i<3;i++){const phase=(t*.45+i/3)%1;c.strokeStyle='rgba(168,225,222,'+(1-phase)*.5+')';c.lineWidth=1;c.beginPath();c.arc(-67,-110,8+phase*37,-2.5,-.3);c.stroke()}c.restore()}

window.paintCosmicObject=(ctx,kind,time)=>{ctx.clearRect(0,0,420,420);ctx.save();ctx.translate(210,210);({blackhole,pulsar,comet,astronaut})[kind](ctx,time);ctx.restore()};
let last=0;function frame(now){requestAnimationFrame(frame);if(document.hidden||now-last<40)return;last=now;const reduced=document.body.classList.contains('reduced'),t=reduced?0:now/1000;for(const o of objects){if(!o.visible)continue;const c=o.ctx;c.clearRect(0,0,420,420);c.save();c.translate(210,210);({blackhole,pulsar,comet,astronaut})[o.kind](c,t);c.restore()}}requestAnimationFrame(frame);
const contact=document.querySelector('#cosmic-contact');document.querySelector('#contact-object').onclick=()=>contact.showModal();contact.querySelector('.contact-close').onclick=()=>contact.close();contact.addEventListener('click',e=>{const r=contact.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)contact.close()});
})();
