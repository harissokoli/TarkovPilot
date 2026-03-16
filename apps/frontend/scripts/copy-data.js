import { copyFileSync, mkdirSync } from 'fs';

const src = '/vercel/share/v0-project/user_read_only_context/text_attachments/readable_decoded-kNj3H.json';
const destDir = '/vercel/share/v0-project/public/data';
const dest = `${destDir}/markers.json`;

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log('Copied markers.json to public/data/');
