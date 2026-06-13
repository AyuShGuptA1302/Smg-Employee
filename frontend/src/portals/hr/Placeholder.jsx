import Layout from '../../components/Layout'

export default function Placeholder({ title }){
  return (
    <Layout portal="hr">
      <div className="hero"><div className="title">{title}</div></div>
      <div className="card" style={{marginTop:16}}>Content coming soon.</div>
    </Layout>
  )
}
