import glob from 'glob';
import matter from 'gray-matter';
import marked from 'marked';

export default function parseContent() {
  return new Promise((resolve, reject) => {
    glob('content/**/*.md', (err, res) => {
      let data = {};
      let all_stories = [];

      let renderer = new marked.Renderer();

      (renderer.image = function(href, title, text) {
        console.log(href);
        console.log(title);
      }),
        res.map(file => {
          let slug = file.split('/')[2];
          all_stories.push(slug);
          let out = matter.read(file);
          data[slug] = out.data;
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
