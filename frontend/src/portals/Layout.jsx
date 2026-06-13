// Fixed imports for portal Layout
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout({ portal, children }) {
  return (
    <div className="app-shell">
      <Sidebar portal={portal} />
      <div className="content">
        <Topbar />
        <main className="page">{children}</main>
      </div>
    </div>
  )
}
