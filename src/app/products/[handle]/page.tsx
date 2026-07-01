import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductRail } from "@/components/product/ProductRail";
import { AsWorn } from "@/components/AsWorn";
import { Testimonials } from "@/components/product/Testimonials";
import { getProductByHandle, newArrivals, allProducts } from "@/lib/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProductByHandle(handle) ?? allProducts[0];

  return (
    <>
      <Header />
      <main className="flex-1 bg-black">
        <ProductDetail product={product} />

        {/* Lower sections: pure-black top (blends seamlessly with the black
            hero) with a soft silver glow rising from behind the cards. */}
        <div className="relative overflow-hidden bg-black">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(140% 78% at 50% 55%, rgba(150,152,172,0.5) 0%, rgba(122,124,146,0.24) 50%, rgba(0,0,0,0) 84%)",
            }}
          />
          <div className="relative">
            <ProductRail title="You May Also Like" products={newArrivals} />
            <AsWorn eyebrow="See It In Action" intro={false} id="see-it-in-action" />
            <Testimonials />
            <ProductRail title="More From The Collection" products={newArrivals} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
