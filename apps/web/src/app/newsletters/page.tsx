import MailingList from "@/components/MailingList";
import MailingListNewsletters from "@/components/MailingListNewsletters";

import Shell from "@/components/Shell";
import { getMailingLists, getNewsletters } from "@/fastmail";
import { Title } from "@mantine/core";
import _ from "lodash";
import { unstable_noStore } from "next/cache";
import React from "react";

export const metadata = {
  title: "newsletters",
};

export default async function Page({
  params,
}: {
  params: { email: string };
}): Promise<React.ReactNode> {
  unstable_noStore();
  const mailingLists = await getMailingLists();
  const selected = mailingLists[0];
  if (!selected) {
    return <></>;
  }

  return (
    <Shell navbar={<MailingList selectedId={selected.id} />}>
      {selected && (
        <>
          <Title order={1}>{selected?.name}</Title>
          <MailingListNewsletters mailingList={selected} />
        </>
      )}
    </Shell>
  );
}
