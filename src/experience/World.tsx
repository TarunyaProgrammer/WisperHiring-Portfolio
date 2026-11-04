import { useLayoutEffect, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import {
  CatmullRomCurve3,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  DoubleSide,
  InstancedMesh,
  Object3D,
  Shape,
  Vector3,
} from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { useExperience } from "./controller";
const colors = {
  cream: "#e6dfcd",
  roof: "#bf714b",
  green: "#66816a",
  dark: "#344f43",
  water: "#9bbdc0",
  sand: "#d7c7a7",
  shoreline: "#d6c19d",
  coast: "#896e52",
  road: "#ded4bd",
  pathEdge: "#b5a78b",
  canal: "#426c75",
  timber: "#526051",
};
type Vec = [number, number, number];
function Block({
  position = [0, 0, 0],
  size = [1, 1, 1],
  color = colors.cream,
  rotation = 0,
}: {
  position?: Vec;
  size?: Vec;
  color?: string;
  rotation?: number;
}) {
  return (
    <mesh
      castShadow
      receiveShadow
      position={position}
      rotation={[0, rotation, 0]}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
  );
}
function Path({
  points,
  width = 0.16,
  color = colors.road,
  edge = false,
}: {
  points: Vec[];
  width?: number;
  color?: string;
  edge?: boolean;
}) {
  const geometry = useMemo(() => {
    const curve = new CatmullRomCurve3(points.map((p) => new Vector3(...p)));
    const positions: number[] = [];
    const indices: number[] = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t).normalize();
      const nx = -tangent.z;
      const nz = tangent.x;
      const half = width * (edge ? 0.72 : 0.5);
      const y = point.y + (edge ? 0.015 : 0.025);
      positions.push(
        point.x + nx * half, y, point.z + nz * half,
        point.x - nx * half, y, point.z - nz * half,
      );
      if (i < steps) {
        const a = i * 2;
        indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const result = new BufferGeometry();
    result.setAttribute("position", new Float32BufferAttribute(positions, 3));
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  }, [points, width, edge]);
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color={color} roughness={edge ? 0.96 : 1} side={DoubleSide} />
    </mesh>
  );
}
function Arch({
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
}: {
  position?: Vec;
  rotation?: number;
  scale?: number;
}) {
  const shape = useMemo(() => {
    const s = new Shape();
    s.moveTo(-1.2, 0);
    s.lineTo(-1.2, 2);
    s.absarc(0, 2, 1.2, Math.PI, 0, true);
    s.lineTo(1.2, 0);
    s.lineTo(0.65, 0);
    s.lineTo(0.65, 2);
    s.absarc(0, 2, 0.65, 0, Math.PI, false);
    s.lineTo(-0.65, 0);
    s.closePath();
    return s;
  }, []);
  return (
    <mesh
      position={position}
      rotation={[0, rotation, 0]}
      scale={scale}
      castShadow
      receiveShadow
    >
      <extrudeGeometry
        args={[
          shape,
          {
            depth: 0.45,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.06,
            bevelThickness: 0.06,
          },
        ]}
      />
      <meshStandardMaterial color={colors.cream} />
    </mesh>
  );
}
function Trees() {
  const trunks = useRef<InstancedMesh>(null),
    leaves = useRef<InstancedMesh>(null);
  const positions = useMemo(
    () => {
      const groves: number[][] = [];
      for (let i = 0; groves.length < 58; i++) {
        const a = i * 2.39996;
        const r = 6.2 + (i % 4) * 0.72 + Math.sin(i * 4.8) * 0.24;
        const candidate = [Math.cos(a) * r * 1.1, Math.sin(a) * r * 0.84];
        const clearOfLandmarks = [
          [-6, 4], [5, 3.8], [-5, -4], [5, -4.7], [0.5, -6.2], [-1, 6.1],
        ].every(([x,z]) => Math.hypot(candidate[0]-x,candidate[1]-z)>2.15);
        if (clearOfLandmarks && r < 8.7) groves.push(candidate);
        if (i > 700) break;
      }
      return groves;
    },
    [],
  );
  useLayoutEffect(() => {
    const dummy = new Object3D();
      positions.forEach(([x, z], i) => {
      const h = 0.9 + (Math.sin(i * 8.2) + 1) * 0.45;
      dummy.position.set(x, 0.4, z);
      dummy.scale.set(0.1, 0.8, 0.1);
      dummy.updateMatrix();
      trunks.current!.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, h * 0.65 + 0.6, z);
        const fullness = 0.42 + (i % 5) * 0.055;
        dummy.scale.set(fullness, h, fullness);
        dummy.rotation.set(Math.sin(i*2)*.12, i*.73, Math.cos(i*3)*.1);
      dummy.updateMatrix();
      leaves.current!.setMatrixAt(i, dummy.matrix);
        const tint = new Color().setHSL(0.25 + (i%6)*.008, .2 + (i%3)*.025, .38 + (i%4)*.025);
        leaves.current!.setColorAt(i,tint);
    });
    trunks.current!.instanceMatrix.needsUpdate = true;
    leaves.current!.instanceMatrix.needsUpdate = true;
    if (leaves.current!.instanceColor) leaves.current!.instanceColor.needsUpdate = true;
  }, [positions]);
  return (
    <>
      <instancedMesh ref={trunks} args={[undefined, undefined, 58]} castShadow>
        <cylinderGeometry args={[0.7, 1, 1, 5]} />
        <meshStandardMaterial color="#73644b" />
      </instancedMesh>
      <instancedMesh ref={leaves} args={[undefined, undefined, 58]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#64806a" flatShading />
      </instancedMesh>
    </>
  );
}
function Terrain() {
  const shape = useMemo(() => {
    const s = new Shape();
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2,
        r = 1 + 0.09 * Math.sin(a * 3 + 0.4) + 0.055 * Math.cos(a * 7) + 0.025 * Math.sin(a * 13);
      const x = Math.cos(a) * 11 * r + 0.45,
        y = Math.sin(a) * 8.15 * r - 0.2;
      if (!i) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    return s;
  }, []);
  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.47, 0]}
        receiveShadow
        castShadow
      >
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 2.5,
              bevelEnabled: true,
              bevelSegments: 3,
              steps: 1,
              bevelSize: 0.35,
              bevelThickness: 0.35,
            },
          ]}
        />
        <meshStandardMaterial color={colors.coast} roughness={1} flatShading />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.06, 0]}
        receiveShadow
      >
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="#839078" side={DoubleSide} roughness={1} />
      </mesh>
      {[
        { radius: 2.8, y: -0.06, height: 0.32 },
        { radius: 2.18, y: 0.12, height: 0.2 },
        { radius: 1.58, y: 0.34, height: 0.24 },
      ].map(({ radius, y, height }, i) => (
        <mesh key={radius} position={[0, y, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[radius - 0.16, radius, height, 48]} />
          <meshStandardMaterial color={i===2 ? "#77826b" : "#746e56"} roughness={1}/>
        </mesh>
      ))}
      <mesh
        position={[0, -2.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.12} />
      </mesh>
      <group>{[[-7,-.65,-6.15,1.2],[-4,-.7,-7.35,.75],[3,-.75,-7.4,1.15],[8,-.7,-5.65,.85],[10,-.55,-2.7,.6],[9,-.65,4.7,.95],[4,-.7,7.35,.7],[-7,-.65,5.2,1.15],[-10,-.5,2,.65]].map(([x,y,z,size],i)=><mesh key={i} position={[x,y,z]} rotation={[.1,i*.71,.16]} scale={[size*1.4,size*.75,size]} castShadow><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color={i%3===0?colors.shoreline:colors.coast} flatShading/></mesh>)}</group>
    </>
  );
}
function Bridge({
  position,
  rotation = 0,
}: {
  position: Vec;
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block size={[4.3, 0.25, 1.3]} position={[0, 0.5, 0]} color="#c1a984" />
      <Block size={[4.1, 0.055, 1.12]} position={[0,.655,0]} color="#ddd2ba" />
      {[-0.65, 0.65].map((z) => (
        <group key={z}>
          <Block size={[4.3, 0.14, 0.16]} position={[0, 0.95, z]} color={colors.cream} />
          {[-1.8, -0.9, 0, 0.9, 1.8].map((x) => (
            <Block key={x} size={[0.1, 0.55, 0.1]} position={[x, 0.7, z]} />
          ))}
        </group>
      ))}
      {[-1.5, 1.5].map((x) => (
        <Block
          key={x}
          size={[0.35, 0.9, 1.1]}
          position={[x, 0, 0]}
          color="#9f9279"
        />
      ))}
    </group>
  );
}
function Workshop() {
  return (
    <group>
      <Block position={[0,0.1,0]} size={[4.9,.24,3.6]} color={colors.pathEdge}/>
      {[-1.42, 0, 1.42].map((x,i) => (
        <group key={x}>
          <Block position={[x,.87,0]} size={[1.27,1.38,1.42]} color={i===1?'#d8cfb9':colors.cream}/>
          <GableRoof position={[x,1.56,0]} width={1.48} height={.78} depth={1.58}/>
          {[-.38,.38].map(dx=><mesh key={dx} position={[x+dx,.89,.716]}><planeGeometry args={[.28,.46]}/><meshStandardMaterial color="#e1bc80" emissive="#c88951" emissiveIntensity={.34}/></mesh>)}
          <Block position={[x,.83,.73]} size={[.045,.98,.055]} color={colors.timber}/>
          <Block position={[x,.26,0]} size={[1.34,.12,1.48]} color={colors.dark}/>
        </group>
      ))}
      <Block
        position={[1.55, 2.27, -0.35]}
        size={[0.32, 1.05, 0.34]}
        color="#ac7457"
      />
      <Block position={[0,.27,1.25]} size={[3.7,.12,.75]} color={colors.shoreline}/>
      <Block position={[-1.5,.66,.78]} size={[.12,.8,.12]} color={colors.timber}/>
      <Block position={[1.5,.66,.78]} size={[.12,.8,.12]} color={colors.timber}/>
    </group>
  );
}
function GableRoof({position,width,height,depth}:{position:Vec;width:number;height:number;depth:number}) {
  const profile=useMemo(()=>{const s=new Shape();s.moveTo(-width/2,-.06);s.lineTo(0,height);s.lineTo(width/2,-.06);s.closePath();return s},[width,height]);
  return <mesh position={[position[0],position[1],position[2]-depth/2]} castShadow receiveShadow><extrudeGeometry args={[profile,{depth,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.035,bevelThickness:.035}]}/><meshStandardMaterial color={colors.roof} roughness={.9} flatShading/></mesh>
}
function Observatory() {
  return (
    <group>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.7, 2.4, 32]} />
        <meshStandardMaterial color={colors.cream} />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow>
        <sphereGeometry args={[1.64, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={colors.green} roughness={0.75} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <Block
            key={i}
            position={[Math.cos(a) * 1.66, 1.25, Math.sin(a) * 1.66]}
            size={[0.32, 0.8, 0.06]}
            rotation={-a + Math.PI / 2}
            color="#718b81"
          />
        );
      })}
      <Block position={[0, 0.2, 2]} size={[2, 0.3, 1.7]} color="#d3c6aa" />
    </group>
  );
}
function Tower() {
  return (
    <group>
      <Block size={[3.5,.35,3.5]} color={colors.shoreline} position={[0,.1,0]}/>
      <mesh position={[0,.3,0]} castShadow receiveShadow><cylinderGeometry args={[.9,1.2,5.2,10]}/><meshStandardMaterial color={colors.cream} flatShading/></mesh>
      <mesh position={[0,1.2,0]}><cylinderGeometry args={[.93,.93,.1,10]}/><meshStandardMaterial color={colors.timber}/></mesh>
      {[1.1, 2.4, 3.7, 5].map((y) => (
        <Block
          key={y}
          position={[0, y, 0]}
          size={[1.6, 0.16, 1.6]}
          color="#b6b79f"
        />
      ))}
      <Block
        position={[0, 5.55, 0]}
        size={[1.6, 1.1, 1.6]}
        color={colors.dark}
      />
      <mesh position={[0, 6.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.4, 0.65, 4]} />
        <meshStandardMaterial color={colors.dark} />
      </mesh>
      <Block
        position={[0, 6.9, 0]}
        size={[0.06, 0.8, 0.06]}
        color={colors.dark}
      />
    </group>
  );
}
function Signal() {
  return (
    <group>
      <Block size={[3.7,.28,3.1]} position={[0,.2,0]} color={colors.shoreline}/>
      <Block size={[3.2,1.35,2.2]} position={[0,.92,0]} color="#bd7555" />
      <Block size={[3.5,.18,2.5]} position={[0,1.62,0]} color={colors.cream}/>
      {[-1, 0, 1].map((x) => (
        <Block
          key={x}
          position={[x, 0.85, 1.12]}
          size={[0.65, 0.75, 0.05]}
          color="#3f615b"
        />
      ))}
      <group position={[0, 1.6, 0]}>
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.25, 2.6, 8]} />
          <meshStandardMaterial color="#3f554c" />
        </mesh>
        {[0.65, 1.3, 2].map((y, i) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.9 - i * 0.18, 0.045, 8, 40]} />
            <meshStandardMaterial color={colors.cream} />
          </mesh>
        ))}
        <mesh position={[0,2.78,0]}><icosahedronGeometry args={[.2,1]}/><meshStandardMaterial color="#edc17e" emissive="#e1a75b" emissiveIntensity={1.5}/></mesh>
      </group>
    </group>
  );
}
function Label({
  position,
  number,
  name,
  onClick,
}: {
  position: Vec;
  number: string;
  name: string;
  onClick: () => void;
}) {
  return (
    <Html position={position} center distanceFactor={32} zIndexRange={[10, 0]}>
      <button className="landmark-label" onClick={onClick}>
        <span>{number}</span>
        {name}
        <i>↗</i>
      </button>
    </Html>
  );
}
function DreamLandscape() {
  return (
    <>
      <mesh
        position={[0, -2.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial
          color="#345b62"
          roughness={0.48}
          metalness={0.25}
        />
      </mesh>
      {Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2,
          r = 35 + Math.sin(i * 4) * 10;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, -1.8, Math.sin(a) * r]}
            scale={[4 + Math.sin(i) * 2, 2.5 + Math.cos(i * 3) * 1.5, 4]}
            castShadow
          >
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#536c62" flatShading />
          </mesh>
        );
      })}
      {[
        [-14, -1.8, 7, 1.1],
        [14, -1.8, 5, 0.85],
        [-3, -1.8, 14, 0.9],
        [3, -1.8, -14, 1.15],
        [-14, -1.8, -9, 0.72],
      ].map(([x, y, z, scale], i) => (
        <group key={i} position={[x, y, z]} scale={scale}>
          <mesh scale={[2.6, 1.5, 1.9]} castShadow receiveShadow>
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#695e4c" flatShading />
          </mesh>
          <mesh position={[0, 0.66, 0]} scale={[2.15, 0.3, 1.5]} receiveShadow>
            <sphereGeometry args={[1, 10, 6]} />
            <meshStandardMaterial color="#74836b" flatShading />
          </mesh>
          {[-0.65, 0.5].map((tx, j) => (
            <group key={j} position={[tx, 0.9, (j - 0.5) * 0.65]}>
              <mesh position={[0, 0.46, 0]} castShadow>
                <cylinderGeometry args={[0.055, 0.09, 0.92, 5]} />
                <meshStandardMaterial color="#6c6049" />
              </mesh>
              <mesh position={[0, 1.13, 0]} castShadow>
                <coneGeometry args={[0.49, 1.12, 6]} />
                <meshStandardMaterial color={j ? "#66795f" : "#7d8c69"} flatShading />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 10, -0.8, Math.sin(a) * 7.5]}
            scale={[1.6, 1.5, 1.3]}
            castShadow
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#827b63" flatShading />
          </mesh>
        );
      })}
      <group position={[-5, 0.1, -4]}>
        {[1.5, 2.8, 4.1].map((y) => (
          <Block
            key={y}
            position={[0, y, 0.615]}
            size={[0.25, 0.45, 0.02]}
            color="#f2c480"
          />
        ))}
      </group>
      <group position={[5, 0.1, 3.8]}>
        {[-1.1, 0, 1.1].map((x) => (
          <mesh key={x} position={[x, 0.95, 1.1]} rotation={[0, -0.2, 0]}>
            <planeGeometry args={[0.38, 0.42]} />
            <meshStandardMaterial
              color="#f5d297"
              emissive="#e6ab55"
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}
export function World({
  onProject,
  onProof,
}: {
  onProject: (id: string) => void;
  onProof: () => void;
}) {
  const { go } = useExperience();
  const click = (fn: () => void) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    fn();
  };
  return (
    <group>
      <Terrain />
      <Trees />
      <DreamLandscape />
      <Path points={[[-8,.22,4],[-6.3,.22,4.45],[-4.4,.22,3.65],[-2.2,.22,2.25],[0,.22,.5],[2.3,.22,-.65],[4.4,.22,-.4],[6.3,.22,1.1],[8,.22,1],[8,.22,-3],[5,.22,-6],[-1,.22,-6.8],[-6,.22,-5],[-8,.22,0],[-8,.22,4]]} width={.48} edge />
      <Path points={[[-7.5,.23,-2],[-6.5,.23,-.2],[-5,.23,1.4],[-3,.23,2],[0,.23,.5],[2,.23,-1.2],[3.8,.23,-3],[5,.23,-4.7]]} width={.35} edge />
      <Path points={[[-1,.24,5.3],[.4,.24,3.6],[1,.24,1.5],[0,.24,.5],[-1.6,.24,-1],[-2.7,.24,-3.1],[-3.8,.24,-5.5]]} width={.32} edge />
      <Path points={[[-4,.045,-9],[-3.4,.045,-6],[-2.8,.045,-3.6],[-2.1,.045,-1.4],[-.1,.045,.35],[2.2,.045,1.55],[4.8,.045,2.5],[7.4,.045,3],[10,.045,4.2]]} width={1.42} color={colors.pathEdge}/>
      <Path points={[[-4,.065,-9],[-3.4,.065,-6],[-2.8,.065,-3.6],[-2.1,.065,-1.4],[-.1,.065,.35],[2.2,.065,1.55],[4.8,.065,2.5],[7.4,.065,3],[10,.065,4.2]]} width={1.12} color={colors.canal}/>
      <Bridge position={[-2.8, .1, -3.6]} rotation={-.12} />
      <Bridge position={[.1, .1, .5]} rotation={.88} />
      <group position={[-6, 0, 4]} onClick={click(() => go(1))}>
        <Arch rotation={-0.2} />
        <Arch position={[0, 0, -1.3]} rotation={-0.2} scale={0.85} />
        <Block position={[0, 0.1, 1]} size={[3.5, 0.18, 2.5]} color="#cfc0a1" />
        <Label
          position={[0, 4.3, 0]}
          number="01"
          name="Origin"
          onClick={() => go(1)}
        />
      </group>
      <group
        position={[5, 0.1, 3.8]}
        rotation={[0, -0.2, 0]}
        onClick={click(() => onProject("cabin"))}
      >
        <Workshop />
        <Label
          position={[0, 4, 0]}
          number="02"
          name="The Workshop"
          onClick={() => go(2)}
        />
      </group>
      <group position={[-5, 0.1, -4]} onClick={click(onProof)}>
        <Tower />
        <Label
          position={[0, 8, 0]}
          number="03"
          name="The Proof"
          onClick={() => go(3)}
        />
      </group>
      <group
        position={[5, 0.1, -4.7]}
        rotation={[0, -0.35, 0]}
        onClick={click(() => go(4))}
      >
        <Signal />
        <Label
          position={[0, 5.9, 0]}
          number="04"
          name="Signal Lab"
          onClick={() => go(4)}
        />
      </group>
      <group
        position={[0.5, 0.1, -6.2]}
        scale={0.65}
        onClick={click(() => onProject("webiu"))}
      >
        <Observatory />
      </group>
      <group
        position={[-1, 0.1, 6.1]}
        scale={0.65}
        onClick={click(() => onProject("echo"))}
      >
        <Block position={[0, 0.7, 0]} size={[2, 1.4, 1.7]} color="#b1c1b4" />
        <Block
          position={[0, 1.5, 0]}
          size={[2.3, 0.2, 2]}
          color={colors.cream}
        />
        <Block
          position={[0, 0.8, 0.86]}
          size={[1.5, 0.55, 0.05]}
          color="#476c69"
        />
      </group>
      <group
        position={[8, 0.1, -0.8]}
        scale={0.7}
        onClick={click(() => onProject("streakly"))}
      >
        <Arch />
        <Block position={[0, 0.2, 1]} size={[3, 0.25, 2.5]} />
      </group>
      <group position={[0, 0.46, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.4, 48]} />
          <meshStandardMaterial color="#e1d6bd" />
        </mesh>
        <Arch position={[0, 0, 0]} scale={0.55} />
      </group>
    </group>
  );
}
