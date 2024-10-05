import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { LoaderCircle } from 'lucide-react';

interface MDXContentProps {
  slug: string;
}

const MDXContent: ComponentType<MDXContentProps> = ({ slug }) => {
  const PostContent = dynamic(() => import(`@/posts/${slug}.mdx`), {
    loading: () => (
      <div className="flex justify-center items-center h-full">
        <LoaderCircle className="animate-spin" />
      </div>
    ),
  });

  return <PostContent />;
};

export default MDXContent;
