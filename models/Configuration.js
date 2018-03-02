const keystone = require('keystone');
const Types = keystone.Field.Types;

const Configuration = new keystone.List('Configuration', {
  nocreate: true,
  nodelete: true,
  label: 'Site Configuration',
  path:  'configuration',
});

Configuration.add({
  issue: { type: String },
  sections: { type: Types.TextArray },
});

Configuration.defaultColumns = 'issue, sections';
Configuration.register();