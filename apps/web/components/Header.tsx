import Link from 'next/link';

export function Header() {
  return (
    <header>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center p-2">
        <p className="text-sm">🌲 Honduras&apos; Largest Batana Oil Supplier | Global Shipping | Retail and Bulk Supplier | Direct from Forest to Your Doorstep</p>
      </div>
      {/* Main Navigation */}
      <nav className="container mx-auto flex justify-between items-center py-4">
        <div>
          <Link href="/">
            {/* Logo will be implemented here */}
            <span className="text-xl font-bold">Forestal MT</span>
          </Link>
        </div>
        <div>
          <Link href="/shop" className="mr-4">Shop</Link>
          <Link href="/about" className="mr-4">About</Link>
          <Link href="/contact" className="mr-4">Contact</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </nav>
    </header>
  );
}
