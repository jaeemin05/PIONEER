// 수험생 기념 이벤트 페이지 — 우선 /event 구성을 그대로 재사용
import EventHero from '@/components/event/EventHero';
import EventConcept from '@/components/event/EventConcept';
import EventCase from '@/components/event/EventCase';
import EventMidCta from '@/components/event/EventMidCta';
import EventGallery from '@/components/event/EventGallery';
import EventReviews from '@/components/event/EventReviews';
import EventFaq from '@/components/event/EventFaq';
import EventFooter from '@/components/event/EventFooter';
import EventStickyCta from '@/components/event/EventStickyCta';
import EventSheet from '@/components/event/EventApplySheet';
import { EventApplyProvider } from '@/components/event/EventApplyContext';

export const metadata = {
  title: 'PIONEER — 수험생 기념 이벤트',
};

export default function SuneungEventPage() {
  return (
    <EventApplyProvider>
      <div id="event-page">
        <div className="event-app">
          <EventHero />
          <EventConcept />
          <EventCase />
          <EventMidCta />
          <EventGallery />
          <EventReviews />
          <EventFaq />
          <EventFooter />
        </div>
        <EventStickyCta />
        <EventSheet />
      </div>
    </EventApplyProvider>
  );
}
