'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, CreditCard } from 'lucide-react';

const footerLinks = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', href: '/products' },
      { name: 'New Arrivals', href: '/new-arrivals' },
      { name: 'Featured', href: '/featured' },
      { name: 'Deals', href: '/deals' },
      { name: 'Gift Cards', href: '/gift-cards' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Shipping & Returns', href: '/shipping-returns' },
      { name: 'Size Guide', href: '/size-guide' },
      { name: 'Track Order', href: '/track-order' },
    ],
  },
  {
    title: 'About Us',
    links: [
      { name: 'Our Story', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Affiliates', href: '/affiliates' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookie-policy' },
      { name: 'Accessibility', href: '/accessibility' },
      { name: 'Sitemap', href: '/sitemap' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background w-full">
      <div className="mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Newsletter */}
            <div className="lg:col-span-2 text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Subscribe to our newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Get the latest updates on new products and upcoming sales.
            </p>
            <div className="flex w-full max-w-md space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Subscribe
              </button>
            </div>
            
            <div className="mt-6 flex items-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="text-center md:text-left">
              <h3 className="text-sm font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:flex-row space-y-2 md:space-y-0 md:space-x-2 text-muted-foreground text-sm">
              <span>We accept</span>
              <div className="flex space-x-2">
                <CreditCard className="h-5 w-5" />
                <CreditCard className="h-5 w-5" />
                <CreditCard className="h-5 w-5" />
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} E-Commerce Store. All rights reserved.
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
