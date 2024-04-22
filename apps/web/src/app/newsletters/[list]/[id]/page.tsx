import Newsletter from "@/components/Newsletter";
import { getNewsletter } from "@/fastmail";
import { Center, Loader } from "@mantine/core";
import React, { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: { id: string };
}): Promise<React.ReactNode> {
  const newsletter = await getNewsletter(params.id);

  return (
    <Suspense
      fallback={
        <Center mt="md">
          <Loader color="blue" />
        </Center>
      }
    >
      <Newsletter html={newsletter.html ?? newsletter.text} />
    </Suspense>
  );
}
