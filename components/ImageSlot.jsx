export default function ImageSlot({ src, alt, className, phVariant = 'ph-dark', icon = '◻', label, subLines = [], fadeRef }) {
  if (src) {
    return (
      <div className={className} ref={fadeRef} style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={src}
          alt={alt}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>
    );
  }

  return (
    <div className={`${className} ph ${phVariant}`} ref={fadeRef}>
      <span className="ph-icon">{icon}</span>
      <span>{label}</span>
      {subLines.map((sub, i) => (
        <span className="ph-sub" key={i}>{sub}</span>
      ))}
    </div>
  );
}
