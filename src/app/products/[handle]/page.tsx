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

        {/* Lower sections sit on a cool grey gradient (Figma). */}
        <div className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 55% at 50% 32%, #3a3b43 0%, #212227 42%, #121317 70%, #0a0a0c 100%)",
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
