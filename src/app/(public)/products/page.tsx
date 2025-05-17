'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Filter, SlidersHorizontal, Search, ShoppingCart } from 'lucide-react';

// Mock data - replace with actual API calls
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviewCount: 128,
    image: '/images/headphones.jpg',
    category: 'Electronics',
    isNew: true,
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.2,
    reviewCount: 89,
    image: '/images/smartwatch.jpg',
    category: 'Electronics',
    isNew: true,
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviewCount: 215,
    image: '/images/shoes.jpg',
    category: 'Fashion',
    isNew: false,
  },
  {
    id: 4,
    name: 'Backpack',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.3,
    reviewCount: 156,
    image: '/images/backpack.jpg',
    category: 'Accessories',
    isNew: false,
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.1,
    reviewCount: 187,
    image: '/images/speaker.jpg',
    category: 'Electronics',
    isNew: true,
  },
  {
    id: 6,
    name: 'Sunglasses',
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.4,
    reviewCount: 92,
    image: '/images/sunglasses.jpg',
    category: 'Fashion',
    isNew: false,
  },
  {
    id: 7,
    name: 'Smartphone Stand',
    price: 19.99,
    originalPrice: 29.99,
    rating: 4.0,
    reviewCount: 76,
    image: '/images/stand.jpg',
    category: 'Accessories',
    isNew: true,
  },
  {
    id: 8,
    name: 'Fitness Tracker',
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.6,
    reviewCount: 203,
    image: '/images/fitness-tracker.jpg',
    category: 'Electronics',
    isNew: false,
  },
];

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'home', name: 'Home & Living' },
];

const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'newest', name: 'Newest' },
  { id: 'price-low-high', name: 'Price: Low to High' },
  { id: 'price-high-low', name: 'Price: High to Low' },
  { id: 'top-rated', name: 'Top Rated' },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filter products based on search, category, and price range
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return b.id - a.id; // Assuming higher IDs are newer
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'top-rated':
        return b.rating - a.rating;
      default: // 'featured'
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.rating - a.rating;
    }
  });

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground">Browse our wide selection of products</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <span className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <span>Sort by</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="md:hidden"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Mobile Filters */}
        {isFiltersOpen && (
          <div className="md:hidden p-4 border rounded-lg space-y-4">
            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="block h-full">
            <Card className="overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
              <div className="relative aspect-square bg-gray-100">
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                {product.isNew && (
                  <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">New</Badge>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button 
                    variant="outline" 
                    className="rounded-full bg-white text-gray-800 hover:bg-gray-100 z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle add to cart logic here
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">({product.reviewCount})</span>
                </div>
                <h3 className="font-medium text-lg mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice > product.price && (
                    <Badge variant="outline" className="ml-2 text-red-600 border-red-200 bg-red-50">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setPriceRange([0, 1000]);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
