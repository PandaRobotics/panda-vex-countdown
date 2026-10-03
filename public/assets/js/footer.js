(() => {
const footer=document.querySelector('.panda-footer');if(!footer)return;
footer.querySelector('.footer-details').inert=false;
const dock=document.createElement('div');dock.className='footer-dock';dock.innerHTML=footer.querySelector('.footer-bar').outerHTML;dock.setAttribute('aria-label','Panda Robotics · Liên hệ');document.body.append(dock);
function alignFanpage(){
 const contact=footer.querySelector('.footer-contact'),panel=footer.querySelector('.footer-fanpage'),embed=panel?.querySelector('iframe');if(!contact||!embed)return;
 if(innerWidth<=1000){embed.style.height='340px';const url=new URL(embed.src);if(url.searchParams.get('height')!=='340'){url.searchParams.set('height','340');embed.src=url.href;}return;}
 const address=contact.querySelector('p');
 const height=Math.max(340,Math.round(address.getBoundingClientRect().bottom-embed.getBoundingClientRect().top)+24);
 embed.style.height=height+'px';
 const url=new URL(embed.src);if(url.searchParams.get('height')!==String(height)){url.searchParams.set('height',height);embed.src=url.href;}
}
new ResizeObserver(alignFanpage).observe(footer.querySelector('.footer-contact'));
addEventListener('resize',alignFanpage);if(document.fonts)document.fonts.ready.then(alignFanpage);alignFanpage();
let frame=0;function update(){frame=0;const barHeight=dock.getBoundingClientRect().height;const handedOff=footer.getBoundingClientRect().top<=innerHeight-barHeight;dock.classList.toggle('is-handed-off',handedOff);dock.inert=handedOff;dock.setAttribute('aria-hidden',String(handedOff));document.body.classList.toggle('footer-is-pinned',!handedOff);}
function schedule(){if(!frame)frame=requestAnimationFrame(update);}addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);if(document.fonts)document.fonts.ready.then(schedule);update();
})();
