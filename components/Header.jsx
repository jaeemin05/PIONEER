'use client';

import { useEffect, useState } from 'react';
import { useSessionModal } from './SessionModalContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { open } = useSessionModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header id="site-header" className={scrolled ? 'scrolled' : ''}>
      <a href="#" className="header-logo">PIONEER</a>
      <nav>
        <a href="#narrative">Story</a>
        <a href="#experience">Navigator</a>
        <a href="#shop">The Plaque</a>
        <a
          href="#"
          className="nav-cta"
          onClick={(e) => { e.preventDefault(); open(); }}
        >
          Plaque 만들기
        </a>
      </nav>
    </header>
  );
}
