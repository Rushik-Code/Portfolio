(() => {
'use strict';
const directions=[[-28,42,-6,30],[35,32,5,-24],[-12,52,-3,15],[27,38,4,-22],[0,45,0,0]];
const targets=[];
document.querySelectorAll('h1,h2').forEach((heading,index)=>{
 heading.setAttribute('aria-label',heading.innerText.replace(/\s+/g,' ').trim());
 heading.classList.add('angle-title');
 const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 let wordIndex=0;
 nodes.forEach(node=>{const fragment=document.createDocumentFragment();for(const chunk of node.textContent.split(/(\s+)/)){if(!chunk)continue;if(/^\s+$/.test(chunk)){fragment.append(document.createTextNode(chunk));continue}const word=document.createElement('span');word.className='angle-word';word.textContent=chunk;word.setAttribute('aria-hidden','true');const d=directions[(index+wordIndex)%directions.length];word.style.setProperty('--entry-x',d[0]+'px');word.style.setProperty('--entry-y',d[1]+'px');word.style.setProperty('--entry-z',d[2]+'deg');word.style.setProperty('--entry-turn',d[3]+'deg');word.style.setProperty('--word-delay',Math.min(wordIndex*75,375)+'ms');fragment.append(word);wordIndex++}node.replaceWith(fragment)});
 targets.push(heading);
 });
document.querySelectorAll('.chapter-body>p,.chapter-body>.eyebrow,.education-top>p,.score,.degree,.star-link>strong,.star-link>.star-description').forEach((el,index)=>{el.classList.add('angle-detail');el.style.setProperty('--detail-x',(index%2===0?-24:24)+'px');el.style.setProperty('--detail-angle',(index%2===0?-2:2)+'deg');el.style.setProperty('--detail-delay',(index%3*80)+'ms');targets.push(el)});
// Keep observing: leaving the viewport resets the entrance for the next visit.
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>=.12)entry.target.classList.add('text-in');else if(!entry.isIntersecting)entry.target.classList.remove('text-in')}},{threshold:[0,.12],rootMargin:'0px'});targets.forEach(el=>observer.observe(el));
// Observe stable layout parents so the animated movement cannot retrigger itself.
const groups=new Map();
document.querySelectorAll('.chapter-body,.education-grid article,.cosmic-art,.orbit-status,.hero-actions,.text-link,.chapter-meta').forEach((el,index)=>{
 el.classList.add('ui-pop');const side=index%4;el.dataset.entrance=['left','right','below','right'][side];el.style.setProperty('--ui-delay',(index%3*75)+'ms');
 const trigger=el.parentElement;if(!groups.has(trigger))groups.set(trigger,[]);groups.get(trigger).push(el);
});
const uiObserver=new IntersectionObserver(entries=>{for(const entry of entries){const children=groups.get(entry.target);if(entry.isIntersecting&&entry.intersectionRatio>=.1)children.forEach(el=>el.classList.add('ui-in'));else if(!entry.isIntersecting)children.forEach(el=>el.classList.remove('ui-in'))}},{threshold:[0,.1]});groups.forEach((_,trigger)=>uiObserver.observe(trigger));
})();
