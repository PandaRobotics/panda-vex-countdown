const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../public');
let errors = 0;
function assert(condition,message) {
  if (!condition) { console.error(message); errors++; }
}
function localReference(base,reference) {
  if (!reference || /^(https?:|mailto:|tel:|data:|#)/.test(reference)) return;
  const clean = decodeURIComponent(reference.split(/[?#]/)[0]);
  if (!clean) return;
  let file = clean.startsWith('/') ? path.join(root,clean) : path.resolve(base,clean);
  assert(file.startsWith(root + path.sep) || file === root, 'Reference outside public: ' + reference);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
  assert(fs.existsSync(file),'Missing file: '+reference+' (from '+path.relative(root,base)+')');
}
function walk(directory) {
  for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
    const file = path.join(directory,entry.name);
    if (entry.isDirectory()) { walk(file); continue; }
    if (file.endsWith('.js')) new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
    if (file.endsWith('.html')) {
      const html = fs.readFileSync(file,'utf8');
      for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) localReference(path.dirname(file),match[1]);
    }
  }
}
walk(root);
const events = JSON.parse(fs.readFileSync(path.join(root,'data/events.json'),'utf8'));
const eventIds = new Set();
for (const event of events.events) {
  assert(!eventIds.has(event.id), 'Duplicate event: '+event.id);
  eventIds.add(event.id);
  assert(Number.isFinite(Date.parse(event.date)),'Invalid date: '+event.id);
  localReference(path.join(root,'vex-countdown'),event.logo);
}
const awards = JSON.parse(fs.readFileSync(path.join(root,'data/achievements.json'),'utf8'));
for (const award of awards) {
  assert(['world','national','signature','other'].includes(award.category),'Invalid competition category: '+award.event);
  assert(['IQ','V5'].includes(award.system),'Invalid award system: '+award.event);
  assert(award.season && award.event && Array.isArray(award.awards) && award.awards.length,'Incomplete award: '+award.event);
  assert(/^https:\/\//.test(award.source),'Invalid source: '+award.event);
}
assert(fs.readFileSync(path.join(root,'assets/js/countdown.js'),'utf8').includes('../data/events.json'),'Countdown data path missing');
assert(fs.readFileSync(path.join(root,'assets/js/achievements.js'),'utf8').includes('data/achievements.json'),'Achievements data path missing');
if (errors) process.exitCode = 1;
else console.log('OK: HTML references, JavaScript syntax, ' + events.events.length + ' events and ' + awards.length + ' achievement milestones.');
