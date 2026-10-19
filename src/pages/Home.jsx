import HeroDesktop from '../components/home/HeroDesktop'
import HeroMobile from '../components/home/HeroMobile'
import { BuildTeaser, CategoryShowcase, DealsBento, Gallery, HowItWorks, PopularSection, QuickLinks, StorySection, Testimonials } from '../components/home/Sections'

export default function Home() {
  return (
    <>
      <HeroMobile />
      <HeroDesktop />
      <CategoryShowcase />
      <PopularSection />
      <QuickLinks />
      <DealsBento />
      <BuildTeaser />
      <HowItWorks />
      <StorySection />
      <Testimonials />
      <Gallery />
    </>
  )
}
