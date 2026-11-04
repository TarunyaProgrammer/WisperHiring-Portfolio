import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { chapters } from '../data/portfolio'
gsap.registerPlugin(ScrollTrigger)
type Controller = {progress:{current:number};active:number;reduced:boolean;reading:boolean;setReading:(value:boolean)=>void;go:(index:number)=>void}
const Context = createContext<Controller | null>(null)
export function ExperienceProvider({children}:{children:ReactNode}) {
 const progress=useRef(0), [active,setActive]=useState(0), [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches), [reading,setReading]=useState(false)
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduced(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[])
 useEffect(()=>{const ctx=gsap.context(()=>{ScrollTrigger.create({trigger:'.journey',start:'top top',end:'bottom bottom',onUpdate:self=>{progress.current=self.progress}});chapters.forEach((chapter,i)=>{ScrollTrigger.create({trigger:`#${chapter.id}`,start:'top 50%',end:'bottom 50%',onToggle:self=>{if(self.isActive)setActive(i)}})})});return()=>ctx.revert()},[reading])
 const go=(index:number)=>{document.getElementById(chapters[index].id)?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'})}
 return <Context value={{progress,active,reduced,reading,setReading,go}}>{children}</Context>
}
export function useExperience(){const ctx=useContext(Context);if(!ctx)throw new Error('ExperienceProvider required');return ctx}
