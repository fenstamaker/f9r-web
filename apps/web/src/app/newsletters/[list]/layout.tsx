import MailingList from "@/components/MailingList";
import Shell from "@/components/Shell";
import { getNewsletters } from "@/fastmail";
import _ from "lodash";
import React from "react";

export const metadata = {
  title: "newsletters",
};

export default async function Layout({
  params,
  children,
}: {
  params: { list: string };
  children: React.ReactNode;
}): Promise<React.ReactNode> {
  const listId = decodeURIComponent(params.list);

  return <Shell navbar={<MailingList selectedId={listId} />}>{children}</Shell>;
}
