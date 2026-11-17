import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="container-x grid min-h-[70vh] place-items-center pt-28 text-center">
      <div>
        <p className="font-display text-8xl font-extrabold text-gold">404</p>
        <h1 className="mt-2 text-4xl font-bold text-forest">This page flew the coop.</h1>
        <Link to="/" className="btn-green mt-8">Back home</Link>
      </div>
    </div>
  )
}
