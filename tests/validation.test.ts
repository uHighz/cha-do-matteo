import assert from 'node:assert/strict';
import test from 'node:test';
// @ts-expect-error Node's native TypeScript runner requires the source extension.
import { idSchema, itemsSchema } from '../src/lib/validation.ts';

test('reserva aceita levar, pagar ou combinar as duas formas', () => {
  for (const delivery of ['bring', 'pay']) {
    assert.equal(itemsSchema.safeParse([{ productId: 'diaper-p', delivery }]).success, true);
  }
  assert.equal(itemsSchema.safeParse([
    { productId: 'diaper-m', delivery: 'bring' },
    { productId: 'treat-wipes', delivery: 'pay' },
  ]).success, true);
});

test('cliente não pode fornecer preço ou disponibilidade pelo contrato', () => {
  const parsed = itemsSchema.parse([
    { productId: 'diaper-p', delivery: 'pay', priceCents: 1, available: 999, status: 'paid' },
  ]);
  assert.deepEqual(parsed, [{ productId: 'diaper-p', delivery: 'pay' }]);
});

test('reserva rejeita coleção vazia, excessiva ou de formato incorreto', () => {
  const item = { productId: 'diaper-p', delivery: 'bring' };
  for (const input of [null, {}, 'diaper-p', [], [item, item, item]]) {
    assert.equal(itemsSchema.safeParse(input).success, false, JSON.stringify(input));
  }
});

test('reserva rejeita identificadores inválidos e modalidades desconhecidas', () => {
  for (const item of [
    { delivery: 'bring' }, { productId: '', delivery: 'bring' },
    { productId: 'x'.repeat(81), delivery: 'bring' },
    { productId: 123, delivery: 'bring' }, { productId: 'diaper-p' },
    { productId: 'diaper-p', delivery: 'paid' },
    { productId: 'diaper-p', delivery: null },
  ]) assert.equal(itemsSchema.safeParse([item]).success, false, JSON.stringify(item));
});

test('IDs de convidado e reserva devem ser UUIDs válidos', () => {
  assert.equal(idSchema.safeParse('70c67474-6595-459d-bd13-e3b69a7f0e2d').success, true);
  for (const value of ['', '123', '../admin', null, 17]) {
    assert.equal(idSchema.safeParse(value).success, false);
  }
});
