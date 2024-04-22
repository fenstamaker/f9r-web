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
  from: MailingList[];
}

export interface HydratedEmail extends Email {
  text: string;
  html?: string | null;
}

export interface MailingList {
  email: string;
  name: string;
}

export default class Jmap {
  authHost: string;
  authToken: string;

  authUrl: string;
  headers: { "Content-Type": string; Authorization: string };

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

  async getEmail(emailId: string): Promise<HydratedEmail> {
    const session = await this.getSession();
    const apiUrl = session.apiUrl;
    const accountId = session.primaryAccounts["urn:ietf:params:jmap:mail"];

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
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
      }),
    });

    const results = await response.json();

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

  async listEmailsInBox(boxId: string, limit: number = 25) {
    const session = await this.getSession();
    const apiUrl = session.apiUrl;
    const accountId = session.primaryAccounts["urn:ietf:params:jmap:mail"];

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
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
      }),
    });

    const results = await response.json();

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
    const session = await this.getSession();
    const apiUrl = session.apiUrl;
    const accountId = session.primaryAccounts["urn:ietf:params:jmap:mail"];

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
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
      }),
    });

    const results = await response.json();

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
