import {notFound} from 'next/navigation';
import {products} from '@/data/showroom';
import DemoWorkspace from '@/components/demo-workspace';
export function generateStaticParams(){return products.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const{slug}=await params;return {title:products.find(p=>p.slug===slug)?.title??'Demo not found'}}
export default async function DemoPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!products.some(p=>p.slug===slug))notFound();return <DemoWorkspace slug={slug}/>}
