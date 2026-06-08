import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import DiscountBanner from "@/components/home/DiscountBanner";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ProdutoSkeleton from "@/components/produto/ProdutoSkeleton";

function FeaturedSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <ProdutoSkeleton key={i} />)}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <CategoriesSection />
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <DiscountBanner />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
