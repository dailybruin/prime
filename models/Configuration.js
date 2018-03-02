const keystone = require('keystone');
const Types = keystone.Field.Types;

const Configuration = new keystone.List('Configuration', {
  nocreate: true,
  nodelete: true,
  label: 'Site Configuration',
  path:  'configuration',
});

Configuration.add({
  issue: { label: "Current Issue", type: String },
  sections: { note: "All sections that should be displayed on the navbar.", type: Types.TextArray },
  mainarticle: { type: String, label: "Main Article", note: "The slug title of the main article of this issue that will be featured on the front page."},
  featured: { type: Types.TextArray, label: "Featured Articles", note: "The slug titles of the articles of this issue that will be featured on the front page." }
});

Configuration.defaultColumns = 'issue, sections';
Configuration.register();