import { SessionModalProvider } from '@/components/SessionModalContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Opening from '@/components/Opening';
import PlaqueReveal from '@/components/PlaqueReveal';
import HeritageTeaser from '@/components/HeritageTeaser';
import Narrative from '@/components/Narrative';
import Shop from '@/components/Shop';
import Experience from '@/components/Experience';
import Destination from '@/components/Destination';
import SystemSection from '@/components/SystemSection';
import Footer from '@/components/Footer';
import SessionModal from '@/components/SessionModal';
import EventPopup from '@/components/EventPopup';

export default function Home() {
  return (
    <SessionModalProvider>
      <EventPopup />
      <Header />
      <Hero />
      <Opening />
      <PlaqueReveal />
      <HeritageTeaser />
      <Narrative />
      <Shop />
      <Experience />
      <Destination />
      <SystemSection />
      <Footer />
      <SessionModal />
    </SessionModalProvider>
  );
}
