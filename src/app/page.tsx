import { Header } from "@/components/Header";
import { HeroStory } from "@/components/HeroStory";
import { MobileHero } from "@/components/MobileHero";
import { NewArrivals } from "@/components/NewArrivals";
import { BrandStory } from "@/components/BrandStory";
import { ArchiveStory } from "@/components/ArchiveStory";
import { AsWorn } from "@/components/AsWorn";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Desktop: scroll-driven hero story. Mobile: static stacked hero. */}
        <div className="hidden lg:block">
          <HeroStory />
        </div>
        <div className="h-[100px] lg:hidden" aria-hidden />
        <MobileHero />
        <NewArrivals />
        <BrandStory />
        <ArchiveStory />
        <AsWorn />
      </main>
      <Footer />
    </>
  );
}
