import { execSync } from 'child_process';
import { cpSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const outDir = '.vercel/output';

console.log('--- Vercel Build Betiği Başlatıldı ---');

execSync('bun turbo run build', { stdio: 'inherit' });

rmSync(outDir, { recursive: true, force: true });


const functionsDir = join(outDir, 'functions/index.func');
mkdirSync(functionsDir, { recursive: true });


cpSync('apps/server/dist/', functionsDir, { recursive: true });


const functionConfig = {
    runtime: 'nodejs20.x',
    handler: 'index.js',
};
writeFileSync(
    join(functionsDir, '.vc-config.json'),
    JSON.stringify(functionConfig)
);
console.log('.vc-config.json fonksiyon yapılandırması oluşturuldu.');

cpSync('apps/web/dist/', join(outDir, 'static'), { recursive: true });
console.log('Frontend dosyaları static klasörüne kopyalandı.');


const vercelConfig = {
    version: 3,
    routes: [{ src: '/(.*)', dest: '/index' }],
};
writeFileSync(join(outDir, 'config.json'), JSON.stringify(vercelConfig));
console.log('config.json yönlendirme dosyası oluşturuldu.');

console.log('\n--- Vercel Build Betiği Başarıyla Tamamlandı ---');