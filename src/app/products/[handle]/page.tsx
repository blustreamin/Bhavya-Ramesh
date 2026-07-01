import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductRail } from "@/components/product/ProductRail";
import { SeeItInAction } from "@/components/product/SeeItInAction";
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
                "radial-gradient(120% 50% at 50% 36%, rgba(150,152,172,0.5) 0%, rgba(120,122,145,0.16) 44%, rgba(0,0,0,0) 72%)",
            }}
          />
          <div className="relative">
            <ProductRail title="You May Also Like" products={newArrivals} />
            <SeeItInAction />
            <Testimonials />
            <ProductRail title="More From The Collection" products={newArrivals} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
