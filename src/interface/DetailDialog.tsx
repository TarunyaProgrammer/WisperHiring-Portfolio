import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
export function DetailDialog({children,onClose,title}:{children:ReactNode;onClose:()=>void;title:string}){
 const ref=useRef<HTMLDialogElement>(null)
 useEffect(()=>{const previous=document.activeElement as HTMLElement;const dialog=ref.current!;dialog.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog.close();document.body.style.overflow=overflow;previous?.focus()}},[])
 return <dialog ref={ref} className='detail-dialog' aria-label={title} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className='dialog-content'><button className='close-button icon-button' onClick={onClose} aria-label='Close details'><X size={22}/></button>{children}</div></dialog>
}
