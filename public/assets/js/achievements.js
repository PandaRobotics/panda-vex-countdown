(() => {
  const section = document.querySelector('#achievements');
  if (!section) return;
  const grid = section.querySelector('.award-grid');
  const status = section.querySelector('#award-status');
  const season = section.querySelector('#award-season');
  const filters = [...section.querySelectorAll('[data-system-filter]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let records = [], system = 'all', galleries = [];
  const categories = [
    {id:'world', title:'WORLD'},
    {id:'national', title:'NATIONAL'},
    {id:'signature', title:'SIGNATURE'},
    {id:'other', title:'GIAO HỮU'}
  ];
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function button(text,label,action) {
    const node = el('button','gallery-button',text);
    node.type = 'button'; node.setAttribute('aria-label',label);
    node.addEventListener('click',action);
    return node;
  }
  function gallery(record) {
    const awards = record.awards;
    const award = awards[0];
    const card = el('article','award-card photo-card '+record.system.toLowerCase());
    const photos = [...new Map((record.photos || []).map(photo => [photo.src,photo])).values()];
    const stage = el('div','gallery-stage');
    stage.setAttribute('aria-roledescription','slideshow');
    stage.setAttribute('aria-label',award+' · '+record.event);
    const slides = photos.map((photo,index) => {
      const image = el('img','gallery-image');
      image.src = photo.src; image.alt = photo.alt || record.event+' · '+award;
      image.loading = 'lazy'; image.decoding = 'async';
      image.classList.toggle('is-active',index === 0);
      image.setAttribute('aria-hidden',String(index !== 0));
      image.addEventListener('error',() => {
        image.hidden = true;
        const message = el('span','gallery-image-error','Không tải được ảnh');
        image.after(message);
      },{once:true});
      stage.append(image);
      return image;
    });
    if (!photos.length) {
      const empty = el('a','gallery-empty','Ảnh đang cập nhật');
      empty.href = 'https://www.facebook.com/pandaroboticsvn/photos';
      empty.target = '_blank'; empty.rel = 'noopener noreferrer';
      empty.append(el('span','','Xem fanpage ↗'));
      stage.append(empty);
    }
    const badge = el('div','gallery-badge','VEX '+record.system+' · '+record.season);
    stage.append(badge);
    let index = 0, manualPause = false, hover = false;
    const count = el('span','gallery-count',photos.length ? '1 / '+photos.length : '');
    const controls = el('div','gallery-controls');
    function show(next) {
      index = (next + photos.length) % photos.length;
      slides.forEach((slide,i) => {
        slide.classList.toggle('is-active',i === index);
        slide.setAttribute('aria-hidden',String(i !== index));
      });
      count.textContent = (index+1)+' / '+photos.length;
      source.href = achievementSource() || photos[index].source || record.source;
    }
    const source = el('a','award-source','↗');
    source.href = record.postSource || photos[0]?.source || record.source;
    source.target = '_blank'; source.rel = 'noopener noreferrer';
    source.setAttribute('aria-label','Xem nguồn ảnh và giải thưởng '+award);
    if (photos.length > 1 || awards.length > 1) {
      const pause = button('Ⅱ','Tạm dừng slideshow',() => {
        manualPause = !manualPause;
        pause.textContent = manualPause ? '▶' : 'Ⅱ';
        pause.setAttribute('aria-label',manualPause ? 'Chạy slideshow' : 'Tạm dừng slideshow');
      });
      if (photos.length > 1) controls.append(button('‹','Ảnh trước',()=>show(index-1)),count);
      controls.append(pause);
      if (photos.length > 1) controls.append(button('›','Ảnh tiếp theo',()=>show(index+1)));
      stage.append(controls);
      galleries.push(() => {
        const rect = card.getBoundingClientRect();
        if (!manualPause && !hover && !reduced.matches && !document.hidden &&
            !card.contains(document.activeElement) && rect.top < innerHeight && rect.bottom > 0) {
          if (photos.length > 1) show(index+1);
          if (awards.length > 1) showAward(awardIndex+1);
        }
      });
      card.addEventListener('pointerenter',()=>{hover=true;});
      card.addEventListener('pointerleave',()=>{hover=false;});
      stage.tabIndex = 0;
      stage.addEventListener('keydown',event => {
        if (photos.length > 1 && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
          event.preventDefault(); show(index+(event.key === 'ArrowRight' ? 1 : -1));
        }
      });
    }
    const caption = el('div','gallery-caption');
    const copy = el('div');
    copy.append(el('h4','event-title',record.event));
    if (record.displayDetail) copy.append(el('p','event-detail',record.displayDetail));
    const awardStage = el('div','award-name-stage');
    awardStage.setAttribute('aria-label','Giải thưởng của '+record.event);
    let awardIndex = 0;
    function achievementSource() {
      const team = awards[awardIndex].match(/^(62024[A-Z]) ·/)?.[1];
      return (record.results || []).find(result => result.team === team)?.source || record.postSource;
    }
    const awardNames = awards.map((name,i) => {
      const title = el('span','award-name'+(i===0?' is-active':''),name);
      title.setAttribute('aria-hidden',String(i!==0)); awardStage.append(title); return title;
    });
    function showAward(next) {
      awardIndex = (next+awards.length)%awards.length;
      awardNames.forEach((name,i)=>{name.classList.toggle('is-active',i===awardIndex);name.setAttribute('aria-hidden',String(i!==awardIndex));});
      awardCount.textContent=(awardIndex+1)+' / '+awards.length;
      source.href = achievementSource() || photos[index]?.source || record.source;
    }
    const awardCount = el('span','award-name-count','1 / '+awards.length);
    copy.append(awardStage);
    if (awards.length > 1) {
      const awardControls=el('div','award-name-controls');
      awardControls.append(button('‹','Giải thưởng trước',()=>showAward(awardIndex-1)),awardCount,button('›','Giải thưởng tiếp theo',()=>showAward(awardIndex+1)));
      copy.append(awardControls);
    }
    caption.append(copy,source);
    card.append(stage,caption);
    return card;
  }
  const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries) if(entry.isIntersecting){entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target);}},{threshold:0.08});
  for(const toggle of section.querySelectorAll('[data-timeline-view]')) toggle.addEventListener('click',()=>{
    grid.dataset.view=toggle.dataset.timelineView;
    for(const button of section.querySelectorAll('[data-timeline-view]')) button.setAttribute('aria-pressed',String(button===toggle));
  });
  const dock=section.querySelector('.achievements-dock');
  function measureDock(){document.documentElement.style.setProperty('--achievements-dock-height',dock.getBoundingClientRect().height+'px');}
  new ResizeObserver(measureDock).observe(dock);measureDock();
  let animating=false,lastGesture=0,touchStartY=null;
  const screens=()=>[document.querySelector('.hero'),document.querySelector('.intro-screen'),...grid.querySelectorAll('.timeline-event'),document.querySelector('.countdown-callout')].filter(Boolean);
  function offset(node){return document.querySelector('.site-header').getBoundingClientRect().height+(node.classList.contains('timeline-event')?dock.getBoundingClientRect().height+12:8);}
  function updateSnap(){const rect=grid.getBoundingClientRect();document.documentElement.classList.toggle('timeline-snap',rect.top<innerHeight*.65&&rect.bottom>innerHeight*.35);}
  addEventListener('scroll',updateSnap,{passive:true});addEventListener('resize',updateSnap,{passive:true});
  function goScreen(direction){
    const nodes=screens();const nearest=nodes.reduce((best,node,i)=>Math.abs(node.getBoundingClientRect().top-offset(node))<Math.abs(nodes[best].getBoundingClientRect().top-offset(nodes[best]))?i:best,0);
    if(nearest===nodes.length-1&&direction>0)return false;
    const index=Math.max(0,Math.min(nodes.length-1,nearest+direction)),target=nodes[index];
    animating=true;const from=scrollY,start=performance.now(),duration=reduced.matches?0:650;
    function frame(now){const progress=duration?Math.min(1,(now-start)/duration):1;const destination=Math.max(0,target.getBoundingClientRect().top+scrollY-offset(target));const eased=1-Math.pow(1-progress,3);window.scrollTo({top:from+(destination-from)*eased,behavior:'instant'});if(progress<1)requestAnimationFrame(frame);else animating=false;}
    requestAnimationFrame(frame);return true;
  }
  addEventListener('wheel',event=>{
    if(event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||Math.abs(event.deltaY)<1||event.target.closest('.timeline-results,.timeline-notes[open],select,iframe,.panda-footer'))return;
    const last=screens().at(-1);if(last.getBoundingClientRect().bottom<innerHeight*.3)return;
    const now=performance.now(),continued=now-lastGesture<200;lastGesture=now;
    if(animating||continued){event.preventDefault();return;}
    if(goScreen(event.deltaY>0?1:-1))event.preventDefault();
  },{passive:false});
  addEventListener('touchstart',event=>{touchStartY=event.touches[0]?.clientY??null;},{passive:true});
  addEventListener('touchend',event=>{if(touchStartY===null||event.target.closest('.timeline-results,.panda-footer,select'))return;const delta=touchStartY-event.changedTouches[0].clientY;touchStartY=null;if(Math.abs(delta)>25&&!animating)goScreen(delta>0?1:-1);},{passive:true});
  function render() {
    galleries = [];
    const selected = records.filter(record =>
      (system === 'all' || record.system === system) &&
      (season.value === 'all' || record.season === season.value));
    const fragment = document.createDocumentFragment();
    grid.classList.add('achievement-timeline');
    if (!grid.dataset.view) grid.dataset.view='1';
    const entries=selected.filter(record=>record.photos?.length);
    let currentYear='';
    const yearOf=record=>record.season;
    entries.forEach((record,index)=>{
      const year=yearOf(record);
      if(year!==currentYear){currentYear=year;const group=entries.filter(r=>yearOf(r)===year);const heading=el('header','timeline-year-heading');heading.append(el('h3','',year),el('p','',group.length+' giải đấu · '+group.reduce((sum,r)=>sum+r.awards.length,0)+' thành tích'));fragment.append(heading);}
      const row=el('section','timeline-event category-'+record.category);
      const label=record.date ? new Date(record.date+'T12:00:00').toLocaleDateString('vi-VN') : record.detail.match(/(?:\d{1,2}[–-])?\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\/\d{4}/)?.[0] || record.event.match(/20\d{2}/)?.[0] || 'Mùa '+record.season;
      const marker=el('div','timeline-marker');marker.append(el('span','timeline-step',label));
      const photo=gallery(record);photo.querySelector('h4')?.remove();photo.querySelector('.event-detail')?.remove();
      const info=el('div','timeline-information');
      const category=categories.find(c=>c.id===record.category)?.title || record.category;
      info.append(el('p','timeline-category',category+' / VEX '+record.system),el('h3','',record.event),el('p','timeline-season','Mùa giải '+record.season));
      if(record.detail) info.append(el('p','timeline-detail',record.detail));
      const ids=[...new Set((record.teams||[]).map(t=>t.id).concat((record.detail+' '+record.awards.join(' ')).match(/62024[A-Z]/g)||[]))];
      const teams=el('div','timeline-teams');
      for(const id of ids.length ? ids : ['Panda Robotics']) teams.append(el('span','timeline-team',id==='Panda Robotics'?id:'Panda Robotics · '+id));
      info.append(teams);
      const list=el('ul','timeline-results');for(const award of record.awards) list.append(el('li','',award));
      const results=el('details','timeline-awards');results.append(el('summary','','Thành tích · '+record.awards.length+' ↗'),list);
      results.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')results.open=true;});
      results.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'&&!results.contains(document.activeElement))results.open=false;});
      results.addEventListener('focusout',event=>{if(!results.contains(event.relatedTarget))results.open=false;});
      info.append(results);
      if(record.resultNotes) {const more=el('details','timeline-notes');more.append(el('summary','','Chi tiết thành tích'),el('p','',record.resultNotes));info.append(more);}
      const source=el('a','timeline-source','Xem bài viết ↗');source.href=record.postSource||record.source;source.target='_blank';source.rel='noopener noreferrer';info.append(source);
      row.append(marker,photo,info);fragment.append(row);
    });
    grid.replaceChildren(fragment);
    updateSnap();
    revealObserver.disconnect();
    for(const row of grid.querySelectorAll('.timeline-event')) revealObserver.observe(row);
    status.textContent = selected.length ? '' : 'Chưa có thành tích cho lựa chọn này.';
    for (const filter of filters) filter.setAttribute('aria-pressed',String(filter.dataset.systemFilter === system));
  }
  for (const filter of filters) filter.addEventListener('click',()=>{system=filter.dataset.systemFilter;render();});
  season.addEventListener('change',render);
  setInterval(()=>{for (const advance of galleries) advance();},5500);
  fetch('data/achievements.json').then(response=>{
    if (!response.ok) throw Error('Cannot load achievements'); return response.json();
  }).then(data=>{
    records=data;
    for (const value of [...new Set(records.map(record=>record.season))].sort().reverse()) {
      const option=el('option','',value);option.value=value;season.append(option);
    }
    render(); section.querySelector('.award-toolbar').hidden=false;
  }).catch(error=>{status.textContent=grid.querySelector('.photo-card')?'Slideshow chưa tải được. Bạn vẫn có thể xem thành tích bên dưới.':'Chưa tải được thành tích. Vui lòng tải lại trang.';console.error(error);})
    .finally(()=>grid.setAttribute('aria-busy','false'));
})();
