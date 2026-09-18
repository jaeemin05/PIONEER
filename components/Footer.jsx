'use client';

import { useSessionModal } from './SessionModalContext';

export default function Footer() {
  const { open } = useSessionModal();

  return (
    <footer>
      <div className="footer-row">
        <div>
          <div className="footer-logo">PIONEER</div>
          <span className="footer-dot">·</span>
          <div className="footer-tagline">Go. Lightly.</div>
        </div>
        <div className="footer-links">
          <a href="#narrative">Story</a>
          <a href="#experience">Navigator</a>
          <a href="#shop">The Plaque</a>
          <a href="#" onClick={(e) => { e.preventDefault(); open(); }}>Session</a>
          <a href="#">Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">37°N 126°E · PIONEER Station · 2024</div>
    </footer>
  );
}
