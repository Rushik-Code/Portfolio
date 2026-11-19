(() => {
'use strict';
let lenis=null,scrollMode=null;
const reduced=()=>document.body.classList.contains('reduced');
function configureScroll(){const mode=String(reduced())+document.body.classList.contains('is-exploring')+document.body.classList.contains('is-intro')+document.body.classList.contains('is-travel')+document.body.classList.contains('is-destination');if(mode===scrollMode)return;scrollMode=mode;if(lenis){lenis.destroy();lenis=null}if(window.Lenis&&!reduced()){lenis=new Lenis({duration:1.15,easing:t=>1-Math.pow(1-t,4),smoothWheel:true,syncTouch:false,wheelMultiplier:.85,autoRaf:true});window.portfolioSmooth=true;if(document.body.classList.contains('is-exploring')||document.body.classList.contains('is-intro')||document.body.classList.contains('is-travel')||document.body.classList.contains('is-destination'))lenis.stop()}else window.portfolioSmooth=false;}
configureScroll();new MutationObserver(configureScroll).observe(document.body,{attributes:true,attributeFilter:['class']});
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const hash=link.getAttribute('href'),destination=document.getElementById(hash.slice(1));if(!destination)return;event.preventDefault();history.replaceState(null,'',hash);const focusTarget=destination.querySelector('h1,h2')||destination;const finish=()=>{focusTarget.setAttribute('tabindex','-1');focusTarget.focus({preventScroll:true})};if(lenis){lenis.scrollTo(destination,{offset:hash==='#home'?0:-90,duration:1.3,onComplete:finish})}else{destination.scrollIntoView({behavior:'instant'});finish()}}));
const header=document.querySelector('header'),sections=[...document.querySelectorAll('#home,#constellation,#about,#learning,#education')],navLinks=[...document.querySelectorAll('.quick-nav a,.section-indicator a')];let pending=false;
header.after(document.querySelector('.quick-nav'));
function update(){pending=false;header.classList.toggle('is-scrolled',scrollY>32);let active=sections[0].id;for(const section of sections){if(section.getBoundingClientRect().top<innerHeight*.4)active=section.id}navLinks.forEach(link=>{if(link.hash==='#'+active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);update();
// Small delays give section text a measured progression without hiding the content.
document.querySelectorAll('.universe-title,.star-link,.education-grid article').forEach((el,i)=>{el.classList.add('soft-reveal');el.style.setProperty('--stagger',`${i%3*85}ms`)});
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('arrived');observer.unobserve(entry.target)}}},{threshold:.12});document.querySelectorAll('.soft-reveal').forEach(el=>observer.observe(el));
})();
