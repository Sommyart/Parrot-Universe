import { Feather } from 'lucide-react'
import { useState } from 'react'
import { useWikiImage } from '../hooks/useWikiImage'

interface Props {
  title: string
  alt: string
  className?: string
  imgClassName?: string
  width?: number
  accent?: string
  credit?: boolean
}

/** Real species photography from Wikipedia / Wikimedia Commons with a graceful branded fallback. */
export default function WikiImage({ title, alt, className = '', imgClassName = '', width = 900, accent = '#238B57', credit = false }: Props) {
  const src = useWikiImage(title, width)
  const [loaded, setLoaded] = useState(false)
  const [broken, setBroken] = useState(false)
  const failed = src === null || broken
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${accent}33, #123D2B22)` }}>
      {!failed && src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setBroken(true)}
          className={`h-full w-full object-cover transition duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} ${imgClassName}`}
        />
      )}
      {(!loaded || failed) && (
        <div className="absolute inset-0 grid place-items-center">
          <Feather className={`h-10 w-10 text-forest/30 ${failed ? '' : 'animate-pulse'}`} />
        </div>
      )}
      {credit && loaded && (
        <a href={`https://en.wikipedia.org/wiki/${title}`} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur hover:bg-black/70">
          Photo: Wikimedia Commons
        </a>
      )}
    </div>
  )
}
