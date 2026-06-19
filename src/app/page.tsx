import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { NewArrivals } from "@/components/NewArrivals";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <NewArrivals />
      </main>
      <Footer />
    </>
  );
}
