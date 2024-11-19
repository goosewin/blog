import Link from 'next/link';
import Navigation from './navigation';
import Footer from './footer';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <header className="flex justify-between items-center py-4">
        <Link
          href="/"
          className="text-2xl items-center h-16 my-auto flex font-bold"
        >
          <span className="sm:hidden">DS</span>
          <span className="hidden sm:inline">Dan Goosewin</span>
        </Link>
        <Navigation />
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
