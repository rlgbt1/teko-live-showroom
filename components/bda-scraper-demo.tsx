'use client';
import {useState,useEffect,useLayoutEffect,useRef} from 'react';
import {IBM_Plex_Sans,IBM_Plex_Mono} from 'next/font/google';
import {Landmark,Globe,BarChart3,Cpu,History,Bot,ShieldCheck,FileSpreadsheet,RefreshCw,Download,Sparkles,Activity,TriangleAlert,Info,TrendingUp} from 'lucide-react';
import styles from './bda-scraper-demo.module.css';
const sans=IBM_Plex_Sans({weight:['400','500','600','700'],subsets:['latin'],variable:'--bda-sans'});
const mono=IBM_Plex_Mono({weight:['400','500'],subsets:['latin'],variable:'--bda-mono'});
const DATA={
  luibor:[['Overnight',18.92,18.95,18.97],['1 Mês',19.84,19.86,19.90],['3 Meses',20.71,20.74,20.73],['6 Meses',21.45,21.50,21.52],['9 Meses',22.03,22.05,22.10],['12 Meses',22.61,22.66,22.70]],
  fx:[['USD / AOA',911.42,911.87,912.30],['EUR / AOA',1052.10,1055.36,1058.41],['ZAR / AOA',50.08,50.21,50.12]],
  global:[['S&P 500',6812.4,6840.1,6829.7],['Brent (USD/bbl)',71.82,72.40,73.05],['Ouro (USD/oz)',4012.5,4035.8,4028.1],['Bitcoin (USD)',96420,97810,98955],['BODIVA · Volume (M Kz)',412.6,388.2,431.9]],
};
const NODES={
  bna:{name:'BNA',sub:'Playwright',icon:'landmark',desc:'Curva LUIBOR, câmbios oficiais, taxa BNA e inflação.',stats:[['REGISTOS','14'],['TENTATIVAS','1 / 2'],['LATÊNCIA','1,6 s']]},
  yf:{name:'Yahoo Finance',sub:'yfinance',icon:'globe',desc:'Índices globais, commodities, minerais e cripto.',stats:[['REGISTOS','12'],['TENTATIVAS','1 / 2'],['LATÊNCIA','0,9 s']]},
  bodiva:{name:'BODIVA',sub:'Playwright',icon:'bars',desc:'Acções cotadas e volumes por segmento de mercado.',stats:[['REGISTOS','9'],['TENTATIVAS','1 / 2'],['LATÊNCIA','1,2 s']]},
  agg:{name:'Agregador',sub:'aggregator_v2',icon:'cpu',desc:'Normaliza formatos angolanos e atribui um estado a cada fonte.',stats:[['SECÇÕES','6 / 6'],['NORMALIZADOS','35'],['DURAÇÃO','0,7 s']]},
  hist:{name:'Histórico',sub:'JSON · 7 dias',icon:'history',desc:'Guarda sete dias de leituras: D-2, D-1 e D mesmo com uma fonte em baixo.',stats:[['DIAS','7'],['LEITURAS','245'],['ESTADO','Sincronizado']]},
  ai:{name:'Fallback IA',sub:'OpenAI + web',icon:'bot',desc:'Só corre para secções em falta. Cada valor é verificado e assinalado para revisão.',stats:[['SECÇÕES','1'],['VALORES','1'],['VERIFICAR','Sim']]},
  val:{name:'Validação',sub:'range checks',icon:'shield',desc:'Cada valor é comparado com intervalos esperados antes de ser aceite.',stats:[['VERIFICADOS','35'],['REJEITADOS','0'],['QUALIDADE','94%']]},
  csv:{name:'CSV',sub:'exportação',icon:'sheet',desc:'Um ficheiro limpo e seccionado, pronto para o Resumo Diário dos Mercados.',stats:[['SECÇÕES','3'],['LINHAS','14'],['FORMATO','PT-AO']]},
} as const;
type NodeId=keyof typeof NODES;
const icons={landmark:Landmark,globe:Globe,bars:BarChart3,cpu:Cpu,history:History,bot:Bot,shield:ShieldCheck,sheet:FileSpreadsheet};
const EDGES: [NodeId,NodeId][]=[['bna','agg'],['yf','agg'],['bodiva','agg'],['agg','val'],['hist','val'],['agg','ai'],['ai','val'],['val','csv']];
const fmt=(n:number)=>n.toLocaleString('pt-PT',{minimumFractionDigits:2,maximumFractionDigits:2});
const positions={bna:'1 / 1',yf:'2 / 1',bodiva:'3 / 1',agg:'2 / 2',hist:'1 / 3',val:'2 / 3',ai:'3 / 3',csv:'2 / 4'};
export default function BdaScraperDemo(){
 const [fallback,setFallback]=useState(false),[usedFallback,setUsedFallback]=useState(false),[running,setRunning]=useState(false),[ran,setRan]=useState(false);
 const [states,setStates]=useState<Partial<Record<NodeId,string>>>({}),[selected,setSelected]=useState<NodeId>('agg');
 const [tab,setTab]=useState('mercados'),[modal,setModal]=useState(false),[copy,setCopy]=useState('COPIAR');
 const [date,setDate]=useState(''),[sync,setSync]=useState('--:--'),[runs,setRuns]=useState(0);
 const [paths,setPaths]=useState<string[]>([]);
 const flow=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null),alive=useRef(true),lock=useRef(false);
 useEffect(()=>{alive.current=true;setDate(new Date().toLocaleDateString('pt-PT'));return()=>{alive.current=false}},[]);
 useLayoutEffect(()=>{
  const el=flow.current;if(!el)return;
  const draw=()=>{const box=el.getBoundingClientRect();setPaths(EDGES.map(([a,b])=>{
   const A=el.querySelector<HTMLElement>('[data-node="'+a+'"]')!.getBoundingClientRect(),B=el.querySelector<HTMLElement>('[data-node="'+b+'"]')!.getBoundingClientRect();
   const ax=A.right-box.left,ay=A.top-box.top+A.height/2,bx=B.left-box.left,by=B.top-box.top+B.height/2;
   if(bx>ax-2)return 'M'+ax+' '+ay+' C'+(ax+bx)/2+' '+ay+','+(ax+bx)/2+' '+by+','+bx+' '+by;
   const x=A.left-box.left+A.width/2,y=(B.top>A.bottom?A.bottom:A.top)-box.top,y2=(B.top>A.bottom?B.top:B.bottom)-box.top;
   return 'M'+x+' '+y+' C'+x+' '+(y+y2)/2+','+x+' '+(y+y2)/2+','+x+' '+y2;
  }))};
  draw();const observer=new ResizeObserver(draw);observer.observe(el);el.querySelectorAll('button').forEach(n=>observer.observe(n));return()=>observer.disconnect();
 },[]);
 useEffect(()=>{if(modal)dialog.current?.showModal();else dialog.current?.close()},[modal]);
 const mark=(id:NodeId,status:string)=>setStates(s=>({...s,[id]:status}));
 async function run(){
  if(lock.current)return;lock.current=true;setRunning(true);setRan(false);setStates({});setUsedFallback(fallback);
  const sequence:NodeId[]=['bna','yf','bodiva','agg','hist',...(fallback?['ai' as NodeId]:[]),'val','csv'];
  for(const id of sequence){if(!alive.current)return;mark(id,'busy');await new Promise(r=>setTimeout(r,650));if(!alive.current)return;mark(id,id==='ai'?'flag':'done')}
  setRan(true);setRunning(false);lock.current=false;setSync(new Date().toLocaleTimeString('pt-PT'));setRuns(n=>n+1);
 }
 const csv=['# BDA × TekoAI — '+date,'# DEMO INTERACTIVA · DADOS FICTÍCIOS','Instrumento;D-2;D-1;D;Var %;Fonte',...Object.values(DATA).flatMap(rows=>rows.map(([name,a,b,c])=>[name,fmt(Number(a)),fmt(Number(b)),fmt(Number(c)),fmt((Number(c)-Number(b))/Number(b)*100)+'%',usedFallback&&String(name).includes('BODIVA')?'IA (verificar)':'Primária (simulada)'].join(';')))].join('\n');
 function download(){const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='bda-mercados-demo.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 const node=NODES[selected],Icon=icons[node.icon],status=states[selected];
 const verified=['bna','yf','bodiva'].filter(id=>states[id as NodeId]==='done').length;
 return <div className={styles.root+' '+sans.variable+' '+mono.variable} lang="pt"><div className="app"><div className="main">
 <div className="demo-pill"><i/>DEMO INTERACTIVA · DADOS FICTÍCIOS</div>
 <header><div className="title"><Landmark size={40} color="#7B1E2B"/><div><h1>BDA <span>×</span> TekoAI</h1><p>MARKET INTELLIGENCE PLATFORM</p></div></div><div className="meta"><div><label>DATA</label><span>{date}</span></div><div><label>ÚLTIMA SINCRONIZAÇÃO</label><span>{sync}</span></div><div><label>ESTADO</label><span className="ok">● OPERACIONAL</span></div></div></header>
 <div className="controls"><button className="run" disabled={running} onClick={run}><RefreshCw className="i"/>{running?'A EXECUTAR…':'EXECUTAR ACTUALIZAÇÃO'}</button><button className={'export '+(ran?'show':'')} onClick={()=>{setCopy('COPIAR');setModal(true)}}><Download className="i"/>EXPORTAR CSV</button><button className={'toggle '+(fallback?'on':'')} role="switch" aria-checked={fallback} disabled={running} onClick={()=>setFallback(!fallback)}><i/><Sparkles className="i"/>Fallback ChatGPT</button></div>
 <div className="section-label">FONTES DE DADOS</div><div className="cards">
 {(['bna','yf','bodiva'] as NodeId[]).map((id,i)=>{const SourceIcon=icons[NODES[id].icon],done=states[id]==='done';return <button className={'card src '+(selected===id?'sel':'')} key={id} onClick={()=>setSelected(id)}><h4><span className="ib"><SourceIcon className="i"/></span>{NODES[id].name.toUpperCase()}</h4><label>STATUS</label><div className={'v status '+(done?'live':states[id]==='busy'?'busy':'')}>{done?'ACTIVO':states[id]==='busy'?'A RECOLHER':'EM ESPERA'}</div><label>QUALIDADE DOS DADOS · SIMULADA</label><div className="bar"><i style={{width:done?[94,99,91][i]+'%':'0%',background:'var(--green)'}}/></div><div className="pct">{done?[94,99,91][i]+'%':'—'}</div><label>VALIDAÇÃO</label><div className="approved">{done?'APROVADA':'PENDENTE'}</div></button>})}
 <div className="card global"><h4><Activity className="i"/>QUALIDADE GLOBAL</h4><div className="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#eee" strokeWidth="7"/><circle cx="50" cy="50" r="42" fill="none" stroke="#D9952E" strokeWidth="7" strokeDasharray={ran?'248 999':'0 999'} transform="rotate(-90 50 50)"/><text x="50" y="57" textAnchor="middle" fontSize="20">{ran?'94%':'—'}</text></svg><div><b>Qualidade</b><small>dos dados</small></div></div><div className="kv"><span>FONTES VERIFICADAS</span><span>{verified}/3</span></div><div className="kv"><span>EXECUÇÕES NESTA SESSÃO</span><span>{runs}</span></div><div className="kv"><span>VALIDAÇÃO POR CÓDIGO</span><span>{ran?'CONCLUÍDA':'PENDENTE'}</span></div></div></div>
 <div className="section-label">FLUXO DE DADOS <em>Clique num nó para ver detalhes</em></div><div className="flow-wrap"><div className="flow-scroll"><div className="flow" ref={flow}><svg className="edges" aria-hidden="true">{paths.map((d,i)=>{const [a,b]=EDGES[i],off=(a==='ai'||b==='ai')&&!fallback;return <g key={a+b}><path d={d} className={'edge '+(off?'off dash':'')}/><path d={d} className={'pulse-line '+(!off&&(states[a]==='done'||states[a]==='flag')?(states[b]==='busy'?'active':states[b]==='done'||states[b]==='flag'?'done':''):'')}/></g>})}</svg>
 {(Object.keys(NODES) as NodeId[]).map(id=>{const n=NODES[id],I=icons[n.icon];return <button data-node={id} style={{gridArea:positions[id]}} className={'node '+(states[id]||'')+' '+(selected===id?'sel':'')+' '+(id==='ai'&&!fallback?'off':'')} key={id} onClick={()=>setSelected(id)} aria-pressed={selected===id}><span className="tag">IA</span><span className="nico"><I className="i"/></span><span><b>{n.name}</b><small>{n.sub}</small></span><span className="ndot">{states[id]==='done'?'✓':states[id]==='flag'?'!':''}</span></button>})}</div></div>
 <div className="detail"><div className="dico"><Icon/></div><div><h3>{node.name}<span className={status||''}>{selected==='ai'&&!fallback?'INACTIVO':status==='done'?'CONCLUÍDO':status==='flag'?'VERIFICAR':status==='busy'?'EM CURSO':'EM ESPERA'}</span></h3><p>{node.desc}</p>{selected==='csv'&&ran&&<button className="dact" onClick={()=>setModal(true)}>ABRIR CSV</button>}</div><div className="dstats">{node.stats.map(([k,v])=><div key={k}><label>{k}</label><span>{status==='done'||status==='flag'?v:'—'}</span></div>)}</div></div></div>
 <div className={'alerts '+(ran?(usedFallback?'warn':'done'):'')} role="status"><b><TriangleAlert className="i"/>ALERTAS DO SISTEMA</b><span>{running?'Simulação em curso — a recolher e validar dados…':ran?usedFallback?'BODIVA: 1 valor simulado via fallback IA — verificar manualmente':'Actualização concluída — 3/3 fontes verificadas, sem avisos':'Pronto para iniciar. Nenhuma fonte externa será consultada.'}</span></div>
 <div className="tabs" role="tablist" aria-label="Dados de mercado"><button role="tab" aria-selected={tab==='mercados'} onClick={()=>setTab('mercados')} className={tab==='mercados'?'on':''}><TrendingUp className="i"/>MERCADOS</button><button role="tab" aria-selected={tab==='info'} onClick={()=>setTab('info')} className={tab==='info'?'on':''}><Info className="i"/>INFORMAÇÃO</button></div>
 {tab==='mercados'?<div className="tables">{Object.entries(DATA).map(([key,rows])=><div className={'tbl '+(key==='global'?'wide':'')} key={key}><h5>{key==='luibor'?'MERCADO MONETÁRIO — TAXAS LUIBOR':key==='fx'?'MERCADO CAMBIAL — TAXAS DE REFERÊNCIA':'MERCADOS GLOBAIS E COMMODITIES'}</h5><table><thead><tr>{['INSTRUMENTO','D-2','D-1','D','VAR %'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(([name,a,b,c])=><tr key={name}><td>{name}{ran&&usedFallback&&String(name).includes('BODIVA')&&<span className="ai">IA</span>}</td>{[a,b,c].map((v,i)=><td key={i}>{ran?fmt(Number(v))+(key==='luibor'?'%':''):'—'}</td>)}<td className={Number(c)>=Number(b)?'up':'down'}>{ran?fmt((Number(c)-Number(b))/Number(b)*100)+'%':'—'}</td></tr>)}</tbody></table></div>)}</div>:<div className="info"><p>Esta demonstração simula a recolha diária de mercados do BDA. Todos os valores, percentagens de qualidade e estados são fictícios.</p><p>Active o fallback antes de executar para simular uma secção em falta. O valor resultante fica marcado para revisão no quadro e no CSV. Não são feitas chamadas à IA.</p></div>}
 <dialog ref={dialog} className="sheet" onCancel={()=>setModal(false)} onClose={()=>setModal(false)}><header><b><FileSpreadsheet className="i"/>BDA_MERCADOS.CSV</b><div className="acts"><button onClick={async()=>{try{await navigator.clipboard.writeText(csv);setCopy('COPIADO ✓')}catch{setCopy('SELECCIONE E COPIE')}}}>{copy}</button><button className="p" onClick={download}>DESCARREGAR</button><button onClick={()=>setModal(false)}>FECHAR</button></div></header><pre>{csv}</pre></dialog>
 </div></div></div>
}
