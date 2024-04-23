import { getMailingListNewsletters } from "@/fastmail";
import { NavLink, Stack } from "@mantine/core";
import { EmailSender, Email, MailingList } from "@repo/jmap";
import Link from "next/link";
import React from "react";

export default async function MailingListNewsletters({
  mailingList,
}: {
  mailingList: MailingList;
}) {
  const newsletters = await getMailingListNewsletters(mailingList.id);

  return (
    <Stack gap="xs">
      {newsletters.map((nl) => (
        <NavLink
          w="100%"
          component={Link}
          href={`/newsletters/${mailingList.id}/${nl.id}`}
          label={nl.subject}
        />
      ))}
    </Stack>
  );
}
