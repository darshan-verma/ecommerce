'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Share2, Truck, Shield, RefreshCw, ArrowLeft, Minus, Plus, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { ImageZoom } from '@/components/product/image-zoom';
import { ReviewSection } from '@/components/product/review-section';

// Mock data function - replace with actual API call
const getProductById = async (id: string) => {
  // In a real app, you would fetch from your API
  // const response = await fetch(`/api/products/${id}`);
  // return response.json();
  
  // Mock data for demonstration
  const products = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 199.99,
      originalPrice: 249.99,
      description: 'Experience crystal clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
      rating: 4.5,
      reviewCount: 128,
      images: [
        // 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
        // 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
        // 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=800&auto=format&fit=crop&q=60',
        // 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=60',
      ],
      colors: [
        { id: 'black', name: 'Black', class: 'bg-gray-900' },
        { id: 'silver', name: 'Silver', class: 'bg-gray-300' },
        { id: 'blue', name: 'Navy Blue', class: 'bg-blue-800' },
      ],
      features: [
        'Active Noise Cancellation',
        '30-hour battery life',
        'Bluetooth 5.0',
        'Built-in microphone',
        'Foldable design',
        'Touch controls',
      ],
      specifications: {
        'Brand': 'AudioPro',
        'Model': 'AP-WH1000',
        'Connectivity': 'Bluetooth 5.0, 3.5mm',
        'Battery Life': 'Up to 30 hours',
        'Charging Time': '2 hours',
        'Weight': '254g',
        'Warranty': '2 years',
        'Display': 'N/A',
        'Water Resistance': 'N/A',
        'Charging': 'N/A',
        'Material': 'N/A',
        'Dimensions': 'N/A',
        'Compatibility': 'N/A'
      },
      isInStock: true,
      isNew: true,
      freeShipping: true,
      discount: 20,
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      price: 249.99,
      originalPrice: 299.99,
      description: 'Stay connected and track your fitness with our advanced smartwatch. Features include heart rate monitoring, GPS, and 7-day battery life.',
      rating: 4.3,
      reviewCount: 89,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1579586337278-3befd89cf697?w=800&auto=format&fit=crop&q=60',
      ],
      colors: [
        { id: 'black', name: 'Black', class: 'bg-gray-900' },
        { id: 'silver', name: 'Silver', class: 'bg-gray-300' },
      ],
      features: [
        'Heart rate monitoring',
        'GPS tracking',
        '7-day battery life',
        'Water resistant',
        'Smart notifications',
      ],
      specifications: {
        'Brand': 'TechWear',
        'Model': 'TW-2000',
        'Display': '1.4" AMOLED',
        'Battery Life': 'Up to 7 days',
        'Water Resistance': '5 ATM',
        'Weight': '48g',
        'Warranty': '1 year',
        'Connectivity': 'N/A',
        'Charging Time': 'N/A',
        'Charging': 'N/A',
        'Material': 'N/A',
        'Dimensions': 'N/A',
        'Compatibility': 'N/A'
      },
      isInStock: true,
      isNew: true,
      freeShipping: true,
      discount: 17,
    },
    {
      id: '3',
      name: 'Wireless Earbuds',
      price: 129.99,
      originalPrice: 159.99,
      description: 'Premium wireless earbuds with crystal clear sound and comfortable fit. Perfect for workouts and daily use.',
      rating: 4.7,
      reviewCount: 215,
      images: [
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=60',
      ],
      colors: [
        { id: 'white', name: 'White', class: 'bg-white' },
        { id: 'black', name: 'Black', class: 'bg-gray-900' },
      ],
      features: [
        'True wireless',
        '24-hour battery life',
        'Bluetooth 5.0',
        'Touch controls',
        'Sweatproof',
      ],
      specifications: {
        'Brand': 'SoundBeats',
        'Model': 'SB-100',
        'Battery Life': 'Up to 8 hours (24h with case)',
        'Charging': 'USB-C',
        'Weight': '5g per earbud',
        'Warranty': '1 year',
        'Connectivity': 'N/A',
        'Charging Time': 'N/A',
        'Display': 'N/A',
        'Water Resistance': 'N/A',
        'Material': 'N/A',
        'Dimensions': 'N/A',
        'Compatibility': 'N/A'
      },
      isInStock: true,
      isNew: false,
      freeShipping: true,
      discount: 19,
    },
    {
      id: '4',
      name: 'Laptop Backpack',
      price: 59.99,
      originalPrice: 79.99,
      description: 'Durable and stylish backpack designed for laptops up to 15.6". Multiple compartments for all your essentials.',
      rating: 4.6,
      reviewCount: 156,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60',
      ],
      colors: [
        { id: 'black', name: 'Black', class: 'bg-gray-900' },
        { id: 'navy', name: 'Navy Blue', class: 'bg-blue-900' },
      ],
      features: [
        'Fits up to 15.6" laptop',
        'USB charging port',
        'Anti-theft pocket',
        'Water-resistant material',
        'Comfortable shoulder straps',
      ],
      specifications: {
        'Brand': 'UrbanGear',
        'Model': 'N/A',
        'Material': 'Polyester',
        'Dimensions': '18 x 13 x 8 inches',
        'Weight': '1.2kg',
        'Warranty': '2 years',
        'Connectivity': 'N/A',
        'Battery Life': 'N/A',
        'Charging Time': 'N/A',
        'Display': 'N/A',
        'Water Resistance': 'N/A',
        'Charging': 'N/A',
        'Compatibility': 'N/A'
      },
      isInStock: true,
      isNew: false,
      freeShipping: true,
      discount: 25,
    },
    {
      id: '5',
      name: 'Smartphone Stand',
      price: 19.99,
      originalPrice: 24.99,
      description: 'Adjustable smartphone stand for comfortable viewing at your desk or bedside. Compatible with most smartphones.',
      rating: 4.4,
      reviewCount: 87,
      images: [
        'https://images.unsplash.com/photo-1601784551446-9e2e4f9e3c07?w=800&auto=format&fit=crop&q=60',
      ],
      colors: [
        { id: 'black', name: 'Black', class: 'bg-gray-900' },
        { id: 'white', name: 'White', class: 'bg-white' },
      ],
      features: [
        'Adjustable viewing angle',
        'Universal compatibility',
        'Sturdy base',
        'Sleek design',
      ],
      specifications: {
        'Brand': 'DeskMate',
        'Model': 'N/A',
        'Material': 'ABS Plastic',
        'Compatibility': 'All smartphones',
        'Weight': '150g',
        'Warranty': 'N/A',
        'Connectivity': 'N/A',
        'Battery Life': 'N/A',
        'Charging Time': 'N/A',
        'Display': 'N/A',
        'Water Resistance': 'N/A',
        'Charging': 'N/A',
        'Dimensions': 'N/A'
      },
      isInStock: true,
      isNew: true,
      freeShipping: false,
      discount: 20,
    },
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const product = products.find(p => p.id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: Array<{ id: string; name: string; class: string }>;
  features: string[];
  specifications: Record<string, string>;
  isInStock: boolean;
  isNew: boolean;
  freeShipping: boolean;
  discount: number;
}

export function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('black');
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { id } = useParams();
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await getProductById(id as string);
        setProduct(productData);
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading product...</span>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Product not found</h2>
        <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/products')}>Back to Products</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: Number(product.id), // Convert string ID to number
      name: product.name,
      price: product.price,
      color: selectedColor,
      image: product.images[0],
    });
  };

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Button>

      <div className="grid gap-8 md:grid-cols-2 overflow-hidden">
        {/* Product Images */}
        <div className="space-y-4">
          <div 
            className="relative aspect-square rounded-lg bg-gray-100 cursor-zoom-in overflow-hidden"
            onClick={() => setIsImageZoomed(true)}
          >
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-2 left-2 flex gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {product.rating}
              </Badge>
              {product.isNew && <Badge variant="destructive">New</Badge>}
              {product.discount > 0 && (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  -{product.discount}%
                </Badge>
              )}
            </div>
          </div>
          <ImageZoom 
            src={product.images[selectedImage]}
            alt={product.name}
            isOpen={isImageZoomed}
            onClose={() => setIsImageZoomed(false)}
          />
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border transition-all ${
                  selectedImage === index ? 'ring-2 ring-primary' : 'border-gray-200'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discount > 0 && (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  Save {product.discount}%
                </Badge>
              )}
            </div>
            {product.freeShipping && (
              <p className="flex items-center gap-1 text-sm text-green-600">
                <Truck className="h-4 w-4" /> Free shipping
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Color</h3>
              <div className="mt-2 flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 ${
                      selectedColor === color.id ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedColor(color.id)}
                  >
                    <span
                      className={`block h-full w-full rounded-full ${color.class}`}
                      title={color.name}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Selected: {product.colors.find(c => c.id === selectedColor)?.name}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Quantity</h3>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  className="w-16 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => {
                handleAddToCart();
                router.push('/checkout');
              }}
            >
              Buy Now
            </Button>
          </div>

          <div className="flex gap-4 pt-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Add to Wishlist</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
            <div className="flex flex-col items-center text-center">
              <Truck className="h-6 w-6 text-muted-foreground" />
              <h4 className="mt-1 text-sm font-medium">Free Shipping</h4>
              <p className="text-xs text-muted-foreground">On all orders</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <RefreshCw className="h-6 w-6 text-muted-foreground" />
              <h4 className="mt-1 text-sm font-medium">Easy Returns</h4>
              <p className="text-xs text-muted-foreground">30-day returns</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="h-6 w-6 text-muted-foreground" />
              <h4 className="mt-1 text-sm font-medium">Warranty</h4>
              <p className="text-xs text-muted-foreground">{product.specifications.Warranty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs defaultValue="description" className="mt-16">
        <TabsList className="grid w-full grid-cols-3 md:w-1/2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="description" className="space-y-6">
            <div className="prose max-w-none">
              <p>{product.description}</p>
              <h3 className="mt-6 text-lg font-medium">Features</h3>
              <ul className="mt-2 list-disc pl-5">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="space-y-6">
            <div className="space-y-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex border-b pb-2">
                  <span className="w-1/3 font-medium text-gray-600">{key}</span>
                  <span className="w-2/3">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-6">
            <ReviewSection productId={typeof id === 'string' ? parseInt(id) : 1} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
