import NewsletterList from "@/components/NewsletterList";
import { getNewsletters } from "@/fastmail";
import { Title } from "@mantine/core";
import _ from "lodash";
import React from "react";

export default async function Page({
  params,
}: {
  params: { list: string };
}): Promise<React.ReactNode> {
  const email = decodeURIComponent(params.list);
  const newsletters = await getNewsletters();
  const lists = _.uniqBy(newsletters.map((n) => n.from).flat(), "email");
  const selected = lists.find((l) => l.email === email);

  return (
    <>
      <Title order={1}>{selected?.name}</Title>
      {selected && (
        <NewsletterList selected={selected} newsletters={newsletters} />
      )}
    </>
  );
}
