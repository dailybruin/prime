import glob from 'glob';
import matter from 'gray-matter';

export default function parseContent() {
  return new Promise((resolve, reject) => {
    glob('content/**/*.md', (err, res) => {
      let data = {};
      res.map(file => {
        let slug = file.split('/')[2];
        data[slug] = matter.read(file).data;
      });

      let meta = require('./content/meta.json');
      meta['data'] = data;

      console.log(meta);

      resolve(meta);
    });
  });
}
