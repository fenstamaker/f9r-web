import { getMailingLists } from "@/fastmail";
import { AppShellNavbar, NavLink, Stack } from "@mantine/core";
import Link from "next/link";
import React from "react";

export default async function MailingList({
  selectedId,
}: {
  selectedId: string;
}) {
  const mailingLists = await getMailingLists();

  return (
    <AppShellNavbar>
      {mailingLists.map((list) => (
        <NavLink
          component={Link}
          label={list.name}
          href={`/newsletters/${list.id}`}
          active={list.id === selectedId}
        />
      ))}
    </AppShellNavbar>
  );
}
