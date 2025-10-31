import { Flex, Container, Heading, Text, Section } from "@radix-ui/themes";
import { FigmaHeader } from '@/components/FigmaHeader';

export default function Home() {
  return (
    <main>
      <Section py="9">
        <Container>
          <FigmaHeader />
          <Flex direction="column" gap="6">
            <div>
              <Heading as="h1" size="8" mb="2">
                Welcome to Saint-Gobain
              </Heading>
              <Text as="p" size="4" color="gray">
                Building the future of sustainable construction. This page includes the new header with navigation dropdowns and theme switching.
              </Text>
            </div>

            <div style={{ backgroundColor: 'var(--background)', border: '1px solid rgba(0,0,0,0.1)', padding: '20px', borderRadius: '8px' }}>
              <Heading as="h2" size="6" mb="3">
                Header Features
              </Heading>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
                <li><Text>Expandable navigation dropdowns (hover or click to expand)</Text></li>
                <li><Text>Dark/Light theme toggle in the top right</Text></li>
                <li><Text>Stock price display (placeholder data)</Text></li>
                <li><Text>Language switcher (placeholder, to be completed)</Text></li>
                <li><Text>Search functionality (placeholder)</Text></li>
                <li><Text>Responsive design for mobile and desktop</Text></li>
              </ul>
            </div>

            <div style={{ backgroundColor: 'var(--background)', border: '1px solid rgba(0,0,0,0.1)', padding: '20px', borderRadius: '8px' }}>
              <Heading as="h2" size="6" mb="3">
                Next Steps
              </Heading>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', gap: '8px', display: 'flex', flexDirection: 'column' }}>
                <li><Text>Customize the stock price data with real API calls</Text></li>
                <li><Text>Implement language switcher functionality</Text></li>
                <li><Text>Add search functionality</Text></li>
                <li><Text>Refine styling to match Saint-Gobain brand guidelines</Text></li>
              </ul>
            </div>
          </Flex>
        </Container>
      </Section>
    </main>
  );
}
