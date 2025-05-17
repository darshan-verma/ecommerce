export default function CategoriesPage() {
  const categories = [
    { id: 1, name: 'Electronics', count: 124, image: '/categories/electronics.jpg' },
    { id: 2, name: 'Fashion', count: 89, image: '/categories/fashion.jpg' },
    { id: 3, name: 'Home & Garden', count: 76, image: '/categories/home.jpg' },
    { id: 4, name: 'Beauty', count: 64, image: '/categories/beauty.jpg' },
    { id: 5, name: 'Sports', count: 42, image: '/categories/sports.jpg' },
    { id: 6, name: 'Books', count: 57, image: '/categories/books.jpg' },
  ];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="relative group overflow-hidden rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-muted/50 flex items-center justify-center">
              <span className="text-4xl">{category.name.charAt(0)}</span>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{category.name}</h2>
              <p className="text-sm text-muted-foreground">{category.count} items</p>
            </div>
            <a 
              href={`/products?category=${category.id}`} 
              className="absolute inset-0" 
              aria-label={`View ${category.name}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
