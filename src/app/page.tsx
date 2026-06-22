import { Header } from "@/components/Header";
import { HeroStory } from "@/components/HeroStory";
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
        <HeroStory />
        <NewArrivals />
        <BrandStory />
        <ArchiveStory />
        <AsWorn />
      </main>
      <Footer />
    </>
  );
}
