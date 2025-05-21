"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { UserButton } from "@/components/auth/UserButton";

interface HeaderProps {
	onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { totalItems } = useCart();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navLinks = [
		{ name: "Home", href: "/" },
		{ name: "Products", href: "/products" },
		{ name: "Categories", href: "/categories" },
		{ name: "Deals", href: "/deals" },
		{ name: "About", href: "/about" },
	];

	return (
		<header
			className={cn(
				"sticky top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 transition-all duration-200",
				isScrolled ? "shadow-sm" : ""
			)}
		>
			<div className="container flex h-16 items-center justify-between">
				{/* Logo */}
				<div className="flex items-center gap-6">
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
						<span className="sr-only">Toggle menu</span>
					</Button>
					<Link href="/" className="flex items-center space-x-2">
						<span className="text-xl font-bold">E-Commerce</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-6">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
						>
							{link.name}
						</Link>
					))}
				</nav>

				{/* Search and Cart */}
				<div className="flex items-center space-x-4">
					<div className="relative hidden md:block">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search products..."
							className="pl-9 w-[200px] lg:w-[300px]"
						/>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="relative"
						onClick={onCartClick}
					>
						<ShoppingCart className="h-5 w-5" />
						<span className="sr-only">Cart</span>
						{totalItems > 0 && (
							<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
								{totalItems}
							</span>
						)}
					</Button>

					<UserButton />
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden border-t">
					<div className="container py-4 space-y-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search products..."
								className="pl-9 w-full"
							/>
						</div>
						<nav className="flex flex-col space-y-2">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{link.name}
								</Link>
							))}
							<div className="mt-2">
								<UserButton />
							</div>
						</nav>
					</div>
				</div>
			)}
		</header>
	);
}
