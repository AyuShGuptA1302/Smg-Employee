export default function StatCard({ title, value, subtitle, badge, onClick }) {
  return (
    <div className="card kpi" onClick={onClick} style={{cursor: onClick ? 'pointer' : 'default'}}>
      <div>
        <div style={{fontWeight:700, fontSize:18}}>{value}</div>
        <div className="label">{title}</div>
      </div>
      {badge && <span className={`badge ${badge.type}`}>{badge.label}</span>}
      {subtitle && <div style={{marginLeft:'auto', color:'var(--text-muted)'}}>{subtitle}</div>}
    </div>
  )
}
