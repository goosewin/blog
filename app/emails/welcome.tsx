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

interface WelcomeEmailProps {
  baseUrl: string;
}

export default function WelcomeEmail({ baseUrl }: WelcomeEmailProps) {
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
      <Preview>Welcome to Dan Goosewin&apos;s blog newsletter</Preview>
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

          <Section style={styles.header}>
            <Heading as="h1" style={styles.mainTitle}>
              Thanks for subscribing!
            </Heading>
            <Text style={styles.intro}>Howdy,</Text>
            <Text style={styles.description}>
              Thanks for subscribing to my blog! I&apos;m excited to share my
              thoughts on technology, business, entrepreneurship and more with
              you.
            </Text>
            <Text style={styles.description}>
              You&apos;ll get notified whenever I publish new posts. In the
              meantime, feel free to check out my latest articles.
            </Text>
          </Section>

          <Section style={styles.ctaSection}>
            <Button href={`${baseUrl}/blog`} style={styles.button}>
              Read My Latest Posts →
            </Button>
          </Section>

          <Hr style={styles.signatureDivider} />
          <Section style={styles.signature}>
            <Text style={styles.signatureText}>Best,</Text>
            <Text style={styles.signatureName}>
              Dan Goosewin |{' '}
              <Link href="https://x.com/dan_goosewin" style={styles.handleLink}>
                @dan_goosewin
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
  header: {
    textAlign: 'left' as const,
    marginBottom: '32px',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '1.3',
    margin: '0 0 24px 0',
    color: '#000',
  },
  intro: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#1a1a1a',
    margin: '0 0 16px 0',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#525252',
    margin: '0 0 16px 0',
  },
  ctaSection: {
    marginBottom: '32px',
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
