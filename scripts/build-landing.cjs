const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function buildLanding(){
 const records=require('./sync-galleries.cjs').syncGalleries();
 const categories={world:'WORLD',national:'NATIONAL',signature:'SIGNATURE',other:'GIAO HỮU'};
 const markup=records.filter(r=>r.photos?.length).map((r,index)=>{
 const label=r.date?new Date(r.date+'T12:00:00').toLocaleDateString('vi-VN'):r.detail.match(/(?:\d{1,2}[–-])?\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\/\d{4}/)?.[0]||r.event.match(/20\d{2}/)?.[0]||'Mùa '+r.season;
 const ids=[...new Set((r.teams||[]).map(t=>t.id).concat((r.detail+' '+r.awards.join(' ')).match(/62024[A-Z]/g)||[]))];
 return '<section class="timeline-event is-revealed category-'+escape(r.category)+'"><div class="timeline-marker"><span class="timeline-step">'+escape(label)+'</span></div><article class="award-card photo-card '+r.system.toLowerCase()+'"><div class="gallery-stage"><img class="gallery-image is-active" src="'+escape(r.photos[0].src)+'" alt="'+escape(r.photos[0].alt||r.event)+'" loading="lazy" decoding="async"><div class="gallery-badge">VEX '+escape(r.system)+' · '+escape(r.season)+'</div></div></article><div class="timeline-information"><p class="timeline-category">'+categories[r.category]+' / VEX '+escape(r.system)+'</p><h3>'+escape(r.event)+'</h3><p class="timeline-season">Mùa giải '+escape(r.season)+'</p><p class="timeline-detail">'+escape(r.detail)+'</p><div class="timeline-teams">'+(ids.length?ids:['Panda Robotics']).map(id=>'<span class="timeline-team">'+escape(id==='Panda Robotics'?id:'Panda Robotics · '+id)+'</span>').join('')+'</div><details class="timeline-awards"><summary>Thành tích · '+r.awards.length+' ↗</summary><ul class="timeline-results">'+r.awards.map(a=>'<li>'+escape(a)+'</li>').join('')+'</ul></details>'+(r.resultNotes?'<details class="timeline-notes"><summary>Chi tiết thành tích</summary><p>'+escape(r.resultNotes)+'</p></details>':'')+'<a class="timeline-source" href="'+escape(r.postSource||r.source)+'" target="_blank" rel="noopener noreferrer">Xem bài viết ↗</a></div></section>';
 }).join('\n');
 const file=path.join(root,'index.html');let html=fs.readFileSync(file,'utf8');
 html=html.replace(/<!-- achievements:start -->[\s\S]*?<!-- achievements:end -->/,`<!-- achievements:start -->\n<div class="award-grid achievement-timeline" data-view="1" aria-busy="false">${markup}</div>\n<!-- achievements:end -->`);
 if(html!==fs.readFileSync(file,'utf8'))fs.writeFileSync(file,html);
 return records.filter(r=>r.photos?.length).length;
}
module.exports={buildLanding};if(require.main===module)console.log('Static landing: '+buildLanding()+' achievement events rendered in HTML.');
