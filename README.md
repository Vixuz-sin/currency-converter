# 💱 Currency Converter

Convert between 160+ currencies with live exchange rates.

**Live demo:** https://currency-converter-eight-theta-46.vercel.app

## Features

- 160+ currencies with full names
- Live rates, cached for an hour, with an offline fallback to the last saved rates
- One-click swap
- Table of popular currencies (USD, EUR, GBP, JPY, CNY, RUB, KZT, TRY, UZS)
- Remembers your last currency pair
- Light and dark mode

## Tech

Vanilla HTML, CSS and JavaScript (ES modules), no build step.
Rates from [ExchangeRate-API](https://www.exchangerate-api.com) (open access endpoint). Deployed on Vercel.

## Run locally

```bash
npx serve .
```

## Tests

The conversion logic lives in `logic.js` and has a small test file:

```bash
node logic.test.mjs
```
