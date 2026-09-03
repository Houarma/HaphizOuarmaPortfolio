import TopBar from "@/components/TopBar";
import GridBackdrop from "@/components/GridBackdrop";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Bento from "@/components/Bento";
import Systems from "@/components/Systems";
import Research from "@/components/Research";
import Thesis from "@/components/Thesis";
import SiteFooter from "@/components/SiteFooter";
import Motion from "@/components/Motion";
import { Contact } from "@/components/Closing";

export default function Page() {
  return (
    <>
      <Motion />

      {/* The first screen carries the grid; everything below it is plain. */}
      <div id="top" className="relative">
        <GridBackdrop />

        <div className="relative z-10 mx-auto w-full max-w-[980px] px-5 pt-[44px] sm:px-8">
          <TopBar />
          <Hero />
          <AboutMe />
          <Bento />
        </div>
      </div>

      <main>
        {/* The products first, then the writing they raise. */}
        <div className="mx-auto w-full max-w-[980px] px-5 sm:px-8">
          <Systems />
          <Research />
        </div>

        {/* Full-bleed: the thesis lands on the map. */}
        <Thesis />
      </main>

      <Contact />
      <SiteFooter />
    </>
  );
}
