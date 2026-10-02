let events=[],filter="all";
const levels=[
{max:1,icon:"🚨",label:"Less than 24 hours — EVENT IMMINENT",urgent:true},
{max:3,icon:"🔥",label:"1–3 days — FINAL PREPARATION",urgent:true},
{max:7,icon:"⚠️",label:"3–7 days — GET READY",urgent:true},
{max:14,icon:"⏰",label:"7–14 days — TWO WEEKS TO GO"},
{max:30,icon:"⏳",label:"14–30 days — COUNTDOWN ON"},
{max:60,icon:"📅",label:"30–60 days — MARK YOUR CALENDAR"},
{max:Infinity,icon:"🗓️",label:"More than 60 days — PLANNING PHASE"}];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const urgency=ms=>levels.find(x=>Math.max(0,ms)/86400000<=x.max);
const fmt=s=>new Intl.DateTimeFormat("en-GB",{weekday:"short",day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(s));
const short=s=>new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(s));
const range=e=>e.endDate?`${short(e.date)} – ${short(e.endDate)}`:fmt(e.date);
function countdown(ms){if(ms<=0)return"EVENT DAY";let t=Math.floor(ms/1000),d=Math.floor(t/86400),h=Math.floor(t%86400/3600),m=Math.floor(t%3600/60),s=t%60;return d?`${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m`:`${h}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`}
function next(){return events.filter(e=>new Date(e.date)>new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date))[0]}
function renderNext(){let e=next(),card=document.querySelector("#nextCard");if(!e){nextName.textContent="No upcoming events";nextCountdown.textContent="—";nextUrgency.textContent="All listed events have passed.";return}let u=urgency(new Date(e.date)-Date.now());card.style.setProperty("--accent",e.type==="VEX V5"?"var(--v5)":"var(--iq)");nextIcon.textContent=u.icon;nextName.textContent=e.name;nextLocation.textContent=e.location;nextDate.textContent=range(e);nextCountdown.textContent=countdown(new Date(e.date)-Date.now());nextUrgency.textContent=u.label;nextType.textContent=e.type;nextType.className=`badge ${e.type==="VEX V5"?"v5":""}`}
function render(){let list=events.filter(e=>filter==="all"||e.type===filter).sort((a,b)=>new Date(a.date)-new Date(b.date));grid.innerHTML="";empty.classList.toggle("hidden",!!list.length);list.forEach(e=>{let ms=new Date(e.date)-Date.now(),u=urgency(ms),v=e.type==="VEX V5";let a=document.createElement("article");a.className=`event ${v?"v5":""} ${u.urgent?"urgent":""}`;a.innerHTML=`<div><div class="top"><span class="event-type">${e.type}</span><span>${e.icon||"🤖"}</span></div><h3>${esc(e.name)}</h3><p class="location">${esc(e.location)}</p></div><div><div class="bottom"><span class="event-date">${range(e)}</span><span class="card-countdown">${countdown(ms)}</span></div><p class="urgency-text">${u.icon} ${u.label}</p></div>`;grid.appendChild(a)})}
function tick(){now.textContent=new Intl.DateTimeFormat("en-GB",{weekday:"long",day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date());year.textContent=new Date().getFullYear();renderNext();render()}
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");render()});
fetch("events.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(d=>{events=d;tick();setInterval(tick,1000)}).catch(e=>{nextName.textContent="Could not load events.json";nextUrgency.textContent="Make sure events.json is in the same folder as index.html.";console.error(e)});
