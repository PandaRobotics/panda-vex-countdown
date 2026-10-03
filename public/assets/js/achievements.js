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
  function render() {
    galleries = [];
    const selected = records.filter(record =>
      (system === 'all' || record.system === system) &&
      (season.value === 'all' || record.season === season.value));
    const fragment = document.createDocumentFragment();
    for (const category of categories) {
      const entries = selected.filter(record => record.category === category.id);
      if (!entries.some(record => record.photos?.length)) continue;
      const group = el('section','award-group category-'+category.id);
      const heading = el('h3','',category.title);
      heading.id = 'award-group-'+category.id;
      group.setAttribute('aria-labelledby',heading.id);
      const header = el('div','award-group-heading'); header.append(heading);
      const cards = el('div','award-group-grid');
      const pending = el('details','award-pending');
      const missing = entries.filter(record => !record.photos?.length);
      pending.append(el('summary','', 'Đang bổ sung ảnh · '+missing.length+' sự kiện'));
      for (const record of entries) {
        if (record.photos?.length) cards.append(gallery(record));
        else {
          const link = el('a','',record.event+' · '+record.awards.join(' / '));
          link.href=record.source; link.target='_blank'; link.rel='noopener noreferrer'; pending.append(link);
        }
      }
      
      group.append(header,cards); fragment.append(group);
    }
    grid.replaceChildren(fragment);
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
  }).catch(error=>{status.textContent='Chưa tải được thành tích. Vui lòng tải lại trang.';console.error(error);})
    .finally(()=>grid.setAttribute('aria-busy','false'));
})();
