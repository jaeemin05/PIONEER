// 수험생 기념 이벤트 페이지 — 우선 /event 구성을 그대로 재사용
import EventHero from '@/components/event/EventHero';
import EventMidCta from '@/components/event/EventMidCta';
import EventGallery from '@/components/event/EventGallery';
import EventReviews from '@/components/event/EventReviews';
import EventFooter from '@/components/event/EventFooter';
import EventStickyCta from '@/components/event/EventStickyCta';
import EventSheet from '@/components/event/EventApplySheet';
import { EventApplyProvider } from '@/components/event/EventApplyContext';

export const metadata = {
  title: 'PIONEER — 수험생 기념 이벤트',
};

const SUNEUNG_COPY = { headline: 'EXAM EVENT', title: '수험생 기념 무료 이벤트', name: '수험생 기념' };

export default function SuneungEventPage() {
  return (
    <EventApplyProvider copy={SUNEUNG_COPY}>
      <div id="event-page">
        <div className="event-app">
          <EventHero />
          <EventMidCta />
          <EventGallery />
          <EventReviews />
          <EventFooter />
        </div>
        <EventStickyCta />
        <EventSheet />
      </div>
    </EventApplyProvider>
  );
}
