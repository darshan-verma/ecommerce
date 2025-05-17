export default function DealsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Deals & Offers</h1>
      <div className="grid gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Special Discounts</h2>
          <p className="text-muted-foreground">Check out our latest deals and special offers on selected products.</p>
        </div>
        {/* Add more deal items here */}
      </div>
    </div>
  );
}
