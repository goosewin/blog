import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface BlogPostData {
  title: string;
  slug: string;
  description?: string;
  date: string;
  image?: string;
}

interface NewsletterEmailProps {
  posts: BlogPostData[];
  baseUrl: string;
}

export default function NewsletterEmail({
  posts,
  baseUrl,
}: NewsletterEmailProps) {
  const isSinglePost = posts.length === 1;
  const previewText = isSinglePost
    ? `${posts[0].title} - ${posts[0].description || ''}`
    : `${posts.length} new posts from Dan Goosewin`;

  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Space Grotesk"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap',
            format: 'woff2',
          }}
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.branding}>
            <Img
              src={`${baseUrl}/icon.png`}
              alt="Dan Goosewin"
              width="48"
              height="48"
              style={styles.brandingImage}
            />
          </Section>

          {isSinglePost && posts[0].image && (
            <Section style={styles.heroImageSection}>
              <Img
                src={`${baseUrl}${posts[0].image}`}
                alt={posts[0].title}
                width="560"
                style={styles.heroImage}
              />
            </Section>
          )}

          <Section style={styles.header}>
            <Text style={styles.label}>
              {isSinglePost ? 'NEW POST' : 'NEW POSTS'}
            </Text>
            <Heading as="h1" style={styles.mainTitle}>
              {isSinglePost ? posts[0].title : `${posts.length} Fresh Articles`}
            </Heading>
            {!isSinglePost && (
              <Text style={styles.intro}>
                I&apos;ve published {posts.length} new posts. Here&apos;s
                what&apos;s new:
              </Text>
            )}
          </Section>

          {isSinglePost ? (
            <Section style={styles.singlePost}>
              <Text style={styles.description}>
                {posts[0].description || ''}
              </Text>
              <Button
                href={`${baseUrl}/blog/${posts[0].slug}`}
                style={styles.button}
              >
                Read Article →
              </Button>
            </Section>
          ) : (
            posts.map((post, index) => (
              <Section key={post.slug} style={styles.postItem}>
                {post.image && (
                  <Img
                    src={`${baseUrl}${post.image}`}
                    alt={post.title}
                    width="560"
                    style={styles.postImage}
                  />
                )}
                <Heading as="h2" style={styles.postTitle}>
                  <Link
                    href={`${baseUrl}/blog/${post.slug}`}
                    style={styles.postLink}
                  >
                    {post.title}
                  </Link>
                </Heading>
                {post.description && (
                  <Text style={styles.postDescription}>{post.description}</Text>
                )}
                <Button
                  href={`${baseUrl}/blog/${post.slug}`}
                  style={styles.smallButton}
                >
                  Read Article →
                </Button>
                {index < posts.length - 1 && <Hr style={styles.divider} />}
              </Section>
            ))
          )}

          <Hr style={styles.signatureDivider} />
          <Section style={styles.signature}>
            <Text style={styles.signatureText}>
              {isSinglePost
                ? 'Thanks for reading,'
                : 'Hope you enjoy the reads!'}
            </Text>
            <Text style={styles.signatureName}>
              Dan Goosewin |{' '}
              <Link href="https://x.com/goosewin" style={styles.handleLink}>
                @goosewin
              </Link>
            </Text>
          </Section>

          <Hr style={styles.footerDivider} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              You&apos;re receiving this because you subscribed to Dan
              Goosewin&apos;s blog.
              <br />
              To unsubscribe, reply to this email with &quot;unsubscribe&quot;.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    margin: '0',
    padding: '0',
    fontFamily:
      'Space Grotesk, -apple-system, BlinkMacSystemFont, Arial, sans-serif',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  branding: {
    marginBottom: '24px',
  },
  brandingImage: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
  },
  heroImageSection: {
    marginBottom: '24px',
  },
  heroImage: {
    width: '100%',
    maxWidth: '560px',
    borderRadius: '8px',
    display: 'block',
  },
  header: {
    textAlign: 'left' as const,
    marginBottom: '32px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#666',
    margin: '0 0 8px 0',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '1.3',
    margin: '0 0 16px 0',
    color: '#000',
  },
  intro: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#525252',
    margin: '0 0 32px 0',
  },
  singlePost: {
    marginBottom: '32px',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#525252',
    margin: '0 0 24px 0',
  },
  button: {
    padding: '14px 28px',
    backgroundColor: '#000',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
    borderRadius: '6px',
  },
  postItem: {
    marginBottom: '32px',
  },
  postImage: {
    width: '100%',
    maxWidth: '560px',
    borderRadius: '8px',
    marginBottom: '16px',
    display: 'block',
  },
  postTitle: {
    fontSize: '22px',
    fontWeight: '700',
    lineHeight: '1.3',
    margin: '0 0 12px 0',
    color: '#000',
  },
  postLink: {
    color: '#000',
    textDecoration: 'none',
  },
  postDescription: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#525252',
    margin: '0 0 16px 0',
  },
  smallButton: {
    padding: '10px 20px',
    backgroundColor: '#000',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    borderRadius: '6px',
  },
  divider: {
    borderColor: '#e5e5e5',
    margin: '32px 0',
  },
  signatureDivider: {
    borderColor: '#e5e5e5',
    marginTop: '48px',
  },
  signature: {
    paddingTop: '32px',
  },
  signatureText: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#1a1a1a',
    margin: '0 0 16px 0',
  },
  signatureName: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#1a1a1a',
    margin: '0',
    fontWeight: '600',
  },
  signatureHandle: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#737373',
    margin: '8px 0 0 0',
  },
  handleLink: {
    color: '#737373',
    textDecoration: 'none',
  },
  footerDivider: {
    borderColor: '#e5e5e5',
    marginTop: '48px',
  },
  footer: {
    paddingTop: '24px',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '12px',
    lineHeight: '1.5',
    color: '#999',
    margin: '0',
  },
};
