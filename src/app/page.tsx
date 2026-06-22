import { Header } from "@/components/Header";
import { HeroStory } from "@/components/HeroStory";
import { NewArrivals } from "@/components/NewArrivals";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroStory />
        <NewArrivals />
      </main>
      <Footer />
    </>
  );
}
