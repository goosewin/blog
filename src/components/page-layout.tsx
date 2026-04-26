import Footer from './footer';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
      <main
        className="flex-1 flex flex-col justify-center py-10"
        style={{ viewTransitionName: 'main-content-transition' }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
