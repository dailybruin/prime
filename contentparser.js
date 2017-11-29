import glob from 'glob';
import matter from 'gray-matter';

export default function parseContent() {
  return new Promise((resolve, reject) => {
    glob('content/**/*.md', (err, res) => {
      let data = {};
      let all_stories = [];
      res.map(file => {
        let slug = file.split('/')[2];
        all_stories.push(slug);
        data[slug] = matter.read(file).data;
        data[slug].path = '/' + file.split('/')[1] + '/' + slug + '/';
        data[slug].iss = file.split('/')[1];
      });

      let meta = require('./content/meta.json');
      meta['data'] = data;
      meta['allstories'] = all_stories;

      console.log(meta);

      resolve(meta);
    });
  });
}
