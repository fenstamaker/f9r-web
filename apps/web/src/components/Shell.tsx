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
import { MailingList, Newsletter } from "@repo/jmap";
import Link from "next/link";
import React from "react";

export default function Shell({
  lists,
  newsletters,
  children,
  selected,
}: {
  lists: MailingList[];
  newsletters: Newsletter[];
  children: React.ReactNode;
  selected?: MailingList;
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
          <Title order={1}>newsletters</Title>
        </Group>
      </AppShellHeader>
      <AppShell.Navbar>
        {lists.map((list) => (
          <NavLink
            component={Link}
            label={list.name}
            href={`/newsletters/${list.email}`}
            active={list.email === selected?.email}
          />
        ))}
      </AppShell.Navbar>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
