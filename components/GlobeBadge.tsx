// A globe set inside a line of type. The Earth texture is a real
// equirectangular map scrolling behind a circular window; the lighting is
// painted on top and does not turn with it, the way a lit sphere behaves.
export default function GlobeBadge() {
  return (
    <span className="relative mx-[0.16em] inline-block h-[1.15em] w-[1.15em] -translate-y-[0.08em] align-middle">
      <span className="globe-window absolute inset-0 overflow-hidden rounded-full">
        <span className="globe-strip" />
      </span>
      <span aria-hidden="true" className="globe-shade absolute inset-0 rounded-full" />
    </span>
  );
}
