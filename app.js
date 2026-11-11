import { convert } from './logic.js';

const API = 'https://open.er-api.com/v6/latest/USD';
const POPULAR = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'RUB', 'KZT', 'TRY', 'UZS'];
const CACHE_MS = 60 * 60 * 1000;

const $ = (id) => document.getElementById(id);
const store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const names = new Intl.DisplayNames(['en'], { type: 'currency' });
const currencyName = (code) => { try { return names.of(code); } catch { return code; } };
const money = (value, code) => new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(value);
const rateFmt = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 6 });

let data = null; // { rates, updated }

async function loadRates() {
  const cached = store.get('rates');
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) return cached;
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.result !== 'success') throw new Error('Rate service error');
    const fresh = { rates: json.rates, updated: json.time_last_update_utc, fetchedAt: Date.now() };
    store.set('rates', fresh);
    return fresh;
  } catch (err) {
    if (cached) { $('status').textContent = 'Offline — showing saved rates.'; return cached; }
    throw err;
  }
}

function fillSelects(codes) {
  for (const sel of [$('from'), $('to')]) {
    sel.replaceChildren(...codes.map((code) => new Option(`${code} — ${currencyName(code)}`, code)));
  }
  const saved = store.get('pair') ?? ['USD', 'EUR'];
  $('from').value = codes.includes(saved[0]) ? saved[0] : 'USD';
  $('to').value = codes.includes(saved[1]) ? saved[1] : 'EUR';
}

function update() {
  if (!data) return;
  const from = $('from').value;
  const to = $('to').value;
  const amount = $('amount').valueAsNumber;
  store.set('pair', [from, to]);

  if (!Number.isFinite(amount) || amount < 0) {
    $('result').textContent = '—';
  } else {
    $('result').textContent = money(convert(amount, from, to, data.rates), to);
  }
  $('rate').textContent = `1 ${from} = ${rateFmt.format(convert(1, from, to, data.rates))} ${to}`;

  $('popular').replaceChildren(...POPULAR.filter((c) => c !== from && c in data.rates).map((code) => {
    const tr = document.createElement('tr');
    const left = document.createElement('td');
    left.innerHTML = `<strong>${code}</strong> <span class="name"></span>`;
    left.querySelector('.name').textContent = currencyName(code);
    const right = document.createElement('td');
    right.textContent = `${rateFmt.format(convert(1, from, code, data.rates))}`;
    tr.append(left, right);
    return tr;
  }));
  $('popular-title').textContent = `1 ${from} in popular currencies`;
}

$('form').addEventListener('input', update);
$('form').addEventListener('submit', (e) => e.preventDefault());
$('swap').addEventListener('click', () => {
  [$('from').value, $('to').value] = [$('to').value, $('from').value];
  update();
});

try {
  data = await loadRates();
  fillSelects(Object.keys(data.rates).sort());
  update();
  if (!$('status').textContent) {
    $('status').textContent = `Rates updated ${new Date(data.updated).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}`;
  }
} catch (err) {
  $('result').textContent = '—';
  $('status').textContent = `Could not load exchange rates (${err.message}). Please try again later.`;
}
