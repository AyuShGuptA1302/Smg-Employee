import { useEffect, useState } from 'react'

export default function Topbar() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const dateStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dayStr = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: '2-digit' })

  return (
    <div className="topbar">
      <div className="clock">{dateStr} · {dayStr}</div>
      <div className="search"><input placeholder="Search pages, actions..." /></div>
      <div className="actions">
        <span>✉️</span>
        <span>🔔</span>
      </div>
      <div className="avatar">
        <div className="pic" />
        <div className="meta">
          <span className="name">Rohit Sharma</span>
          <span className="role">Senior Technician</span>
        </div>
      </div>
    </div>
  )
}
