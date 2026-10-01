import EventHero from '@/components/event/EventHero';
import EventConcept from '@/components/event/EventConcept';
import EventCase from '@/components/event/EventCase';
import EventMidCta from '@/components/event/EventMidCta';
import EventGallery from '@/components/event/EventGallery';
import EventReviews from '@/components/event/EventReviews';
import EventFaq from '@/components/event/EventFaq';
import EventApplyForm from '@/components/event/EventApplyForm';
import EventFooter from '@/components/event/EventFooter';
import EventStickyCta from '@/components/event/EventStickyCta';

export const metadata = {
  title: 'PIONEER — 오픈 기념 이벤트',
};

export default function EventPage() {
  return (
    <div id="event-page">
      <div className="event-app">
        <EventHero />
        <EventConcept />
        <EventCase />
        <EventMidCta />
        <EventGallery />
        <EventReviews />
        <EventFaq />
        <EventApplyForm />
        <EventFooter />
      </div>
      <EventStickyCta />
    </div>
  );
}
