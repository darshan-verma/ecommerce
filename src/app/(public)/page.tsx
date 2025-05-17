import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-2xl px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Welcome to Our E-Commerce Store
        </h1>
        <p className="text-xl text-muted-foreground">
          Discover amazing products at unbeatable prices. Shop the latest trends in fashion, electronics, home, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/products">
              Shop Now
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
