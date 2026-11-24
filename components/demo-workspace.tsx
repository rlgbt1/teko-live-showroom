'use client';
import Link from 'next/link';
import {BarChart3,Layers3,PanelLeftClose,Database} from 'lucide-react';
import {Logo} from './navigation';
import {products} from '@/data/showroom';
import AnalyticsDemo from './analytics-demo';
import ProjectDemo from './project-demo';
import BdaScraperDemo from './bda-scraper-demo';
export default function DemoWorkspace({slug}:{slug:string}){return <div className="demo-shell"><aside className="demo-sidebar"><Logo/><p className="eyebrow">LIVE SHOWROOM</p><nav aria-label="Demo navigation">{products.map((p)=>{const Icon=({database:Database,chart:BarChart3,project:Layers3})[p.icon] || Database;return <Link key={p.slug} href={'/demos/'+p.slug} className={slug===p.slug?'active':''} aria-current={slug===p.slug?'page':undefined}><Icon size={19}/>{p.title}</Link>})}</nav><div className="sidebar-note"><span className="live-dot"/> Um espaço para explorar.<p>Dados fictícios. Possibilidades reais.</p></div><Link href="/#solutions" className="back-showroom"><PanelLeftClose size={18}/> Voltar ao showroom</Link></aside><div className="demo-content"><header className="demo-topbar"><span>Teko Studio <span className="crumb">/</span> {products.find(p=>p.slug===slug)?.title}</span><span className="prototype-label">PROTÓTIPO INTERACTIVO</span></header><main id="main" className="workspace" lang="pt-AO">{slug==='bda-scraper'?<BdaScraperDemo/>:slug==='business-intelligence'?<AnalyticsDemo/>:<ProjectDemo/>}<p className="demo-disclaimer">Ambiente de demonstração. Os dados são fictícios e as alterações são temporárias nesta sessão.</p></main></div></div>}
