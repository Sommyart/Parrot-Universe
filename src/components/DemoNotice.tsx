import { Info } from 'lucide-react'
export default function DemoNotice({ text = 'Demonstration catalogue only. No live animals are offered for sale through this website.', className = '' }: { text?: string; className?: string }) {
  return (
    <div role="note" className={`flex items-start gap-3 rounded-2xl border border-gold/60 bg-gold/15 px-4 py-3 text-sm font-semibold text-forest ${className}`}>
      <Info className="mt-0.5 h-4 w-4 shrink-0" /> <span>{text}</span>
    </div>
  )
}
