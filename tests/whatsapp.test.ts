import assert from 'node:assert/strict';
import test from 'node:test';
// @ts-expect-error Node's native TypeScript runner requires the source extension.
import { defaultNotice, fillNotice, firstName, whatsappLink, whatsappNumber } from '../src/lib/whatsapp.ts';

test('número brasileiro sem código do país recebe 55', () => {
  assert.equal(whatsappNumber('(35) 99999-1234'), '5535999991234');
  assert.equal(whatsappNumber('3533331234'), '553533331234');
  assert.equal(whatsappNumber('5599999999'), '555599999999');
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
  assert.equal(decodeURIComponent(link!.split('?text=')[1]), text);
  assert.equal(whatsappLink('abc', text), null);
});
