interface Session {
  apiUrl: string;
  primaryAccounts: {
    "urn:ietf:params:jmap:mail": string;
    [key: string]: string;
  };
}

export interface Email {
  id: string;
  subject: string;
  receivedAt: string;
  from: EmailSender[];
}

export interface HydratedEmail extends Email {
  text: string;
  html?: string | null;
}

export interface EmailSender {
  email: string;
  name: string;
}

export interface MailingList {
  id: string;
  name: string;
  totalEmails: number;
}

export default class Jmap {
  authHost: string;
  authToken: string;

  authUrl: string;
  headers: { "Content-Type": string; Authorization: string };

  session: Session | null = null;

  constructor(params: { authHost: string; authToken: string }) {
    this.authHost = params.authHost;
    this.authToken = params.authToken;

    this.authUrl = `https://${this.authHost}/.well-known/jmap`;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  async getSession(): Promise<Session> {
    const response = await fetch(this.authUrl, {
      method: "GET",
      headers: this.headers,
    });

    return response.json();
  }

  async _query(bodyFn: (accountId: string) => any) {
    const session = await this.getSession();
    const apiUrl = session.apiUrl;
    const accountId = session.primaryAccounts["urn:ietf:params:jmap:mail"];

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(bodyFn(accountId)),
    });

    return response.json();
  }

  async getEmail(emailId: string): Promise<HydratedEmail> {
    const results = await this._query((accountId) => ({
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      methodCalls: [
        [
          "Email/get",
          {
            accountId,
            properties: ["id", "subject", "receivedAt", "bodyValues", "from"],
            fetchAllBodyValues: true,
            ids: [emailId],
          },
          "b",
        ],
      ],
    }));

    const nl = results.methodResponses[0][1].list[0];

    return {
      id: nl.id,
      subject: nl.subject,
      receivedAt: nl.receivedAt,
      text: nl.bodyValues["1"]?.value ?? "",
      html: nl.bodyValues["2"]?.value ?? null,
      from: nl.from,
    };
  }

  async getMailingList(mailboxId: string): Promise<MailingList> {
    const results = await this._query((accountId) => ({
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      methodCalls: [
        [
          "Mailbox/get",
          {
            accountId,
            ids: [mailboxId],
          },
          "0",
        ],
      ],
    }));

    return results.methodResponses[0][1].list[0];
  }

  async getMailingLists(): Promise<MailingList[]> {
    const newsletterBox = await this.getNewsletterBox();
    const results = await this._query((accountId) => ({
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      methodCalls: [
        [
          "Mailbox/query",
          {
            accountId,
            filter: { parentId: newsletterBox },
          },
          "0",
        ],
        [
          "Mailbox/get",
          {
            accountId,
            "#ids": {
              resultOf: "0",
              path: "/ids",
              name: "Mailbox/query",
            },
          },
          "1",
        ],
      ],
    }));

    return results.methodResponses[1][1].list;
  }

  async listEmailsInBox(boxId: string, limit: number = 25) {
    const results = await this._query((accountId) => ({
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      methodCalls: [
        [
          "Email/query",
          {
            accountId,
            filter: { inMailbox: boxId },
            sort: [{ property: "receivedAt", isAscending: false }],
            limit,
          },
          "a",
        ],
        [
          "Email/get",
          {
            accountId,
            properties: ["id", "subject", "receivedAt", "from"],
            "#ids": {
              resultOf: "a",
              name: "Email/query",
              path: "/ids/*",
            },
          },
          "b",
        ],
      ],
    }));

    const rawNewsletters = results.methodResponses[1][1].list;

    const newsletters: Email[] = [];

    for (const nl of rawNewsletters) {
      const newsletter: Email = {
        id: nl.id,
        subject: nl.subject,
        receivedAt: nl.receivedAt,
        from: nl.from,
      };

      newsletters.push(newsletter);
    }

    return newsletters;
  }

  async getNewsletterBox(): Promise<string | null> {
    const results = await this._query((accountId) => ({
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      methodCalls: [
        [
          "Mailbox/query",
          {
            accountId,
            filter: { name: "Newsletters" },
          },
          "0",
        ],
      ],
    }));

    const ids = results.methodResponses[0][1]?.ids ?? [];
    if (ids && ids.length > 0) {
      return ids[0];
    }

    return null;
  }

  async getNewsletters(): Promise<Email[]> {
    const boxId = await this.getNewsletterBox();

    if (boxId) {
      return this.listEmailsInBox(boxId);
    }

    throw new Error(`No newsletter box found`);
  }
}

// getNewsletters().then(console.log).catch(console.error);
