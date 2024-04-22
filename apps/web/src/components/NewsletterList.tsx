import { NavLink, Stack } from "@mantine/core";
import { MailingList, Email } from "@repo/jmap";
import Link from "next/link";
import React from "react";

export default function NewsletterList({
  selected,
  newsletters,
}: {
  selected: MailingList;
  newsletters: Email[];
}) {
  return (
    <Stack gap="xs">
      {newsletters
        .filter((nl) => nl.from[0]?.email === selected.email)
        .map((nl) => (
          <NavLink
            w="100%"
            component={Link}
            href={`/newsletters/${selected.email}/${nl.id}`}
            label={nl.subject}
          />
        ))}
    </Stack>
  );
}
