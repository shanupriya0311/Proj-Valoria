import { HeroSection } from '@/components/hero-section';
import { OrbitShowcase } from '@/components/orbit-showcase';
import { LabProjects } from '@/components/lab-projects';
import { LaunchSection } from '@/components/motion-console';
import { ConnectSection } from '@/components/connect-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full">
      <HeroSection />
      <OrbitShowcase />
      <LabProjects />
      <LaunchSection />
      <ConnectSection />
      <Footer />
    </main>
  );
}
