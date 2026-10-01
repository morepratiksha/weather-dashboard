import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Forecast } from '../api'
import { toUnit, weekday, type Unit } from '../utils'

const tip = { background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--ink)' }
const axis = { stroke: 'var(--muted)', fontSize: 12, tickLine: false } as const

export default function Charts({ f, unit }: { f: Forecast; unit: Unit }) {
  const start = Math.max(0, f.hourly.time.findIndex((t) => t >= f.current.time.slice(0, 13) + ':00'))
  const hourly = f.hourly.time.slice(start, start + 24).map((t, i) => ({
    hour: t.slice(11, 16),
    temp: toUnit(f.hourly.temperature_2m[start + i], unit),
    rain: f.hourly.precipitation_probability[start + i],
  }))
  const daily = f.daily.time.map((t, i) => ({
    day: weekday(t),
    max: toUnit(f.daily.temperature_2m_max[i], unit),
    min: toUnit(f.daily.temperature_2m_min[i], unit),
    rain: f.daily.precipitation_sum[i],
  }))

  return (
    <div className="charts">
      <section className="panel" aria-label="Next 24 hours temperature">
        <h2>Next 24 hours (°{unit})</h2>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={hourly}>
            <CartesianGrid stroke="var(--line)" vertical={false} />
            <XAxis dataKey="hour" interval={3} {...axis} />
            <YAxis width={36} {...axis} />
            <Tooltip contentStyle={tip} formatter={(v: number) => [`${v}°${unit}`, 'Temperature']} />
            <Area type="monotone" dataKey="temp" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </section>
      <section className="panel" aria-label="7-day highs and lows">
        <h2>7-day high and low (°{unit})</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={daily}>
            <CartesianGrid stroke="var(--line)" vertical={false} />
            <XAxis dataKey="day" {...axis} />
            <YAxis width={36} {...axis} />
            <Tooltip contentStyle={tip} />
            <Line type="monotone" dataKey="max" name="High" stroke="var(--hot)" strokeWidth={2} dot />
            <Line type="monotone" dataKey="min" name="Low" stroke="var(--accent)" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </section>
      <section className="panel" aria-label="7-day rainfall">
        <h2>Rainfall this week (mm)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={daily}>
            <CartesianGrid stroke="var(--line)" vertical={false} />
            <XAxis dataKey="day" {...axis} />
            <YAxis width={36} {...axis} />
            <Tooltip contentStyle={tip} cursor={{ fill: 'var(--line)' }} formatter={(v: number) => [`${v} mm`, 'Rain']} />
            <Bar dataKey="rain" fill="var(--rain)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  )
}
