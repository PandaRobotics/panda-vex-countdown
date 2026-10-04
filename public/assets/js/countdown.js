let DATA={events:[],deadlines:[]},filter="all";
const $=s=>document.querySelector(s),pad=n=>String(n).padStart(2,"0");
const fmtDate=d=>new Intl.DateTimeFormat("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date(d));
function parts(ms){if(ms<=0)return null;let s=Math.floor(ms/1000);return{d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),s:s%60}}
function clockHTML(ms,target){let t=parts(ms);return `<div class="countdown" data-countdown data-target="${target}">${t?unitHTML(t):'<div class="unit"><b>00</b><small>ĐÃ ĐẾN HẠN</small></div>'}</div>`}
function unitHTML(t){return `<div class="unit"><b>${t.d}</b><small>NGÀY</small></div><div class="unit"><b>${pad(t.h)}</b><small>GIỜ</small></div><div class="unit"><b>${pad(t.m)}</b><small>PHÚT</small></div><div class="unit"><b>${pad(t.s)}</b><small>GIÂY</small></div>`}
function eventRange(e){return e.endDate?`${fmtDate(e.date)} – ${fmtDate(e.endDate)}`:fmtDate(e.date)}
function makeEvent(e){return{...e,kind:"event",ts:new Date(e.date).getTime()}}
function makeDeadline(d){return{...d,kind:"deadline",ts:new Date(d.date).getTime()}}
function clockInline(ms){let t=parts(ms);return t?`${t.d} ngày · ${pad(t.h)} giờ · ${pad(t.m)} phút · ${pad(t.s)} giây còn lại`:"ĐÃ QUA DEADLINE"}
function logoHTML(e){return `<div class="event-logo">${e.logo?`<img src="${escapeAttr(e.logo)}" alt="${escapeAttr(e.title)}" loading="lazy">`:`<span aria-label="Chưa có logo giải đấu">${e.type.includes("V5")?"V5":"IQ"}</span>`}</div>`}
function escapeAttr(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function eventCard(e){let v=e.type==="VEX V5"?"v5":"iq",ms=e.ts-Date.now(),past=ms<=0,details=(e.details||[]).map(eventDetailHTML).join("");let attached=(e.notebook||[]).map(n=>{let target=new Date(n.date).getTime();return `<div class="deadline"><div class="deadline-box"><div class="deadline-title">NOTEBOOK DEADLINE</div><div class="deadline-name">${n.label}</div><div class="deadline-clock" data-inline-target="${target}">${clockInline(target-Date.now())}</div><div class="deadline-note">${n.display||fmtDate(n.date)}</div></div></div>`}).join("");return `<div class="card" tabindex="0">${logoHTML(e)}${e.id==="v5-signature-yixing"?'<span class="signature-badge"><span aria-hidden="true">✦</span> SIGNATURE · IQ + V5</span>':e.important===true?'<span class="important-badge">🔥 GIẢI QUAN TRỌNG</span>':""}<div class="date-label">${eventRange(e)}</div><h3>${e.title}</h3><div class="place">${e.place||""}</div><div class="link"><a href="${escapeAttr(e.link||"#")}" target="_blank" rel="noopener noreferrer">Link Event</a></div>${clockHTML(ms,e.ts)}<div class="details">${details}</div><div class="card-footer"><span class="type">${e.type}</span><span class="past-label">${past?"ĐÃ DIỄN RA":"COUNTING DOWN"}</span></div>${attached}</div>`}
function deadlineCard(d){let ms=d.ts-Date.now();return `<div class="card" tabindex="0"><div class="date-label">NOTEBOOK DEADLINE · ${fmtDate(d.date)}</div><h3>${d.title}</h3><div class="place">Giải đấu: ${d.forEvent||"Panda Robotics"}</div>${clockHTML(ms,d.ts)}<div class="card-footer"><span class="type">${d.type}</span><span class="past-label">${ms<=0?"ĐÃ QUA DEADLINE":"CẦN HOÀN THÀNH"}</span></div></div>`}
function render(){let all=[...DATA.events.map(makeEvent),...DATA.deadlines.map(makeDeadline)].filter(x=>filter==="all"||x.type===filter||x.type==="VEX IQ + V5").sort((a,b)=>a.ts-b.ts);let host=$("#items"),nowPanel=$("#nowMarker");nowPanel.remove();host.innerHTML="";all.forEach((e,i)=>{let wrap=document.createElement("article"),right=i%2===1;wrap.dataset.ts=e.ts;wrap.className=`item ${right?"right":""} ${e.type==="VEX V5"?"v5":"iq"} ${e.kind==="deadline"?"deadline-only":""} ${e.important===true&&e.kind==="event"?"important":""} ${e.kind==="event"&&e.id==="v5-signature-yixing"?"signature-featured":""}`;wrap.innerHTML=`<span class="node"></span>${e.kind==="deadline"?deadlineCard(e):eventCard(e)}`;host.appendChild(wrap)});if(!all.length)host.innerHTML='<p class="empty">Không có sự kiện cho bộ lọc này.</p>';host.insertBefore(nowPanel,[...host.querySelectorAll(".item")].find(row=>Number(row.dataset.ts)>Date.now())||null);observe();updateClocks();updateNow();host.querySelectorAll("img").forEach(img=>img.addEventListener("error",()=>{let fallback=document.createElement("span");fallback.textContent="LOGO";img.replaceWith(fallback)}))}
function nearestMilestones(type,now=Date.now()){
const matches=x=>x.type===type||x.type==="VEX IQ + V5";
const event=DATA.events.filter(x=>matches(x)&&Date.parse(x.date)>now).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date))[0];
const deadlines=DATA.deadlines.map(x=>({...x,type:x.id==="print-notebook-dec10"?"VEX IQ + V5":x.type}));
for(const e of DATA.events){for(const n of e.notebook||[]){if(!deadlines.some(d=>matchesType(d,e)&&Math.abs(Date.parse(d.date)-Date.parse(n.date))<172800000))deadlines.push({...n,title:n.label,type:e.type,forEvent:e.title});}}
const deadline=deadlines.filter(x=>matches(x)&&Date.parse(x.date)>now).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date))[0];
return {event,deadline};
}
function matchesType(a,b){return a.type===b.type||a.type==="VEX IQ + V5"||b.type==="VEX IQ + V5";}
function nowMilestoneHTML(x,kind,now){if(!x)return '<p class="now-empty">Không còn mốc sắp tới.</p>';const date=new Intl.DateTimeFormat("vi-VN",{timeZone:x.date.endsWith("+08:00")?"Asia/Shanghai":"Asia/Ho_Chi_Minh",dateStyle:"short",timeStyle:"short"}).format(Date.parse(x.date));return '<h4>'+escapeAttr(x.title||x.label)+'</h4><p>'+escapeAttr(date)+' · '+(x.date.endsWith("+08:00")?'UTC+8':'UTC+7')+'</p><p class="now-countdown">'+clockInline(Date.parse(x.date)-now)+'</p>'+(kind==='event'?'<p>'+escapeAttr(x.place||'')+'</p>':'<p>'+escapeAttr(x.forEvent||'')+'</p>');}
function updateNow(){const now=Date.now(),host=$("#items"),marker=$("#nowMarker"),rows=[...host.querySelectorAll(".item")];
rows.forEach(row=>{const past=Number(row.dataset.ts)<=now;row.classList.toggle("past",past);const label=row.querySelector(".past-label");label.textContent=past?(row.classList.contains("deadline-only")?"ĐÃ QUA DEADLINE":"ĐÃ DIỄN RA"):(row.classList.contains("deadline-only")?"CẦN HOÀN THÀNH":"COUNTING DOWN")});
const next=rows.find(row=>Number(row.dataset.ts)>now);if(marker.nextElementSibling!==(next||null))host.insertBefore(marker,next||null);
$("#nowTime").textContent=new Intl.DateTimeFormat("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",dateStyle:"short",timeStyle:"medium"}).format(now)+" · VN";
let overview=$("#nowOverview");if(!overview){overview=document.createElement("div");overview.id="nowOverview";overview.className="now-overview";marker.querySelector(".now-label").appendChild(overview);}
overview.innerHTML=['VEX V5','VEX IQ'].map(type=>{const {event,deadline}=nearestMilestones(type,now);return '<section class="now-column '+(type==='VEX V5'?'v5':'iq')+'"><h3>'+type+'</h3><div class="now-milestone"><span>Giải gần nhất</span>'+nowMilestoneHTML(event,'event',now)+'</div><div class="now-milestone"><span>Deadline Notebook gần nhất</span>'+nowMilestoneHTML(deadline,'deadline',now)+'</div></section>';}).join('');
}
function jumpToNow(){updateNow();const marker=$("#nowMarker");window.scrollTo({top:Math.max(0,window.scrollY+marker.getBoundingClientRect().top-window.innerHeight*.35),behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"})}
let observer;function observe(){if(observer)observer.disconnect();observer=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add("visible");observer.unobserve(x.target)}}),{threshold:.12});document.querySelectorAll(".item").forEach(x=>observer.observe(x))}
function updateClocks(){document.querySelectorAll("[data-countdown]").forEach(el=>{let t=parts(Number(el.dataset.target)-Date.now());el.innerHTML=t?unitHTML(t):'<div class="unit"><b>00</b><small>ĐÃ ĐẾN HẠN</small></div>'});document.querySelectorAll("[data-inline-target]").forEach(el=>el.textContent=clockInline(Number(el.dataset.inlineTarget)-Date.now()))}
function tick(){updateClocks();updateNow()}
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));render()}));
$("#jumpNow").addEventListener("click",jumpToNow);
window.addEventListener("resize",updateNow);
fetch("../data/events.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("events.json load failed");return r.json()}).then(d=>{const activeEvents=(d.events||[]).filter(event=>event.enabled!==false);const activeIds=new Set(activeEvents.map(event=>event.id));DATA={...d,events:activeEvents.map(event=>({...event,notebook:(event.notebook||[]).filter(note=>note.enabled!==false)})),deadlines:(d.deadlines||[]).filter(deadline=>deadline.enabled!==false&&(!deadline.eventId||activeIds.has(deadline.eventId)))};render();setInterval(tick,1000)}).catch(e=>{$("#items").innerHTML='<p class="empty">Không tải được events.json. Kiểm tra public/data/events.json.</p>';console.error(e)});

// Fixed header with reserved full-size space prevents scroll/layout feedback.
function initShrinkingHeader(){
const header=document.querySelector('.hero');
const spacer=document.createElement('div');spacer.className='header-spacer';spacer.setAttribute('aria-hidden','true');header.before(spacer);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let progress=0,frame=0;
function paint(value){
const mobile=window.innerWidth<=700;
const title=Math.min(54,Math.max(30,window.innerWidth*.05));
const lerp=(a,b)=>a+(b-a)*value;
header.style.setProperty('--header-padding',lerp(mobile?22:30,mobile?9:10)+'px');
header.style.setProperty('--header-logo',lerp(mobile?76:100,mobile?42:48)+'px');
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

function eventDetailHTML(value){
const paths={
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2M8 18h2"/>',
departure:'<path d="M3 21h18M3 15l4 1 12-5c2-1 1-3-1-2l-5 2-5-6-2 1 3 7-3 1-2-2-2 1z"/>',
arrival:'<path d="M3 21h18M3 10l4 3 12 3c2 1 3-2 1-3l-6-2-2-7H9l1 6-4-1-1-3H3z"/>',
location:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>'
};
const key=value.includes('Ngày thi:')?'calendar':value.includes('Ngày đi:')?'departure':value.includes('Ngày về:')?'arrival':value.includes('Nơi thi:')?'location':null;
if(!key)return '<div>'+value+'</div>';
const label=value.slice(value.indexOf(key==='calendar'?'Ngày thi:':key==='departure'?'Ngày đi:':key==='arrival'?'Ngày về:':'Nơi thi:'));
return '<div class="event-detail"><svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+paths[key]+'</svg><span>'+escapeAttr(label)+'</span></div>';
}

$("#floatingNow").addEventListener("click",jumpToNow);
