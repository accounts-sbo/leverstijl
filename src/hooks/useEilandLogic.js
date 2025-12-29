import { MathUtils } from 'three';
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAnimations } from '@react-three/drei'

export function useEilandLogic({ nodes, materials, groupRef } = {}) {
  const { camera, scene } = useThree()
  console.log("scene", scene)
  const radius = 100
  const speed = 0.2

  // ------------------------------------------------------------------------------------------------------ //
  // Get animations if they exist
  // collect all animations from the scene using recursive search to find all animations of all children
  const allAnimations = new Set();
  const animations = scene.traverse((child) => {
    if (child.animations) {
      child.animations.forEach((animation) => {
        allAnimations.add(animation);
      });
    }
  });
  // ------------------------------------------------------------------------------------------------------ //
  // find element with name Turbina_Heolica and rotate the geometry arround the x axis
  // zoek alle Turbina_Wieken en roteer deze om de y-as ze beginnen allemaal met de naam Turbina_Wieken
  const turbineWieken = new Set();
  const ROTATION_SPEED = 0.02;

  useEffect(() => {
    // Collect turbine elements after scene is loaded
    // draaiendeWieken
    // Turbina_Wieken
    scene.traverse((child) => {
      if (child.name.includes("Turbina_Wieken")) {
        turbineWieken.add(child);
        console.log("Found turbine:", child.name);
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (turbineWieken.size > 0) {  // Check Set size instead of length
      turbineWieken.forEach((wiek) => {  // Set.forEach works differently than Array.forEach
        wiek.rotation.z += ROTATION_SPEED;  // Changed to y-axis rotation

        // Keep rotation between 0 and 2π
        if (wiek.rotation.z >= Math.PI * 2) {
          wiek.rotation.z = 0;
        }
      });
    }
  });
  // const turbine = scene.getObjectByName("Turbina_Heolica")
  // console.log("turbine", turbine)

  // ------------------------------------------------------------------------------------------------------ //
  // Camera circular motion
  useEffect(() => {
    // Set initial camera position to view the island from above and at an angle
    camera.position.set(30, 25, 50)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed

    // Slow circular motion around the island
    const circleRadius = 50
    camera.position.x = Math.cos(t) * circleRadius
    camera.position.z = Math.sin(t) * circleRadius
    camera.position.y = 25 + Math.sin(t * 0.5) * 5 // Gentle up/down motion

    // Always look at center of the island
    camera.lookAt(0, 0, 0)
  })

  return {
    // actions: actions ?? {},
    // nodes: nodes ?? {},
    // materials: materials ?? {}
  }
}
