import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Vector3 } from 'three'
import { useMemo } from 'react'
import { useExperience } from './controller'
import { initialCameraPose } from './cameraRoute'

// GSAP authors the route; this component only copies its pose to Three.js.
export function CameraRig() {
  const { cameraPose, reduced } = useExperience()
  const { camera } = useThree()
  const target = useMemo(() => new Vector3(), [])
  useFrame(() => {
    const pose = reduced ? initialCameraPose : cameraPose.current
    camera.position.set(pose.x, pose.y, pose.z)
    target.set(pose.lookX, pose.lookY, pose.lookZ)
    camera.lookAt(target)
    const perspective = camera as PerspectiveCamera
    if (Math.abs(perspective.fov - pose.fov) > 0.01) {
      perspective.fov = pose.fov
      perspective.updateProjectionMatrix()
    }
  })
  return null
}
