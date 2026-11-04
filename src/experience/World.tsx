import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Object3D,
  PointsMaterial,
  Quaternion,
  Vector3,
} from "three";
import { chapters } from "../data/portfolio";
import { useExperience } from "./controller";
import { journeyCurve, routePointAt, sampleJourneyRoute } from "./cameraRoute";

const FORWARD = new Vector3(0, 0, 1);
const PALETTE = ["#efd1aa", "#ae8cff", "#8ce8e0", "#ff9ec8", "#f7c977", "#a3c9ff"];

function RouteArchitecture({ narrow }: { narrow: boolean }) {
  const arches = useRef<InstancedMesh>(null);
  const innerArches = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const quaternion = useMemo(() => new Quaternion(), []);
  const position = useMemo(() => new Vector3(), []);
  const tangent = useMemo(() => new Vector3(), []);
  const archSteps = useMemo(
    () => Array.from({ length: 7 }, (_, i) => 0.1 + i * 0.135),
    [],
  );

  useLayoutEffect(() => {
    const assign = (mesh: InstancedMesh | null, inset: number) => {
      if (!mesh) return;
      archSteps.forEach((progress, i) => {
        sampleJourneyRoute(progress, position, tangent);
        quaternion.setFromUnitVectors(FORWARD, tangent);
        dummy.position.copy(position);
        dummy.position.y += 0.25 + Math.sin(i * 0.91) * 0.12;
        dummy.quaternion.copy(quaternion);
        const scale = 3.35 + Math.sin(i * 1.37) * 0.3;
        dummy.scale.set(scale - inset, scale * (1.12 + Math.sin(i) * 0.04) - inset, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, new Color(PALETTE[i % PALETTE.length]));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };
    assign(arches.current, 0);
    assign(innerArches.current, 0.2);
  }, [archSteps, dummy, position, tangent, quaternion]);

  return (
    <group>
      <instancedMesh ref={arches} args={[undefined, undefined, archSteps.length]}>
        <torusGeometry args={[1, 0.07, 10, 56]} />
        <meshPhysicalMaterial color="#e1c5ff" emissive="#6847a1" emissiveIntensity={0.85} metalness={0.6} roughness={0.24} clearcoat={0.8} />
      </instancedMesh>
      {!narrow && (
        <instancedMesh ref={innerArches} args={[undefined, undefined, archSteps.length]}>
          <torusGeometry args={[1, 0.018, 6, 48]} />
          <meshBasicMaterial color="#f4d4bd" />
        </instancedMesh>
      )}
    </group>
  );
}

function Constellation() {
  const { reduced } = useExperience();
  const field = useMemo(() => {
    const values: number[] = [];
    const colorValues: number[] = [];
    for (let i = 0; i < 380; i++) {
      const a = i * 2.399963;
      const radius = 8 + (i % 17) * 0.92;
      values.push(
        Math.cos(a) * radius,
        Math.sin(i * 1.73) * (5 + (i % 7)),
        -12 - (i % 23) * 8.4,
      );
      const color = new Color(PALETTE[i % PALETTE.length]);
      colorValues.push(color.r, color.g, color.b);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(values, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colorValues, 3));
    return geometry;
  }, []);
  const dust = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!reduced && dust.current) dust.current.rotation.y += delta * 0.004;
  });
  return (
    <group ref={dust}>
      <points geometry={field}>
        <pointsMaterial size={0.14} vertexColors transparent opacity={0.72} depthWrite={false} sizeAttenuation />
      </points>
    </group>
  );
}

function Marker({ progress, color, scale = 1 }: { progress: number; color: string; scale?: number }) {
  const point = useMemo(() => routePointAt(progress), [progress]);
  return (
    <group position={[point.x, point.y + 0.3, point.z]}>
      <mesh scale={[scale, scale * 1.15, 1]}>
        <torusGeometry args={[2.5, 0.075, 12, 88]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={1.1} metalness={0.35} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
        <torusGeometry args={[1.25 * scale, 0.025, 8, 64]} />
        <meshBasicMaterial color="#f5d3bf" transparent opacity={0.85} />
      </mesh>
      <pointLight color={color} intensity={18} distance={16} decay={2} />
    </group>
  );
}

const DISTRICT_COLORS = ["#f4c48f", "#bf9cff", "#89dce5", "#f49bbf", "#e8c976", "#a3c9ff"];

function SkylineDistrict({ progress, variant }: { progress: number; variant: number }) {
  const point = useMemo(() => routePointAt(progress), [progress]);
  const tangent = useMemo(() => journeyCurve.getTangentAt(progress).normalize(), [progress]);
  const rotation = Math.atan2(tangent.x, tangent.z);
  const color = DISTRICT_COLORS[variant % DISTRICT_COLORS.length];
  const towers = [
    { x: 5.1, z: 0, scale: 1.48 },
    { x: 8.5, z: 3.8, scale: 0.88 },
    { x: 8.7, z: -4.2, scale: 0.72 },
    { x: 3, z: 4.3, scale: 0.64 },
  ];

  return (
    <group position={[point.x, point.y - 0.35, point.z]} rotation={[0, rotation, 0]}>
      <mesh position={[5.8, 0, 0]}>
        <cylinderGeometry args={[4.9, 5.45, 0.8, 8]} />
        <meshPhysicalMaterial color="#201a2b" roughness={0.38} metalness={0.5} clearcoat={0.65} />
      </mesh>
      <mesh position={[5.8, 0.42, 0]}>
        <cylinderGeometry args={[4.55, 4.85, 0.16, 8]} />
        <meshStandardMaterial color="#4a354e" emissive="#261934" emissiveIntensity={0.8} metalness={0.35} />
      </mesh>
      <mesh position={[4.8, 0.12, 0]}>
        <boxGeometry args={[5.7, 0.22, 1.55]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.3} metalness={0.5} roughness={0.25} />
      </mesh>
      {towers.map((tower, index) => (
        <group key={index} position={[tower.x, 0.5, tower.z]} scale={tower.scale}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[1.45, 1.8, 0.9, 6]} />
            <meshStandardMaterial color="#33273b" roughness={0.36} metalness={0.58} />
          </mesh>
          <mesh position={[0, 4.1, 0]}>
            <cylinderGeometry args={[0.78, 1.38, 6.6, 6]} />
            <meshPhysicalMaterial color="#877295" emissive="#362444" emissiveIntensity={0.7} metalness={0.65} roughness={0.27} clearcoat={0.8} />
          </mesh>
          <mesh position={[0, 7.9, 0]}>
            <coneGeometry args={[1.35, 2.5, 6]} />
            <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.75} metalness={0.5} roughness={0.22} />
          </mesh>
          <mesh position={[0, 4.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.06, 0.045, 8, 32]} />
            <meshBasicMaterial color={color} />
          </mesh>
          {[0, 1, 2, 3].map((window) => (
            <mesh key={window} position={[Math.cos(window * Math.PI / 2) * 0.89, 3.8, Math.sin(window * Math.PI / 2) * 0.89]}>
              <boxGeometry args={[0.12, 1.6, 0.12]} />
              <meshBasicMaterial color="#ffe5b8" />
            </mesh>
          ))}
        </group>
      ))}
      <pointLight position={[5.8, 8, 0]} color={color} intensity={72} distance={38} decay={2} />
    </group>
  );
}

function CameraRig() {
  const { progress } = useExperience();
  const point = useMemo(() => new Vector3(), []);
  const tangent = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    const t = progress.current;
    sampleJourneyRoute(t, point, tangent);
    look.copy(point).addScaledVector(tangent, 5.4);
    look.y += 0.35;
    camera.position.copy(point).addScaledVector(tangent, -6.2);
    camera.position.y += 3.1;
    camera.lookAt(look);
    camera.updateMatrixWorld();
  });
  return null;
}

export function World() {
  const { progress } = useExperience();
  const narrow = useThree((state) => state.size.width < 760);
  const endPosition = useMemo(() => routePointAt(0.99), []);
  const confettiMaterial = useRef<PointsMaterial>(null);
  const confettiGroup = useRef<Group>(null);
  const confetti = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions: number[] = [];
    for (let i = 0; i < 240; i++) {
      const angle = i * 2.399963;
      const radius = 1 + (i % 19) * 0.1;
      positions.push(Math.cos(angle) * radius, Math.sin(i * 0.75) * radius, Math.sin(angle) * radius);
    }
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((_, delta) => {
    const celebration = Math.max(0, Math.min(1, (progress.current - 0.9) * 10));
    if (confettiMaterial.current) {
      confettiMaterial.current.opacity = celebration * 0.9;
    }
    if (confettiGroup.current) {
      confettiGroup.current.scale.setScalar(0.65 + celebration * 2.6);
      confettiGroup.current.rotation.y += delta * celebration * 0.3;
    }
  });

  return (
    <group>
      <RouteArchitecture narrow={narrow} />
      <Constellation />
      <CameraRig />
      {!narrow && [0.035, ...chapters.slice(1, -1).map((chapter) => chapter.progress)].map((progress, i) => (
        <SkylineDistrict key={`${progress}-${i}`} progress={progress} variant={i} />
      ))}
      {chapters.slice(1, -1).map((chapter, i) => (
        <Marker
          key={chapter.id}
          progress={chapter.progress}
          color={PALETTE[(i + 1) % PALETTE.length]}
          scale={i === 4 ? 1.42 : 1}
        />
      ))}
      <group ref={confettiGroup} position={[endPosition.x, endPosition.y + 3, endPosition.z]}>
        <points geometry={confetti}>
          <pointsMaterial ref={confettiMaterial} size={0.2} color="#f6c987" transparent opacity={0} depthWrite={false} />
        </points>
      </group>
    </group>
  );
}
