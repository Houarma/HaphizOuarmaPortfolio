import Section from "./Section";
import SystemsShowcase from "./SystemsShowcase";

export default function Systems() {
  return (
    <Section
      id="systems"
      chip="Systems"
      title="Products built under the constraints that"
      accent="make the questions hard."
      lede="Low-end devices, unreliable networks, cash-adjacent payment habits, and user bases small enough that every measurement is noisy. These are the conditions, not the excuses."
    >
      <SystemsShowcase />
    </Section>
  );
}
