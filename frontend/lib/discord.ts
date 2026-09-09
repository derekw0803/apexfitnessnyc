/**
 * Server-only Discord webhook notifier for new contact-form leads.
 *
 * Phase 1 of the contact-notification rollout — posts to a private Discord
 * channel. Phase 2 will replace this with SMTP2GO email notifications; kept
 * as a standalone module (rather than inlined in the route) so that swap is
 * a small, contained change.
 */

type ContactLead = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export async function notifyDiscord(lead: ContactLead): Promise<void> {
  const webhookUrl = process.env.DISCORD_CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error(
      'DISCORD_CONTACT_WEBHOOK_URL is not set. Add it in Vercel → Settings → Environment Variables.'
    );
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [
        {
          title: 'New contact form lead',
          color: 0xc8a84b, // matches --gold from the site's palette
          fields: [
            { name: 'Name', value: `${lead.firstName} ${lead.lastName}`, inline: true },
            { name: 'Email', value: lead.email, inline: true },
            { name: 'Phone', value: lead.phone || '(not provided)', inline: true },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Discord webhook responded ${res.status}: ${await res.text()}`);
  }
}
