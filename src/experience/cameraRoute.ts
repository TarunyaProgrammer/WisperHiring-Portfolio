import gsap from 'gsap'

export type CameraPose = {
  x: number
  y: number
  z: number
  lookX: number
  lookY: number
  lookZ: number
  fov: number
}
type CameraWaypoint = CameraPose & { at: number; ease: 'sine.inOut' }

// Lens, gaze, height, and timing are composed as one route. The early frames
// establish the island, district frames descend to story scale, and transitions
// climb above the terrain before turning toward the next landmark.
export const cameraKeyframes: CameraWaypoint[] = [
  { at: 0, x: 24, y: 23, z: 30, lookX: 0, lookY: 0, lookZ: 0, fov: 36, ease: 'sine.inOut' },
  { at: 0.07, x: 20, y: 22, z: 27, lookX: -1, lookY: 0, lookZ: 1, fov: 37, ease: 'sine.inOut' },
  { at: 0.105, x: 7, y: 20, z: 24, lookX: -3, lookY: 1, lookZ: 3, fov: 38, ease: 'sine.inOut' },
  { at: 0.145, x: -16, y: 14, z: 20, lookX: -6, lookY: 1, lookZ: 4, fov: 39, ease: 'sine.inOut' },
  { at: 0.205, x: -17, y: 9, z: 10, lookX: -6, lookY: 1.5, lookZ: 4, fov: 45, ease: 'sine.inOut' },
  { at: 0.275, x: -10, y: 12, z: -2, lookX: -2, lookY: 1, lookZ: 1, fov: 42, ease: 'sine.inOut' },
  { at: 0.33, x: 14, y: 13, z: 18, lookX: 4, lookY: 1, lookZ: 4, fov: 40, ease: 'sine.inOut' },
  { at: 0.405, x: 17, y: 9, z: 7, lookX: 5, lookY: 1.2, lookZ: 3.8, fov: 46, ease: 'sine.inOut' },
  { at: 0.44, x: 8, y: 15, z: 0, lookX: 2, lookY: 1, lookZ: 0, fov: 43, ease: 'sine.inOut' },
  { at: 0.475, x: -3, y: 21, z: -8, lookX: 0, lookY: 1, lookZ: -1, fov: 40, ease: 'sine.inOut' },
  { at: 0.505, x: -14, y: 15, z: -13, lookX: -5, lookY: 2, lookZ: -4, fov: 40, ease: 'sine.inOut' },
  { at: 0.565, x: -15, y: 9, z: -1, lookX: -5, lookY: 2.5, lookZ: -4, fov: 47, ease: 'sine.inOut' },
  { at: 0.615, x: -5, y: 16, z: -14, lookX: -1, lookY: 1, lookZ: -3, fov: 42, ease: 'sine.inOut' },
  { at: 0.65, x: 7, y: 21, z: -17, lookX: 2, lookY: 1, lookZ: -3, fov: 40, ease: 'sine.inOut' },
  { at: 0.68, x: 17, y: 13, z: -11, lookX: 5, lookY: 1, lookZ: -4.7, fov: 42, ease: 'sine.inOut' },
  { at: 0.745, x: 12, y: 8, z: -15, lookX: 5, lookY: 1.6, lookZ: -4.7, fov: 47, ease: 'sine.inOut' },
  { at: 0.815, x: 8, y: 18, z: 6, lookX: 1, lookY: 1, lookZ: 0, fov: 42, ease: 'sine.inOut' },
  { at: 0.87, x: 22, y: 24, z: 29, lookX: 0, lookY: 0, lookZ: 0, fov: 37, ease: 'sine.inOut' },
  { at: 0.94, x: 15, y: 18, z: 31, lookX: 2, lookY: 1, lookZ: 5, fov: 39, ease: 'sine.inOut' },
  { at: 1, x: 24, y: 23, z: 30, lookX: 0, lookY: 0, lookZ: 0, fov: 36, ease: 'sine.inOut' },
]

export const initialCameraPose: CameraPose = {
  x: 24,
  y: 23,
  z: 30,
  lookX: 0,
  lookY: 0,
  lookZ: 0,
  fov: 36,
}

export function createCameraTimeline(pose: CameraPose) {
  Object.assign(pose, initialCameraPose)
  const timeline = gsap.timeline({ paused: true })
  for (let i = 1; i < cameraKeyframes.length; i++) {
    const key = cameraKeyframes[i]
    const previous = cameraKeyframes[i - 1]
    timeline.to(pose, {
      x: key.x,
      y: key.y,
      z: key.z,
      lookX: key.lookX,
      lookY: key.lookY,
      lookZ: key.lookZ,
      fov: key.fov,
      duration: key.at - previous.at,
      ease: key.ease,
    })
  }
  return timeline
}
