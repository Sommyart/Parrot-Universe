import { Feather } from 'lucide-react'
import { useState } from 'react'
import { useWikiImage } from '../hooks/useWikiImage'

/** Local photos (public/img/species/<file>.jpg) are used first; Wikipedia is only a fallback. */
const LOCAL: Record<string, string> = {
  Grey_parrot: 'african-grey',
  'Blue-and-yellow_macaw': 'blue-and-gold-macaw',
  Scarlet_macaw: 'scarlet-macaw',
  Sun_parakeet: 'sun-conure',
  'Green-cheeked_parakeet': 'green-cheeked-conure',
  Cockatiel: 'cockatiel',
  Moluccan_eclectus: 'eclectus',
  'Rose-ringed_parakeet': 'indian-ringneck',
  Budgerigar: 'budgerigar',
  Hyacinth_macaw: 'hyacinth-macaw',
}

interface Props {
  title: string
  alt: string
  className?: string
  imgClassName?: string
  width?: number
  accent?: string
  credit?: boolean
}

export default function WikiImage({ title, alt, className = '', imgClassName = '', width = 900, accent = '#238B57', credit = false }: Props) {
  const local = LOCAL[title] ? `/img/species/${LOCAL[title]}.jpg` : null
  const [localFailed, setLocalFailed] = useState(!local)
  const wiki = useWikiImage(localFailed ? title : undefined, width)
  const src = !localFailed ? local : wiki
  const [loaded, setLoaded] = useState(false)
  const [broken, setBroken] = useState(false)
  const failed = localFailed && (wiki === null || broken)
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${accent}33, #123D2B22)` }}>
      {!failed && src && (
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => (localFailed ? setBroken(true) : setLocalFailed(true))}
          className={`h-full w-full object-cover transition duration-700 ${loaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'} ${imgClassName}`}
        />
      )}
      {(!loaded || failed) && (
        <div className="absolute inset-0 grid place-items-center">
          <Feather className={`h-10 w-10 text-forest/30 ${failed ? '' : 'animate-pulse'}`} />
        </div>
      )}
      {credit && loaded && localFailed && (
        <a href={`https://en.wikipedia.org/wiki/${title}`} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur hover:bg-black/70">
          Photo: Wikimedia Commons
        </a>
      )}
    </div>
  )
}
