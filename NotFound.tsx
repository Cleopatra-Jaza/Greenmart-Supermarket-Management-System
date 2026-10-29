import { Link } from 'react-router-dom'
import { Compass, Home } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found__icon">
        <Compass size={30} />
      </span>
      <h1 className="not-found__code">404</h1>
      <p className="not-found__title">This aisle is empty</p>
      <p className="not-found__text">
        The page you were looking for does not exist in the Greenmart
        workspace.
      </p>
      <Link to="/">
        <Button icon={<Home size={16} />}>Back to dashboard</Button>
      </Link>
    </div>
  )
}
