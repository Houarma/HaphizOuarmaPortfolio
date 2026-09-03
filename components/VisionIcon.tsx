const PATHS = {
  eye: (
    <>
      <path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 3c3.4 2.3 5.2 5.6 5.2 9.4L14 15.6H10L6.8 12.4C6.8 8.6 8.6 5.3 12 3Z" />
      <path d="M10 15.6 8.4 20l3.6-1.8L15.6 20 14 15.6" />
      <circle cx="12" cy="10.4" r="1.6" />
    </>
  ),
  cap: (
    <>
      <path d="M12 4 2.5 8.6 12 13.2l9.5-4.6L12 4Z" />
      <path d="M6.6 10.8v4.4c0 1.5 2.4 2.8 5.4 2.8s5.4-1.3 5.4-2.8v-4.4" />
      <path d="M21.5 8.6v5" />
    </>
  ),
  bulb: (
    <>
      <path d="M9.4 18h5.2" />
      <path d="M10 21h4" />
      <path d="M9.8 18c0-1.4-.6-2.2-1.5-3.3a5.6 5.6 0 1 1 8.7-.2c-.9 1.2-1.6 2-1.6 3.5" />
    </>
  ),
};

export type VisionIconName = keyof typeof PATHS;

export default function VisionIcon({ name }: { name: VisionIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
