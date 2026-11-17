export default function PageHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="relative overflow-hidden bg-forest pb-20 pt-36 text-cream">
      <div className="leaf-pattern absolute inset-0" />
      <div className="container-x relative">
        <p className="eyebrow !text-gold">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-extrabold leading-tight sm:text-6xl">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg text-cream/75">{text}</p>}
      </div>
    </section>
  )
}
