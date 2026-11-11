// rates are relative to one base currency, e.g. { USD: 1, EUR: 0.92, ... }
export function convert(amount, from, to, rates) {
  if (!Number.isFinite(amount) || amount < 0) throw new Error('Amount must be a non-negative number');
  if (!(from in rates) || !(to in rates)) throw new Error('Unknown currency');
  return (amount / rates[from]) * rates[to];
}
