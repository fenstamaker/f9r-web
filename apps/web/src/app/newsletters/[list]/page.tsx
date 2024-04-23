import MailingListNewsletters from "@/components/MailingListNewsletters";

import { getMailingList, getMailingLists, getNewsletters } from "@/fastmail";
import { Title } from "@mantine/core";
import _ from "lodash";
import { unstable_noStore } from "next/cache";
import React from "react";

export default async function Page({
  params,
}: {
  params: { list: string };
}): Promise<React.ReactNode> {
  const mailingList = await getMailingList(params.list);

  return (
    <>
      <Title order={1}>{mailingList.name}</Title>
      <MailingListNewsletters mailingList={mailingList} />
    </>
  );
}
