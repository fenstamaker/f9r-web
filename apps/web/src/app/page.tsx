import {
  Anchor,
  AppShell,
  AppShellHeader,
  AppShellMain,
  Card,
  Center,
  Group,
  SimpleGrid,
  Title,
  Text,
  CardSection,
  rem,
  Container,
  Flex,
} from "@mantine/core";
import Link from "next/link";
import React from "react";
import { IconNews, IconHome } from "@tabler/icons-react";

export default function Page() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader>
        <Group h="100%" px="md">
          <Title order={1}>web.f9r.dev</Title>
        </Group>
      </AppShellHeader>
      <AppShellMain>
        <Container>
          <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }}>
            <Anchor component={Link} href="/newsletters">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Flex align="center" justify="center">
                  <IconNews
                    style={{ width: rem(80), height: rem(80) }}
                    stroke={1.5}
                    color="var(--mantine-color-blue-filled)"
                  />
                </Flex>
                <Text fw={500} style={{ textAlign: "center" }}>
                  newsletters
                </Text>
              </Card>
            </Anchor>

            <Anchor component={Link} href="/home">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Flex align="center" justify="center">
                  <IconHome
                    style={{ width: rem(80), height: rem(80) }}
                    stroke={1.5}
                    color="var(--mantine-color-yellow-filled)"
                  />
                </Flex>
                <Text fw={500} style={{ textAlign: "center" }}>
                  home
                </Text>
              </Card>
            </Anchor>
          </SimpleGrid>
        </Container>
      </AppShellMain>
    </AppShell>
  );
}
