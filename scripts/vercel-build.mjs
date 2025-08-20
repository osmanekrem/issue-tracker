import { execSync } from 'child_process';
import { cpSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const outDir = '.vercel/output';

console.log('--- Vercel Build Script Başlatıldı ---');

console.log('Turborepo ile tüm uygulamalar derleniyor...');
execSync('bun turbo run build', { stdio: 'inherit' });

console.log(`Eski çıktı klasörü (${outDir}) temizleniyor...`);
rmSync(outDir, { recursive: true, force: true });

const functionsDir = join(outDir, 'functions/index.func');
const staticDir = join(outDir, 'static');
mkdirSync(functionsDir, { recursive: true });
mkdirSync(staticDir, { recursive: true });
console.log('Vercel çıktı klasör yapısı oluşturuldu.');

console.log('Backend dosyaları kopyalanıyor...');
cpSync('apps/server/dist/', functionsDir, { recursive: true });

console.log('Frontend dosyaları kopyalanıyor...');
cpSync('apps/web/dist/', staticDir, { recursive: true });

const config = {
    version: 3,
    routes: [{ src: '/(.*)', dest: '/index' }],
};
writeFileSync(join(outDir, 'config.json'), JSON.stringify(config));
console.log('config.json oluşturuldu.');

console.log('--- Vercel Build Script Tamamlandı ---');