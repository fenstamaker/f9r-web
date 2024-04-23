"use client";
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Burger,
  Group,
  NavLink,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { EmailSender, Email } from "@repo/jmap";
import Link from "next/link";
import React from "react";

export default function Shell({
  children,
  navbar,
  title,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
  title: string;
}) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={1}>{title}</Title>
        </Group>
      </AppShellHeader>
      {navbar}
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
