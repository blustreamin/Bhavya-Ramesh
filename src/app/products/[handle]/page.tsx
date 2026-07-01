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

        {/* Lower sections: a cool silver glow over pure black so the top blends
            seamlessly with the black hero above (Figma). */}
        <div className="relative overflow-hidden bg-black">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 42% at 50% 26%, rgba(154,156,176,0.72) 0%, rgba(128,130,150,0.28) 44%, rgba(0,0,0,0) 68%)",
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
