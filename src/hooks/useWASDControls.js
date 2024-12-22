import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

export function useWASDControls({ speed = 1, enabled = true } = {}) {
  const { camera } = useThree()
  
  useEffect(() => {
    if (!enabled) return
    
    const keys = new Set()
    const direction = new Vector3()
    const frontVector = new Vector3()
    const sideVector = new Vector3()
    
    const handleKeyDown = (e) => {
      keys.add(e.key.toLowerCase())
      
      // Calculate movement direction
      frontVector.set(0, 0, 0)
      sideVector.set(0, 0, 0)
      
      keys.forEach(key => {
        // Forward/Backward
        if (key === 'w' || key === 'arrowup') frontVector.z -= 1
        if (key === 's' || key === 'arrowdown') frontVector.z += 1
        // Left/Right
        if (key === 'a' || key === 'arrowleft') sideVector.x -= 1
        if (key === 'd' || key === 'arrowright') sideVector.x += 1
      })

      // Get camera's forward direction (excluding vertical component)
      direction.copy(frontVector)
        .applyQuaternion(camera.quaternion)
        .add(sideVector.applyQuaternion(camera.quaternion))
        .normalize()
        .multiplyScalar(speed)

      // Apply movement
      camera.position.add(direction)
    }
    
    const handleKeyUp = (e) => {
      keys.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [camera, speed, enabled])
}
