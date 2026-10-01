# Skyline: weather dashboard

A React + TypeScript dashboard that shows current conditions, a 7-day forecast and charts for any city. Data comes from the free [Open-Meteo](https://open-meteo.com) APIs, so no API key or backend is needed.

**Live demo:** _add your Vercel/Netlify link here_ · **Screenshot:** _add a screenshot or GIF here_

## Features
- City search with debounced geocoding and a results dropdown
- Current conditions plus 7-day summary strip
- Charts (Recharts): next-24-hour temperature, 7-day high/low, weekly rainfall
- °C/°F toggle that converts client-side, so no refetch
- Light and dark theme, following the system setting by default
- TanStack Query caching (10-minute stale time), loading skeleton, error state with retry
- Selected city, unit and theme persist in localStorage
- Responsive, keyboard-friendly, reduced-motion support

## Stack
React 18 · TypeScript · Vite · TanStack Query · Recharts · Vitest

## Getting started
```bash
npm install
npm run dev
npm test
npm run build
```

## Structure
```
src/
  api.ts               Open-Meteo geocoding + forecast calls
  utils.ts             unit conversion, weather code labels, safe storage helpers
  components/Charts.tsx
  App.tsx              search, state, layout
```

## What I'd add next
Recent-city history, geolocation ("use my location"), an hourly precipitation chart, and component tests with React Testing Library.

## Deploy
Import the repo on Vercel or Netlify (build command `npm run build`, output `dist`).
