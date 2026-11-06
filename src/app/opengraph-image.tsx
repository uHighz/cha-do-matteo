import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Convite para o Chá do Matteo, uma pequena grande aventura.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const illustration = await readFile(join(process.cwd(), 'public/safari-familia-transparente.png'));
  const illustrationSrc = `data:image/png;base64,${illustration.toString('base64')}`;

  return new ImageResponse(
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
      background: 'linear-gradient(120deg, #faf9f5 0%, #f1f3e8 100%)',
      color: '#354b3b',
      fontFamily: 'sans-serif',
    }}>
      <div style={{
        width: 680,
        boxSizing: 'border-box',
        height: '100%',
        padding: '76px 0 68px 78px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, fontSize: 18, letterSpacing: 4, color: '#718b70' }}>
          <span style={{ width: 11, height: 11, borderRadius: 20, background: '#8ba38e' }} />
          UMA PEQUENA GRANDE AVENTURA
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 31, fontSize: 82, lineHeight: 1.02, letterSpacing: -3, fontFamily: 'Georgia, serif' }}>
          <span>Chá do</span>
          <span style={{ color: '#789778', fontStyle: 'italic' }}>Matteo</span>
        </div>
        <div style={{ display: 'flex', marginTop: 29, fontSize: 24, lineHeight: 1.45, color: '#536552' }}>
          Um encontro cheio de carinho
        </div>
        <div style={{ display: 'flex', marginTop: 11, fontSize: 19, color: '#788474' }}>
          21 de novembro de 2026 · Pouso Alegre, MG
        </div>
      </div>
      <div style={{
        position: 'absolute',
        width: 490,
        height: 490,
        right: 0,
        top: 70,
        borderRadius: 999,
        background: '#e7ecdf',
      }} />
      <img src={illustrationSrc} width={470} height={550} style={{ position: 'absolute', right: 20, bottom: -12, objectFit: 'contain' }} />
      <div style={{ position: 'absolute', bottom: 33, left: 82, width: 490, height: 1, background: '#dce4d8' }} />
    </div>,
    { ...size },
  );
}
