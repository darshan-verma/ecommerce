export default function AboutPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">About Us</h1>
      <div className="prose max-w-3xl">
        <p className="text-lg mb-6">
          Welcome to our e-commerce store! We're dedicated to providing you with the best products and shopping experience.
        </p>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground">
              Founded in 2023, we started with a simple mission: to make online shopping easy, enjoyable, and accessible for everyone.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Customer satisfaction is our top priority</li>
              <li>Quality products at competitive prices</li>
              <li>Fast and reliable shipping</li>
              <li>Exceptional customer service</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
