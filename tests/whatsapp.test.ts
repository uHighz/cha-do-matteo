import assert from 'node:assert/strict';
import test from 'node:test';
// @ts-expect-error Node's native TypeScript runner requires the source extension.
import { defaultMode, defaultNotice, fillNotice, firstName, whatsappLink, whatsappNumber } from '../src/lib/whatsapp.ts';

test('número brasileiro sem código do país recebe 55', () => {
  assert.equal(whatsappNumber('(35) 99999-1234'), '5535999991234');
  assert.equal(whatsappNumber('3533331234'), '553533331234');
  assert.equal(whatsappNumber('5532221234'), '555532221234');
});

test('zero na frente e celular sem o nono dígito são corrigidos', () => {
  assert.equal(whatsappNumber('035999991234'), '5535999991234');
  assert.equal(whatsappNumber('0 15 35 99999-1234'), '5535999991234');
  assert.equal(whatsappNumber('3599991234'), '5535999991234');
  assert.equal(whatsappNumber('3533331234'), '553533331234');
  assert.equal(whatsappNumber('0123'), null);
});

test('número com código do país é mantido e inválido é recusado', () => {
  assert.equal(whatsappNumber('+55 35 99999-1234'), '5535999991234');
  assert.equal(whatsappNumber('+351 912 345 678'), '351912345678');
  assert.equal(whatsappNumber('REMOVIDO'), null);
  assert.equal(whatsappNumber('123'), null);
});

test('mensagem usa o primeiro nome e o link codifica o texto', () => {
  assert.equal(firstName('  Maria   da Silva '), 'Maria');
  const text = fillNotice(defaultNotice, 'Maria da Silva');
  assert.match(text, /^Oi, Maria!/);
  assert.match(text, /12h/);
  const link = whatsappLink('35999991234', text);
  assert.ok(link?.startsWith('https://wa.me/5535999991234?text='));
  const url = new URL(link!);
  assert.equal(url.searchParams.get('text'), text);
  assert.match(url.searchParams.get('text')!, /💙/);
  assert.match(url.searchParams.get('text')!, /🦒🐘/);
  assert.equal(whatsappLink('abc', text), null);
});

test('cada modo abre o destino certo, com o mesmo texto', () => {
  const text = fillNotice(defaultNotice, 'Bruna');
  const app = whatsappLink('35999991234', text, 'app')!;
  const web = whatsappLink('35999991234', text, 'web')!;
  assert.ok(app.startsWith('whatsapp://send?phone=5535999991234&text='));
  assert.ok(web.startsWith('https://web.whatsapp.com/send?phone=5535999991234&text='));
  for (const link of [app, web]) assert.equal(decodeURIComponent(link.split('&text=')[1]), text);
  assert.equal(defaultMode('Mozilla/5.0 (Linux; Android 14) Mobile'), 'phone');
  assert.equal(defaultMode('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'), 'web');
});

test('placeholder aceita chaves duplas e maiúsculas', () => {
  assert.equal(fillNotice('Oi, {{nome}}! Oi, {Nome}! Oi, { nome }!', 'Bruna Lima'), 'Oi, Bruna! Oi, Bruna! Oi, Bruna!');
});
