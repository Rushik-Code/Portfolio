(() => {
'use strict';
const map=document.querySelector('.star-map'),svg=map?.querySelector('.constellation-route');if(!svg)return;
const objects=[...map.querySelectorAll('.star-link .cosmic-art')],paths=[...svg.querySelectorAll('path')];let previous='';
function draw(){requestAnimationFrame(draw);if(document.hidden)return;const box=map.getBoundingClientRect();if(box.bottom<0||box.top>innerHeight||!box.width)return;const points=objects.map(object=>{const r=object.getBoundingClientRect();return {x:r.left+r.width/2-box.left,y:r.top+r.height/2-box.top,r:Math.min(r.width,r.height)*.25}});const signature=JSON.stringify(points)+box.width+box.height;if(signature===previous)return;previous=signature;svg.setAttribute('viewBox','0 0 '+box.width+' '+box.height);
paths.forEach((path,i)=>{const a=points[i],b=points[i+1],dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy),ux=dx/Math.max(1,length),uy=dy/Math.max(1,length),start=Math.min(a.r,length*.3),end=Math.min(b.r,length*.3);path.setAttribute('d','M '+(a.x+ux*start).toFixed(1)+' '+(a.y+uy*start).toFixed(1)+' L '+(b.x-ux*end).toFixed(1)+' '+(b.y-uy*end).toFixed(1))});
}requestAnimationFrame(draw);
})();
