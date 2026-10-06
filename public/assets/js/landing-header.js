function initShrinkingHeader(){
const header=document.querySelector('.site-header');
const spacer=document.createElement('div');spacer.className='header-spacer';spacer.setAttribute('aria-hidden','true');header.before(spacer);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let progress=0,frame=0;
function paint(value){
const mobile=window.innerWidth<=700;
const title=Math.min(54,Math.max(30,window.innerWidth*.05));
const lerp=(a,b)=>a+(b-a)*value;
header.style.setProperty('--header-padding',lerp(mobile?14:18,mobile?8:9)+'px');
header.style.setProperty('--header-logo',lerp(mobile?56:68,mobile?40:44)+'px');
header.style.setProperty('--header-title',lerp(title,mobile?22:28)+'px');
header.style.setProperty('--header-brand-gap',lerp(17,10)+'px');
header.style.setProperty('--header-gap',lerp(mobile?25:25,mobile?8:16)+'px');
header.style.setProperty('--header-subtitle',lerp(11,9)+'px');
header.style.setProperty('--header-legend',lerp(12,10)+'px');
header.classList.toggle('is-compact',value>.05);
document.documentElement.style.setProperty('--sticky-header-height',header.getBoundingClientRect().height+'px');
}
function measure(){paint(0);spacer.style.height=header.getBoundingClientRect().height+'px';paint(progress);}
function animate(){
const target=Math.min(1,Math.max(0,window.scrollY/420));
progress=reduced.matches?target:progress+(target-progress)*.2;
if(Math.abs(target-progress)<.001)progress=target;
paint(progress);
if(progress!==target)frame=requestAnimationFrame(animate);else frame=0;
}
function schedule(){if(!frame)frame=requestAnimationFrame(animate);}
measure();schedule();
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',()=>{measure();schedule();});
reduced.addEventListener('change',schedule);
if(document.fonts)document.fonts.ready.then(()=>{measure();schedule();});
}
initShrinkingHeader();