'use client';

export function Popup({
  open,
  message,
  header,
  onClose
}: {
  open: boolean;
  message: string;
  header?: string;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }
  return (
    <div className="overlay">
      <div className="popup">
        <div className="closePopup" style={{ textAlign: 'right' }} onClick={onClose}>
          <i className="fa-solid fa-circle-xmark fa-fade" style={{ color: 'var(--b-darkblack)' }} />
        </div>
        {header ? (
          <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '2rem', marginBottom: '1rem' }}>{header}</div>
        ) : null}
        <br />
        {message}
      </div>
    </div>
  );
}
