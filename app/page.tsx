import { Container, Section, Flex, Grid, Card, Heading, Text, Link, Box } from "@radix-ui/themes";
import Image from "next/image";

export default function Home() {
  const tools = [
    {
      title: "Fleet Management",
      description: "Monitor and manage vehicle fleet operations in real-time",
      icon: "🚗",
      href: "/fleet-management"
    },
    {
      title: "Route Optimization",
      description: "Optimize routes for efficient mobility solutions",
      icon: "🗺️",
      href: "/route-optimization"
    },
    {
      title: "Driver Portal",
      description: "Driver onboarding, scheduling, and performance tracking",
      icon: "👤",
      href: "/driver-portal"
    },
    {
      title: "Analytics Dashboard",
      description: "Real-time analytics and reporting for mobility insights",
      icon: "📊",
      href: "/analytics"
    },
    {
      title: "Customer Service",
      description: "Manage customer inquiries and support tickets",
      icon: "💬",
      href: "/customer-service"
    },
    {
      title: "Billing & Payments",
      description: "Handle invoicing, payments, and financial records",
      icon: "💳",
      href: "/billing"
    },
    {
      title: "Maintenance Scheduler",
      description: "Schedule and track vehicle maintenance operations",
      icon: "🔧",
      href: "/maintenance"
    },
    {
      title: "Reporting Tools",
      description: "Generate custom reports and export data",
      icon: "📈",
      href: "/reporting"
    }
  ];

  return (
    <Box className="page-wrapper">
      <Box className="header-wrapper">
        <Container size="4">
          <Flex align="center" gap="3" className="logo-container">
            <Image
              src="https://a.storyblok.com/f/333594/109x31/6532cf8b92/logo_main_menu.svg"
              alt="Arrive Mobility Solutions"
              width={109}
              height={31}
              priority
              className="arrive-logo"
            />
          </Flex>
        </Container>
      </Box>

      <Section size="3">
        <Container size="4">
          <Flex direction="column" gap="6">
            <Box style={{ textAlign: "center" }}>
              <Heading as="h2" size="8" mb="2">
                Internal Tools
              </Heading>
              <Text size="4" color="gray">
                Access all your Arrive mobility management tools in one place
              </Text>
            </Box>

            <Grid columns={{ initial: "1", sm: "2", md: "3", lg: "4" }} gap="4">
              {tools.map((tool) => (
                <Link key={tool.title} href={tool.href} className="tool-link">
                  <Card className="tool-card">
                    <Flex direction="column" gap="3">
                      <Box className="tool-icon-wrapper">
                        <Text size="8">{tool.icon}</Text>
                      </Box>
                      <Heading as="h3" size="5">
                        {tool.title}
                      </Heading>
                      <Text size="2" color="gray">
                        {tool.description}
                      </Text>
                      <Text size="4" className="tool-arrow">
                        →
                      </Text>
                    </Flex>
                  </Card>
                </Link>
              ))}
            </Grid>
          </Flex>
        </Container>
      </Section>
    </Box>
  );
}
