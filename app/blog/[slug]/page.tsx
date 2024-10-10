import { getAllBlogPosts, getBlogPost } from '@/lib/blog';
import { notFound, redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/app/components/structured-data';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description || 'A blog post by Daniel Stolbov',
    openGraph: {
      title: post.title,
      description: post.description || 'A blog post by Daniel Stolbov',
      type: 'article',
      publishedTime: post.date,
      authors: ['Daniel Stolbov'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || 'A blog post by Daniel Stolbov',
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

export default async function Article({
  params,
}: {
  params: { slug: string };
}) {
  const posts = await getAllBlogPosts();
  if (posts.length === 0) {
    redirect('/');
  }

  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Daniel Stolbov',
    },
    description: post.description || 'A blog post by Daniel Stolbov',
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <article className="prose dark:prose-invert max-w-none">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
            <span>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            |
            <span>
              <Link
                href="https://twitter.com/dan_goosewin"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                @dan_goosewin
              </Link>
            </span>
          </div>
        </div>
        <MDXContent slug={params.slug} />
      </article>
    </>
  );
}
