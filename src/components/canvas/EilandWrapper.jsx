import { useState, useRef } from 'react'
import { OrbitControls, Sky, RandomizedLight } from '@react-three/drei'
import { Eiland } from './Eiland'
import { useEilandLogic } from '../../hooks/useEilandLogic'
import { WASDControls } from '../controls/WASDControls'

export function EilandWrapper(props) {
  const ref = useRef();
  const [modelData, setModelData] = useState(null)
  const eilandLogic = useEilandLogic(modelData || {})
  
  return (
    <>
      <OrbitControls ref={ref} autoRotate={false} />
      <WASDControls speed={1} enabled={true} />
      <RandomizedLight amount={8} position={[5, -55, -10]} intensity={25} />
      <Sky 
        distance={100000} 
        sunPosition={[0, 1000, 0]} 
        inclination={0} 
        azimuth={0.25} 
        {...props.skyProps} 
      />
      <Eiland {...props} onLoadData={setModelData} />
    </>
  )
}
