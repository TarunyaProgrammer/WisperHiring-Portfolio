import { useLayoutEffect, useMemo, useRef } from "react";
import { Html, RoundedBox } from "@react-three/drei";
import {
  CatmullRomCurve3,
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
  color = "#ddd0b8",
}: {
  points: Vec[];
  width?: number;
  color?: string;
}) {
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((p) => new Vector3(...p))),
    [points],
  );
  return (
    <mesh receiveShadow>
      <tubeGeometry args={[curve, 64, width, 8, false]} />
      <meshStandardMaterial color={color} roughness={1} />
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
    () =>
      Array.from({ length: 64 }, (_, i) => {
        const a = i * 2.39996,
          r = 5 + Math.sin(i * 4.8) * 2.5;
        return [Math.cos(a) * r * 1.45, Math.sin(a) * r];
      }),
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
      dummy.scale.set(0.55, h, 0.55);
      dummy.rotation.y = i;
      dummy.updateMatrix();
      leaves.current!.setMatrixAt(i, dummy.matrix);
    });
    trunks.current!.instanceMatrix.needsUpdate = true;
    leaves.current!.instanceMatrix.needsUpdate = true;
  }, [positions]);
  return (
    <>
      <instancedMesh ref={trunks} args={[undefined, undefined, 64]} castShadow>
        <cylinderGeometry args={[0.7, 1, 1, 5]} />
        <meshStandardMaterial color="#73644b" />
      </instancedMesh>
      <instancedMesh ref={leaves} args={[undefined, undefined, 64]} castShadow>
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
        r = 1 + 0.055 * Math.sin(a * 5) + 0.025 * Math.cos(a * 9);
      const x = Math.cos(a) * 11 * r,
        y = Math.sin(a) * 8.3 * r;
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
        position={[0, -1.75, 0]}
        receiveShadow
        castShadow
      >
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 1.5,
              bevelEnabled: true,
              bevelSegments: 3,
              steps: 1,
              bevelSize: 0.35,
              bevelThickness: 0.35,
            },
          ]}
        />
        <meshStandardMaterial color={colors.sand} roughness={1} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
        receiveShadow
      >
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="#a5ad87" side={DoubleSide} />
      </mesh>
      <mesh
        position={[0, -2.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.12} />
      </mesh>
      <mesh position={[1, 0.12, 0]} rotation={[-Math.PI / 2, 0, -0.15]}>
        <circleGeometry args={[5.6, 64]} />
        <meshStandardMaterial color={colors.water} roughness={0.36} />
      </mesh>
      <mesh
        position={[1, 0.13, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1, 0.82, 1]}
      >
        <ringGeometry args={[5.48, 5.63, 64]} />
        <meshStandardMaterial color="#d4ded1" />
      </mesh>
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
      <Block size={[4.3, 0.25, 1.3]} position={[0, 0.5, 0]} />
      {[-0.65, 0.65].map((z) => (
        <group key={z}>
          <Block size={[4.3, 0.18, 0.12]} position={[0, 0.95, z]} />
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
          color="#b8aa8b"
        />
      ))}
    </group>
  );
}
function Workshop() {
  return (
    <group>
      <RoundedBox
        args={[3.4, 1.6, 2.1]}
        radius={0.05}
        position={[0, 0.85, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={colors.cream} />
      </RoundedBox>
      {[-1.1, 0, 1.1].map((x) => (
        <group key={x}>
          <mesh
            position={[x, 1.85, 0]}
            rotation={[0, 0, Math.PI / 4]}
            castShadow
          >
            <boxGeometry args={[0.8, 0.8, 2.3]} />
            <meshStandardMaterial color={colors.roof} />
          </mesh>
          <Block
            position={[x, 0.9, 1.06]}
            size={[0.65, 0.75, 0.04]}
            color="#607f7a"
          />
          <Block position={[x, 1.05, 1.1]} size={[0.05, 1, 0.04]} />
        </group>
      ))}
      <Block
        position={[1.5, 2.25, -0.6]}
        size={[0.38, 2, 0.4]}
        color="#ac7457"
      />
      <Block position={[0, 0.15, 1.7]} size={[4, 0.25, 1.2]} color="#c4b69a" />
    </group>
  );
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
      <Block size={[2.2, 0.35, 2.2]} />
      <Block size={[1.2, 4.9, 1.2]} position={[0, 2.5, 0]} />
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
        <meshStandardMaterial color={colors.roof} />
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
      <Block size={[3.2, 1.35, 2.2]} position={[0, 0.75, 0]} color="#ce8056" />
      <Block size={[3.5, 0.18, 2.5]} position={[0, 1.5, 0]} />
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
      <Path
        points={[
          [-8, 0.2, 4],
          [-6, 0.2, 6],
          [0, 0.2, 6.2],
          [6, 0.2, 5],
          [8, 0.2, 1],
          [8, 0.2, -3],
          [5, 0.2, -6],
          [-1, 0.2, -6.8],
          [-6, 0.2, -5],
          [-8, 0.2, 0],
          [-8, 0.2, 4],
        ]}
        width={0.34}
      />
      <Path
        points={[
          [-6, 0.22, 5],
          [-4, 0.22, 3],
          [-2, 0.22, 3],
          [-1, 0.22, 5],
        ]}
        width={0.2}
      />
      <Bridge position={[-3, 0.1, 1.5]} rotation={-0.3} />
      <Bridge position={[4, 0.1, -2]} rotation={0.5} />
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
      {Array.from({ length: 7 }, (_, i) => (
        <mesh
          key={i}
          position={[-9 + Math.sin(i) * 0.4, -0.4, i * 1.4 - 4]}
          scale={[0.8, 1.1, 0.8]}
          castShadow
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#b9ae94" flatShading />
        </mesh>
      ))}
      <group position={[0, 0.15, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.4, 48]} />
          <meshStandardMaterial color="#e1d6bd" />
        </mesh>
        <Arch position={[0, 0, 0]} scale={0.55} />
      </group>
    </group>
  );
}
