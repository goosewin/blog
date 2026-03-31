import { ViewTransition } from 'react';
import Footer from './footer';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
      <ViewTransition default="main-content-transition">
        <main className="flex-1 flex flex-col justify-center py-10">
          {children}
        </main>
      </ViewTransition>
      <Footer />
    </div>
  );
}
