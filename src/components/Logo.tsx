export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <circle cx="20" cy="20" r="19" fill={light ? '#FFF9EC' : '#123D2B'} />
        <path d="M27 12c-6-3-14 0-15 8-1 5 2 10 6 12l2-6c-2-1-3-3-2-5 1-3 5-4 7-2l2-7z" fill="#d7263d" />
        <path d="M18 26l2-6c3 1 6 0 7-3l2 4c-2 4-6 6-11 5z" fill="#2f7fc1" />
        <path d="M20 20c2 1 5 0 7-3l-1 6c-2 1-4 1-6-3z" fill="#F2BD45" />
        <path d="M27 12c2 1 3 3 2 5l-3-1z" fill={light ? '#123D2B' : '#FFF9EC'} />
        <circle cx="22.5" cy="15.5" r="1.3" fill={light ? '#123D2B' : '#FFF9EC'} />
      </svg>
      <span className={`font-display text-xl font-extrabold leading-none tracking-tight ${light ? 'text-cream' : 'text-forest'}`}>
        Parrot<span className="text-gold">.</span>Universe
      </span>
    </span>
  )
}
