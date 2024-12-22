import { useWASDControls } from '../../hooks/useWASDControls'

export function WASDControls({ speed = 1, enabled = true }) {
  useWASDControls({ speed, enabled })
  return null
}
