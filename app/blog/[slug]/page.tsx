import { getAllBlogPosts, getBlogPost } from '@/lib/blog';
import { notFound, redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/app/components/structured-data';
import SubscriptionForm from '@/app/components/subscription-form';
import { Surface } from '@/app/components/ui/surface';
import { RelatedPosts } from '@/app/components/article/related-posts';
import { ReadingProgress } from '@/app/components/article/reading-progress';
import { TableOfContents } from '@/app/components/article/table-of-contents';
import { ShareActions } from '@/app/components/article/share-actions';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description || 'A blog post by Dan Goosewin',
    openGraph: {
      title: post.title,
      description: post.description || 'A blog post by Dan Goosewin',
      type: 'article',
      publishedTime: post.date,
      authors: ['Dan Goosewin'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || 'A blog post by Dan Goosewin',
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const MDXContent = dynamic(() => import('@/app/components/mdx-content'), {
  ssr: true,
});

export default async function Article(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const posts = await getAllBlogPosts();
  if (posts.length === 0) {
    redirect('/');
  }

  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  // Find current post index and get previous/next posts
  const currentIndex = posts.findIndex((p) => p.slug === params.slug);
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Dan Goosewin',
    },
    description: post.description || 'A blog post by Dan Goosewin',
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://goosewin.com';
  const articleUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <>
      <StructuredData data={structuredData} />
      <ReadingProgress targetSelector="#article-content" />
      <div className="mt-4 grid gap-12 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <Surface variant="muted" className="sticky top-24 space-y-8 p-6">
            <TableOfContents targetSelector="#article-content" />
            <ShareActions title={post.title} url={articleUrl} />
          </Surface>
        </aside>

        <div className="space-y-12">
          <div className="lg:hidden">
            <Surface variant="muted" className="space-y-6 p-6">
              <TableOfContents targetSelector="#article-content" />
              <ShareActions title={post.title} url={articleUrl} />
            </Surface>
          </div>

          <article
            id="article-content"
            data-article
            className="prose prose-lg max-w-none text-[var(--color-text-muted)] dark:prose-invert"
          >
            <div className="mb-10 space-y-4">
              <span className="text-sm uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
                Published{' '}
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
              <h1 className="text-4xl font-semibold text-strong sm:text-[2.75rem]">
                {post.title}
              </h1>
        </div>
        <MDXContent slug={params.slug} />
      </article>

          <nav className="grid gap-4 sm:grid-cols-2">
          {previousPost && (
              <Surface variant="muted" className="p-4">
                <span className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
                  Previous
                </span>
                <Link
                  href={`/blog/${previousPost.slug}`}
                  className="mt-2 block text-base font-medium text-strong transition hover:text-accent"
                >
                  {previousPost.title}
            </Link>
              </Surface>
          )}
          {nextPost && (
              <Surface variant="muted" className="p-4 text-right">
                <span className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
                  Next
                </span>
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="mt-2 block text-base font-medium text-strong transition hover:text-accent"
                >
                  {nextPost.title}
            </Link>
              </Surface>
          )}
          </nav>

          <RelatedPosts posts={posts} currentSlug={params.slug} />

          <SubscriptionForm className="mt-12" />
        </div>
      </div>
    </>
  );
}
