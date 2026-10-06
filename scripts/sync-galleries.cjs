const fs=require('node:fs'),path=require('node:path');
const IMAGE=/\.(jpe?g|png|webp|gif|avif)$/i;
function compileCatalog(catalog,publicRoot){
 const fail=message=>{throw Error('Achievement catalog: '+message);};
 const check=(ok,message)=>{if(!ok)fail(message);};
 const enabled=(item,context)=>{check(item.enabled===undefined||typeof item.enabled==='boolean','enabled must be boolean: '+context);return item.enabled!==false;};
 const validId=(item,seen,context)=>{check(typeof item.id==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id),'invalid id: '+context);check(!seen.has(item.id),'duplicate id: '+item.id);seen.add(item.id);};
 const sort=(items)=>[...items].sort((a,b)=>{const ordered=Number.isFinite(a.displayOrder)||Number.isFinite(b.displayOrder);if(ordered)return (a.displayOrder??Infinity)-(b.displayOrder??Infinity);return (b.time?.start||'').localeCompare(a.time?.start||'');});
 const photos=(folder,metadata,alt,source)=>{check(typeof folder==='string','missing photoFolder');const base=path.resolve(publicRoot,'assets/images/achievements'),dir=path.resolve(publicRoot,folder);check(dir.startsWith(base+path.sep),'photoFolder outside achievements: '+folder);if(!fs.existsSync(dir))return [];check(fs.realpathSync(dir).startsWith(fs.realpathSync(base)+path.sep),'symlink outside achievements');return fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.isFile()&&IMAGE.test(e.name)).sort((a,b)=>a.name.localeCompare(b.name,'en',{numeric:true})).map(e=>{check(fs.realpathSync(path.join(dir,e.name)).startsWith(fs.realpathSync(base)+path.sep),'image outside achievements');return {...(metadata?.[e.name]||{}),src:folder.replaceAll('\\','/')+'/'+e.name,alt:metadata?.[e.name]?.alt||alt,source:metadata?.[e.name]?.source||source};});};
 check(catalog.schemaVersion===1,'unsupported schemaVersion');check(Array.isArray(catalog.seasons),'seasons must be an array');const records=[],seasonIds=new Set(),eventIds=new Set();
 for(const season of [...catalog.seasons].sort((a,b)=>b.yearStart-a.yearStart)){
  validId(season,seasonIds,'season');const seasonEnabled=enabled(season,season.id);check(Number.isInteger(season.yearStart)&&season.yearEnd===season.yearStart+1,'invalid season years: '+season.id);check(season.label&&season.name,'missing season name/label');check(Array.isArray(season.competitions),'missing competitions');
  for(const event of sort(season.competitions)){
   validId(event,eventIds,'competition');const eventEnabled=enabled(event,event.id);check(event.name,'missing event name');check(['IQ','V5'].includes(event.system),'invalid system: '+event.id);check(['world','national','signature','other'].includes(event.category),'invalid category: '+event.id);check(/^https:\/\//.test(event.articleUrl),'invalid articleUrl: '+event.id);check(Array.isArray(event.awards)&&event.awards.length,'missing awards: '+event.id);
   for(const key of ['start','end'])if(event.time?.[key])check(/^\d{4}-\d{2}-\d{2}$/.test(event.time[key])&&new Date(event.time[key]+'T12:00:00Z').toISOString().slice(0,10)===event.time[key],'invalid date: '+event.id);if(event.time?.start&&event.time?.end)check(event.time.end>=event.time.start,'end before start: '+event.id);
   const shared=photos(event.photoFolder,event.photoMetadata,'Panda Robotics · '+event.name,event.sourceUrl||event.articleUrl);const awardIds=new Set(),awardItems=[];
   for(const award of sort(event.awards)){
    validId(award,awardIds,'award');const awardEnabled=enabled(award,award.id);check(award.name&&award.teamName,'award missing name/teamName: '+award.id);check(Array.isArray(award.teamIds)&&award.teamIds.every(id=>typeof id==='string'),'invalid teamIds: '+award.id);const own=photos(award.photoFolder,award.photoMetadata,award.teamName+' · '+award.teamIds.join(' & ')+' · '+award.name,event.articleUrl);
    if(awardEnabled)awardItems.push({id:award.id,teamName:award.teamName,teamIds:award.teamIds,name:award.name,label:(award.teamIds.length?award.teamIds.join(' & ')+' · ':'')+award.name,photoFolder:award.photoFolder,photos:own});
   }
   if(!seasonEnabled||!eventEnabled||!awardItems.length)continue;
   const all=[...new Map([...shared,...awardItems.flatMap(a=>a.photos)].map(p=>[p.src,p])).values()];
   records.push({...event.metadata,id:event.id,season:season.label,seasonName:season.name,event:event.name,system:event.system,category:event.category,date:event.time?.start||undefined,time:event.time,teamName:event.teamName||'Panda Robotics',detail:event.metadata?.detail||event.time?.label||'',source:event.sourceUrl||event.articleUrl,postSource:event.articleUrl,photoFolder:event.photoFolder,photos:all,sharedPhotos:shared,awards:awardItems.map(a=>a.label),awardItems});
  }
 }
 return records;
}
function syncGalleries(){const root=path.resolve(__dirname,'../public'),catalog=JSON.parse(fs.readFileSync(path.join(root,'data/achievement-catalog.json'),'utf8')),records=compileCatalog(catalog,root),out=path.join(root,'data/achievements.json'),next=JSON.stringify(records,null,2)+'\n';if(!fs.existsSync(out)||next!==fs.readFileSync(out,'utf8'))fs.writeFileSync(out,next);return records;}
module.exports={syncGalleries,compileCatalog};if(require.main===module)console.log('Generated galleries: '+syncGalleries().reduce((n,r)=>n+r.photos.length,0)+' images.');
