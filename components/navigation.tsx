'use client';
import Link from 'next/link';
import {useState} from 'react';
import {Menu,X} from 'lucide-react';
export function Logo(){return <Link href="/" className="brand" aria-label="Teko Studio home"><img src="/assets/teko-mark.png" alt="" width="42" height="48"/><span>teko<span className="studio">STUDIO</span></span></Link>}
export default function Navigation(){const[open,setOpen]=useState(false);return <header className="site-header"><div className="nav-wrap"><Logo/><button className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav className={open?'nav-links open':'nav-links'} aria-label="Main navigation">{[['Solutions','solutions'],['Industries','industries'],['About Teko','about'],['Contact','contact']].map(([name,id])=><Link key={id} href={'/#'+id} onClick={()=>setOpen(false)}>{name}</Link>)}<Link className="button small" href="/#solutions" onClick={()=>setOpen(false)}>Explore solutions</Link></nav></div></header>}
