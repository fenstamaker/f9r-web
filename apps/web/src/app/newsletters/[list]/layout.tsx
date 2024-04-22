import Shell from "@/components/Shell";
import { getNewsletters } from "@/fastmail";
import _ from "lodash";
import React from "react";

export default async function Layout({
  params,
  children,
}: {
  params: { list: string };
  children: React.ReactNode;
}): Promise<React.ReactNode> {
  const email = decodeURIComponent(params.list);
  const newsletters = await getNewsletters();
  const lists = _.uniqBy(newsletters.map((n) => n.from).flat(), "email");
  const selected = lists.find((l) => l.email === email);

  return (
    <Shell lists={lists} newsletters={newsletters} selected={selected}>
      {children}
    </Shell>
  );
}
