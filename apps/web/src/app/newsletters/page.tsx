import NewsletterList from "@/components/NewsletterList";
import Shell from "@/components/Shell";
import { getNewsletters } from "@/fastmail";
import { Title } from "@mantine/core";
import _ from "lodash";
import React from "react";

export default async function Page({
  params,
}: {
  params: { email: string };
}): Promise<React.ReactNode> {
  const newsletters = await getNewsletters();
  const lists = _.uniqBy(newsletters.map((n) => n.from).flat(), "email");
  const selected = lists[0];

  return (
    <Shell lists={lists} newsletters={newsletters} selected={selected}>
      {selected && (
        <>
          <Title order={1}>{selected?.name}</Title>
          <NewsletterList selected={selected} newsletters={newsletters} />
        </>
      )}
    </Shell>
  );
}
