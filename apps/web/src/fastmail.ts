import Jmap from "@repo/jmap";
import { cache } from "react";
import "server-only";

const JMAP = new Jmap({
  authHost: process.env.JMAP_AUTH_HOST ?? "",
  authToken: process.env.JMAP_AUTH_TOKEN ?? "",
});

export const getMailingLists = async () => {
  return JMAP.getMailingLists();
};

export const getMailingListNewsletters = async (mailingListId: string) => {
  return JMAP.listEmailsInBox(mailingListId);
};

export const getMailingList = async (mailingListId: string) => {
  return JMAP.getMailingList(mailingListId);
};

export const getNewsletters = async () => {
  return JMAP.getNewsletters();
};

export const getNewsletter = cache(async (id: string) => {
  return JMAP.getEmail(id);
});
