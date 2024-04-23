import MailingList from "@/components/MailingList";
import Shell from "@/components/Shell";
import { getMailingLists, getNewsletters } from "@/fastmail";
import _ from "lodash";
import React from "react";

export const metadata = {
  title: "newsletters",
};

export const revalidate = 1800;

export default async function Layout({
  params,
  children,
}: {
  params: { ids?: string[] };
  children: React.ReactNode;
}): Promise<React.ReactNode> {
  let selectedListId: string;

  if (params.ids && params.ids[0]) {
    selectedListId = decodeURIComponent(params.ids[0]);
  } else {
    const mailingLists = await getMailingLists();
    selectedListId = mailingLists[0]?.id ?? "";
  }

  return (
    <Shell
      title="newsletters"
      navbar={<MailingList selectedId={selectedListId} />}
    >
      {children}
    </Shell>
  );
}
