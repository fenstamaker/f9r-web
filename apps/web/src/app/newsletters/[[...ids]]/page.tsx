import MailingListNewsletters from "@/components/MailingListNewsletters";
import Newsletter from "@/components/Newsletter";
import { getMailingList, getMailingLists, getNewsletter } from "@/fastmail";
import { Center, Loader, Title } from "@mantine/core";
import { HydratedEmail, MailingList } from "@repo/jmap";
import React, { Suspense } from "react";

export const metadata = {
  title: "newsletters",
};

export default async function Page({
  params,
}: {
  params: { ids?: string[] };
}): Promise<React.ReactNode> {
  let selectedList: MailingList | undefined;
  let selectedEmail: HydratedEmail | undefined;

  if (params.ids && params.ids[0]) {
    selectedList = await getMailingList(params.ids[0]);
  } else {
    const mailingLists = await getMailingLists();
    selectedList = mailingLists[0];
  }

  if (params.ids && params.ids.length > 1 && params.ids[1]) {
    selectedEmail = await getNewsletter(params.ids[1]);
  }

  if (!selectedList) {
    return <></>;
  }

  if (selectedEmail) {
    return (
      <Suspense
        fallback={
          <Center mt="md">
            <Loader color="blue" />
          </Center>
        }
      >
        <Newsletter html={selectedEmail.html ?? selectedEmail.text} />
      </Suspense>
    );
  }

  return (
    <>
      <Title order={1}>{selectedList?.name}</Title>
      <MailingListNewsletters mailingList={selectedList} />
    </>
  );
}
