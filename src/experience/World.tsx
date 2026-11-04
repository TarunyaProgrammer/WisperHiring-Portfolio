import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BufferGeometry,
  Color,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  Path,
  ShaderMaterial,
  Shape,
  TubeGeometry,
  CatmullRomCurve3,
  Vector3,
} from "three";
import { useExperience } from "./controller";
import { journeyCurve, routePointAt, sampleJourneyRoute } from "./cameraRoute";

const PALETTE = ["#efd1aa", "#ae8cff", "#8ce8e0", "#ff9ec8", "#f7c977", "#a3c9ff"];
const POINT_VERTEX_SHADER = `
  attribute vec3 color;
  uniform float uSize;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize / max(1.0, -viewPosition.z);
    vColor = color;
    vDepth = -viewPosition.z;
  }
`;
const SOFT_POINT_FRAGMENT_SHADER = `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    float radius = length(gl_PointCoord - vec2(0.5));
    float edge = 1.0 - smoothstep(0.12, 0.5, radius);
    float core = 1.0 - smoothstep(0.0, 0.2, radius);
    vec3 glow = mix(vColor, vec3(1.0), core * 0.5);
    float depthFade = 1.0 - smoothstep(70.0, 130.0, vDepth);
    gl_FragColor = vec4(glow, edge * uOpacity * depthFade);
  }
`;

function createGothicArch(width: number, height: number, depth: number) {
  const shape = new Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(-width / 2, height * 0.64);
  shape.bezierCurveTo(-width * 0.48, height * 0.86, -width * 0.2, height, 0, height);
  shape.bezierCurveTo(width * 0.2, height, width * 0.48, height * 0.86, width / 2, height * 0.64);
  shape.lineTo(width / 2, 0);
  shape.closePath();

  const opening = new Path();
  opening.moveTo(-width * 0.285, 0);
  opening.lineTo(width * 0.285, 0);
  opening.lineTo(width * 0.285, height * 0.6);
  opening.quadraticCurveTo(width * 0.25, height * 0.77, 0, height * 0.87);
  opening.quadraticCurveTo(-width * 0.25, height * 0.77, -width * 0.285, height * 0.6);
  opening.closePath();
  shape.holes.push(opening);

  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.16,
    bevelThickness: 0.12,
    curveSegments: 24,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

function createArchTrim(width: number, height: number, z: number) {
  const path = new Path();
  path.moveTo(-width * 0.31, 0.1);
  path.lineTo(-width * 0.31, height * 0.61);
  path.quadraticCurveTo(-width * 0.27, height * 0.8, 0, height * 0.9);
  path.quadraticCurveTo(width * 0.27, height * 0.8, width * 0.31, height * 0.61);
  path.lineTo(width * 0.31, 0.1);
  const points = path.getPoints(56).map((point) => new Vector3(point.x, point.y, z));
  return new TubeGeometry(new CatmullRomCurve3(points, false, "centripetal"), 84, 0.055, 8, false);
}

function RouteGateway({ progress, lateral, scale, color }: { progress: number; lateral: number; scale: number; color: string }) {
  const pose = useMemo(() => {
    const tangent = journeyCurve.getTangentAt(progress).normalize();
    const side = new Vector3(tangent.z, 0, -tangent.x).multiplyScalar(lateral);
    return { point: routePointAt(progress).add(side), rotation: Math.atan2(tangent.x, tangent.z) };
  }, [progress, lateral]);
  const frame = useMemo(() => createGothicArch(4.9, 6.4, 0.62), []);
  const trim = useMemo(() => createArchTrim(4.9, 6.4, 0.34), []);
  return (
    <group position={pose.point} rotation={[0, pose.rotation, 0]} scale={scale}>
      <mesh geometry={frame} position={[0, 0.12, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#887687" roughness={0.68} metalness={0.14} side={DoubleSide} />
      </mesh>
      <mesh geometry={trim} position={[0, 0.12, 0]}>
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[6.0, 0.22, 1.35]} />
        <meshPhysicalMaterial color="#766477" roughness={0.84} />
      </mesh>
      <pointLight position={[0, 4.1, 1.2]} color={color} intensity={12} distance={22} decay={2} />
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
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={{ uOpacity: { value: 0.48 }, uSize: { value: 76 } }}
          vertexShader={POINT_VERTEX_SHADER}
          fragmentShader={SOFT_POINT_FRAGMENT_SHADER}
        />
      </points>
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
    look.copy(point).addScaledVector(tangent, 6.4);
    look.y += 0.55;
    camera.position.copy(point).addScaledVector(tangent, -8.2);
    camera.position.y += 3.7;
    camera.lookAt(look);
    camera.updateMatrixWorld();
  });
  return null;
}

export function World() {
  const { progress, reduced } = useExperience();
  const endPosition = useMemo(() => routePointAt(0.99), []);
  const confettiMaterial = useRef<ShaderMaterial>(null);
  const confettiGroup = useRef<Group>(null);
  const confetti = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    for (let i = 0; i < 150; i++) {
      const angle = i * 2.399963;
      const radius = 1 + (i % 19) * 0.1;
      positions.push(Math.cos(angle) * radius, Math.sin(i * 0.75) * radius, Math.sin(angle) * radius);
      const color = new Color(PALETTE[i % PALETTE.length]);
      colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    return geometry;
  }, []);

  useFrame((_, delta) => {
    const celebration = reduced ? 0 : Math.max(0, Math.min(1, (progress.current - 0.9) * 10));
    if (confettiMaterial.current) {
      confettiMaterial.current.uniforms.uOpacity.value = celebration * 0.72;
    }
    if (confettiGroup.current) {
      confettiGroup.current.scale.setScalar(0.65 + celebration * 2.6);
      confettiGroup.current.rotation.y += delta * celebration * 0.3;
    }
  });

  return (
    <group>
      <Constellation />
      <CameraRig />
      <RouteGateway progress={0.08} lateral={0} scale={0.46} color="#f5ce9d" />
      <group ref={confettiGroup} position={[endPosition.x, endPosition.y + 3, endPosition.z]}>
        <points geometry={confetti}>
          <shaderMaterial
            ref={confettiMaterial}
            transparent
            depthWrite={false}
            uniforms={{ uOpacity: { value: 0 }, uSize: { value: 42 } }}
            vertexShader={POINT_VERTEX_SHADER}
            fragmentShader={SOFT_POINT_FRAGMENT_SHADER}
          />
        </points>
      </group>
    </group>
  );
}
