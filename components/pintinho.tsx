export default function Pintinho({ size = 32, label }: { size?: number; label?: string }) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" {...a11y}>
      {/* tuft */}
      <path d="M23 12c-1-4 1-7 4-8-1 3 0 5 2 6" fill="none" stroke="#E5AE2C" strokeWidth="2.2" strokeLinecap="round" />
      {/* feet */}
      <path d="M20 42v3M28 42v3M18 45h4M26 45h4" fill="none" stroke="#E8702A" strokeWidth="2" strokeLinecap="round" />
      {/* body */}
      <circle cx="24" cy="27" r="16" fill="#F5C542" />
      {/* wings */}
      <ellipse cx="33" cy="31" rx="6.5" ry="4.5" fill="#E5AE2C" transform="rotate(-25 33 31)" />
      <ellipse cx="15" cy="31" rx="6.5" ry="4.5" fill="#E5AE2C" transform="rotate(25 15 31)" />
      {/* eyes */}
      <circle cx="18.5" cy="23" r="2.4" fill="#262723" />
      <circle cx="29.5" cy="23" r="2.4" fill="#262723" />
      <circle cx="19.3" cy="22.2" r="0.8" fill="#fff" />
      <circle cx="30.3" cy="22.2" r="0.8" fill="#fff" />
      {/* cheeks */}
      <ellipse cx="15.5" cy="27.5" rx="2.4" ry="1.4" fill="#F0907F" opacity="0.75" />
      <ellipse cx="32.5" cy="27.5" rx="2.4" ry="1.4" fill="#F0907F" opacity="0.75" />
      {/* beak */}
      <path d="M21.5 26.5h5l-2.5 3.6z" fill="#E8702A" stroke="#E8702A" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}
