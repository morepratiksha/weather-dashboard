import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getForecast, searchCities, type City } from './api'
import Charts from './components/Charts'
import { load, save, toUnit, weatherLabel, weekday, type Unit } from './utils'

const DEFAULT_CITY: City = { id: 2643743, name: 'London', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257 }

export default function App() {
  const [city, setCity] = useState<City>(() => load('sky-city', DEFAULT_CITY))
  const [unit, setUnit] = useState<Unit>(() => load('sky-unit', 'C'))
  const [dark, setDark] = useState<boolean>(() => load('sky-dark', window.matchMedia('(prefers-color-scheme: dark)').matches))
  const [term, setTerm] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => { save('sky-city', city) }, [city])
  useEffect(() => { save('sky-unit', unit) }, [unit])
  useEffect(() => {
    save('sky-dark', dark)
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])
  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 350)
    return () => clearTimeout(t)
  }, [term])

  const search = useQuery({ queryKey: ['search', debounced], queryFn: () => searchCities(debounced), enabled: debounced.length >= 2 })
  const weather = useQuery({ queryKey: ['forecast', city.id], queryFn: () => getForecast(city), staleTime: 10 * 60_000 })
  const f = weather.data

  return (
    <div className="app">
      <header className="top">
        <h1>Skyline</h1>
        <div className="search">
          <label htmlFor="city">Search city</label>
          <input id="city" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Try Tokyo or Nairobi" autoComplete="off" />
          {debounced.length >= 2 && term && (
            <ul className="search__list">
              {search.isLoading && <li className="search__empty">Searching…</li>}
              {search.data?.length === 0 && <li className="search__empty">No city found. Check the spelling.</li>}
              {search.data?.map((c) => (
                <li key={c.id}>
                  <button onClick={() => { setCity(c); setTerm('') }}>
                    {c.name}{c.admin1 ? `, ${c.admin1}` : ''}, {c.country}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="toggles">
          <button className="chip" onClick={() => setUnit(unit === 'C' ? 'F' : 'C')} aria-label={`Switch to °${unit === 'C' ? 'F' : 'C'}`}>°{unit}</button>
          <button className="chip" onClick={() => setDark(!dark)} aria-pressed={dark}>{dark ? 'Dark' : 'Light'}</button>
        </div>
      </header>

      {weather.isError && (
        <div className="panel panel--error" role="alert">
          <p>Couldn't load the forecast for {city.name}. Check your connection and try again.</p>
          <button className="chip" onClick={() => weather.refetch()}>Retry</button>
        </div>
      )}

      {weather.isLoading && <div className="skeleton" aria-busy="true" aria-label="Loading forecast" />}

      {f && (
        <>
          <section className="now panel" aria-label="Current conditions">
            <div>
              <p className="now__place">{city.name}, {city.country}</p>
              <p className="now__temp">{toUnit(f.current.temperature_2m, unit)}°{unit}</p>
              <p>{weatherLabel(f.current.weather_code)}</p>
            </div>
            <dl className="now__stats">
              <div><dt>Feels like</dt><dd>{toUnit(f.current.apparent_temperature, unit)}°</dd></div>
              <div><dt>Humidity</dt><dd>{f.current.relative_humidity_2m}%</dd></div>
              <div><dt>Wind</dt><dd>{Math.round(f.current.wind_speed_10m)} km/h</dd></div>
            </dl>
          </section>
          <ol className="week" aria-label="7-day forecast">
            {f.daily.time.map((t, i) => (
              <li key={t}>
                <strong>{weekday(t)}</strong>
                <span>{weatherLabel(f.daily.weather_code[i])}</span>
                <span>{toUnit(f.daily.temperature_2m_max[i], unit)}° / {toUnit(f.daily.temperature_2m_min[i], unit)}°</span>
              </li>
            ))}
          </ol>
          <Charts f={f} unit={unit} />
        </>
      )}
      <footer className="foot">Data from Open-Meteo. Forecasts are cached for 10 minutes.</footer>
    </div>
  )
}
