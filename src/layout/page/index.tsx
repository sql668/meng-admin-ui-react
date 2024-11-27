import { useOutlet } from 'react-router-dom'
export function NoLayout() {
  const currentOutlet = useOutlet()
  return <div className='h-full w-full'>{currentOutlet}</div>
}
