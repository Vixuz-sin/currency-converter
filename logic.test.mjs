import assert from 'node:assert/strict';
import { convert } from './logic.js';

const rates = { USD: 1, EUR: 0.5, UZS: 12500 };
assert.equal(convert(10, 'USD', 'EUR', rates), 5);
assert.equal(convert(1, 'EUR', 'UZS', rates), 25000);
assert.equal(convert(0, 'USD', 'UZS', rates), 0);
assert.equal(convert(7, 'EUR', 'EUR', rates), 7);
assert.throws(() => convert(1, 'USD', 'XXX', rates));
assert.throws(() => convert(-1, 'USD', 'EUR', rates));
assert.throws(() => convert(NaN, 'USD', 'EUR', rates));
console.log('currency logic: all tests passed');
