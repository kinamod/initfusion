import { Container, Section, Flex, Grid, Card, Heading, Text, Link, Box } from "@radix-ui/themes";
import Image from "next/image";
import NextLink from "next/link";
import { MapPin, Route, Car as CarIcon, BarChart3, MessageCircle, CreditCard, Wrench, TrendingUp } from "lucide-react";

export default function Home() {
  const tools = [
    {
      title: "Parking Zone Manager",
      description: "Create and manage parking zones with interactive map and tariff configuration",
      icon: MapPin,
      href: "/fleet-management",
      brand: "parkopedia",
      brandColor: "#0A0944",
      accentColor: "#02FF7F"
    },
    {
      title: "Route Optimization",
      description: "Optimize routes for efficient mobility solutions",
      icon: Route,
      href: "/route-optimization"
    },
    {
      title: "Parking Enforcement",
      description: "Track vehicles, manage tickets, and identify parking violations in real-time",
      icon: CarIcon,
      href: "/driver-portal",
      brand: "ringgo",
      brandColor: "#7B3F8F",
      accentColor: "#FF4B9D"
    },
    {
      title: "Analytics Dashboard",
      description: "Real-time analytics and reporting for mobility insights",
      icon: BarChart3,
      href: "/analytics"
    },
    {
      title: "Customer Service",
      description: "Manage customer inquiries and support tickets",
      icon: MessageCircle,
      href: "/customer-service"
    },
    {
      title: "Billing & Payments",
      description: "Handle invoicing, payments, and financial records",
      icon: CreditCard,
      href: "/billing"
    },
    {
      title: "Maintenance Scheduler",
      description: "Schedule and track vehicle maintenance operations",
      icon: Wrench,
      href: "/maintenance"
    },
    {
      title: "Reporting Tools",
      description: "Generate custom reports and export data",
      icon: TrendingUp,
      href: "/reporting"
    }
  ];

  return (
    <Box className="page-wrapper">
      <Box className="header-wrapper">
        <Container size="4">
          <Flex align="center" gap="3" className="logo-container">
            <NextLink href="/">
              <Image
                src="https://a.storyblok.com/f/333594/109x31/6532cf8b92/logo_main_menu.svg"
                alt="Arrive Mobility Solutions"
                width={109}
                height={31}
                priority
                className="arrive-logo"
                style={{ cursor: 'pointer' }}
              />
            </NextLink>
          </Flex>
        </Container>
      </Box>

      <Section size="3">
        <Container size="4">
          <Flex direction="column" gap="6">
            <Box style={{ textAlign: "center" }}>
              <Heading as="h2" size="8" mb="2">
                Consolidated Internal Tools
              </Heading>
              <Text size="4" color="gray">
                Access all your Arrive mobility management tools in one place
              </Text>
            </Box>

            <Grid columns={{ initial: "1", sm: "2", md: "3", lg: "4" }} gap="4">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                const hasBrand = tool.brand;

                return (
                  <Link
                    key={tool.title}
                    href={tool.href}
                    className="tool-link"
                    style={!hasBrand ? {
                      opacity: 0.5,
                      filter: 'grayscale(1)',
                      cursor: 'not-allowed',
                      pointerEvents: 'none'
                    } : {}}
                  >
                    <Card
                      className="tool-card"
                      style={hasBrand ? {
                        borderTop: `3px solid ${tool.accentColor}`,
                        position: 'relative'
                      } : {}}
                    >
                      <Flex direction="column" gap="3">
                        <Box
                          className="tool-icon-wrapper"
                          style={hasBrand ? {
                            color: tool.brandColor
                          } : {}}
                        >
                          <IconComponent size={32} strokeWidth={1.5} />
                        </Box>
                        <Heading
                          as="h3"
                          size="5"
                          style={hasBrand ? {
                            color: tool.brandColor
                          } : {}}
                        >
                          {tool.title}
                        </Heading>
                        <Text size="2" color="gray">
                          {tool.description}
                        </Text>
                        <Text
                          size="4"
                          className="tool-arrow"
                          style={hasBrand ? {
                            color: tool.accentColor
                          } : {}}
                        >
                          →
                        </Text>
                      </Flex>
                    </Card>
                  </Link>
                );
              })}
            </Grid>
          </Flex>
        </Container>
      </Section>
    </Box>
  );
}
