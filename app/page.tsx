import Image from "next/image";
import { Flex, Text, Button, Heading, Link } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      minHeight="100vh"
      className="page-background"
    >
      <Flex
        direction="column"
        justify="between"
        align={{ initial: "center", sm: "start" }}
        minHeight="100vh"
        width="100%"
        maxWidth="768px"
        py={{ initial: "8", sm: "8" }}
        px="4"
        className="main-container"
      >
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
          className="logo"
        />
        <Flex
          direction="column"
          align={{ initial: "center", sm: "start" }}
          gap="6"
          className="content-section"
        >
          <Heading
            size={{ initial: "6", sm: "7" }}
            weight="bold"
            className="page-title"
          >
            To get started, edit the page.tsx file.
          </Heading>
          <Text
            size="4"
            color="gray"
            className="page-description"
          >
            Looking for a starting point or more instructions? Head over to{" "}
            <Link
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Templates
            </Link>{" "}
            or the{" "}
            <Link
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Learning
            </Link>{" "}
            center.
          </Text>
        </Flex>
        <Flex
          direction={{ initial: "column", sm: "row" }}
          gap="4"
          className="actions-container"
        >
          <Button
            asChild
            size="3"
            className="deploy-button"
          >
            <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/vercel.svg"
                alt="Vercel logomark"
                width={16}
                height={16}
                className="button-icon"
              />
              Deploy Now
            </a>
          </Button>
          <Button
            asChild
            size="3"
            variant="outline"
            className="docs-button"
          >
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
