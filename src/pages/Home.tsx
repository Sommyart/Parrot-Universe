import AnimatedParrot from '../parrot/AnimatedParrot'
import HeroSection from '../components/HeroSection'
import { AccessoriesSection, EducationalSection, FeaturedParrots, SpeciesSection, WhyChooseUs } from '../components/HomeSections'
import Newsletter from '../components/Newsletter'
import { useStore } from '../context/StoreContext'
import { useReveal } from '../hooks/useReveal'

export default function Home() {
  const { parrotEnabled } = useStore()
  useReveal()
  return (
    <>
      <HeroSection />
      <FeaturedParrots />
      <WhyChooseUs />
      <SpeciesSection />
      <AccessoriesSection />
      <EducationalSection />
      <Newsletter />
      <AnimatedParrot enabled={parrotEnabled} />
    </>
  )
}
