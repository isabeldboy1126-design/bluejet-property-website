const fs = require('fs');

const files = [
  'app/page.tsx',
  'app/estates/page.tsx',
  'app/estates/[slug]/page.tsx',
  'app/about/page.tsx',
  'app/contact/page.tsx',
  'app/verification/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace \" with "
    content = content.replace(/\\"/g, '"');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned backslashes in:', file);
  }
});
