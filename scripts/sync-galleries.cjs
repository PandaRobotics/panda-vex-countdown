const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../public');
const dataPath = path.join(root, 'data/achievements.json');
function syncGalleries() {
  const records = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  for (const record of records) {
    if (!record.photoFolder) continue;
    const folder = path.resolve(root, record.photoFolder);
    if (!folder.startsWith(path.join(root, 'assets/images/achievements') + path.sep)) throw Error('Invalid photo folder');
    if (!fs.existsSync(folder)) { record.photos = []; continue; }
    const metadata = new Map((record.photos || []).map(photo => [photo.src, photo]));
    record.photos = fs.readdirSync(folder, {withFileTypes:true})
      .filter(entry => entry.isFile() && /\.(jpe?g|png|webp|gif|avif)$/i.test(entry.name))
      .sort((a,b) => a.name.localeCompare(b.name, 'en', {numeric:true}))
      .map(entry => {
        const src = record.photoFolder + '/' + entry.name;
        return metadata.get(src) || {src, alt:'Panda Robotics · '+record.event, source:record.source};
      });
  }
  const next = JSON.stringify(records,null,2)+'\n';
  if (next !== fs.readFileSync(dataPath,'utf8')) fs.writeFileSync(dataPath,next);
  return records;
}
module.exports = {syncGalleries};
if (require.main === module) console.log('Updated galleries: '+syncGalleries().reduce((n,r)=>n+r.photos.length,0)+' images.');
