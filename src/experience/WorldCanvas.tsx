import { Component, Suspense, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { useExperience } from './controller'
import { World } from './World'
import { CameraRig } from './CameraRig'
class SceneBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return{failed:true}}componentDidCatch(){this.props.onError()}render(){return this.state.failed?null:this.props.children}}
export function WorldCanvas({onProject,onProof}:{onProject:(id:string)=>void;onProof:()=>void}){
 const {reading,setReading,reduced}=useExperience(),[visible,setVisible]=useState(!document.hidden),[ready,setReady]=useState(false)
 useEffect(()=>{const change=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change)},[])
 if(reading)return null
 return <div className='world-canvas' aria-label='Interactive miniature world. All landmarks are also available through the chapter navigation.'>{!ready&&<div className='scene-loading' role='status'><span/>Preparing your world…</div>}<SceneBoundary onError={()=>setReading(true)}><Canvas shadows dpr={[1,1.5]} camera={{position:[24,23,30],fov:36,near:.1,far:180}} frameloop={visible?'always':'never'} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} fallback={<button className='canvas-fallback' onClick={()=>setReading(true)}>3D is unavailable. Open reading mode →</button>} onCreated={({gl})=>{setReady(true);gl.domElement.addEventListener('webglcontextlost',()=>setReading(true),{once:true})}}><color attach='background' args={['#f4f0e8']}/><fog attach='fog' args={['#f4f0e8',65,130]}/><ambientLight intensity={1.5}/><hemisphereLight args={['#fff8e9','#8a9c81',2]}/><directionalLight position={[-10,24,12]} intensity={3} castShadow shadow-mapSize={reduced?512:1024} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-bias={-.001}/><Suspense fallback={null}><World onProject={onProject} onProof={onProof}/><CameraRig/></Suspense></Canvas></SceneBoundary><div className='world-caption'><span>AN INTERACTIVE MINIATURE WORLD</span><span>Four districts. One curious mind.</span></div></div>
}
