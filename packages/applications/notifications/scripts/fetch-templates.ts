#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises';

import { flatten } from 'flat';

const allTemplates = {
  // abandon: abandonNotificationTemplateId,
};

/**
 * Script temporaire pour récupérer les templates Mailjet et les stocker en local
 */
const main = async () => {
  const { MJ_APIKEY_PUBLIC = '', MJ_APIKEY_PRIVATE = '' } = process.env;

  for (const [domain, domainTemplates] of Object.entries(allTemplates)) {
    const templates = flatten(domainTemplates) as Record<string, number>;

    const dirName = `src/templates/emails/${domain}`;
    await mkdir(dirName, { recursive: true });

    for (const [key, id] of Object.entries(templates)) {
      const response = await fetch(`https://api.mailjet.com/v3/REST/template/${id}/detailcontent`, {
        method: 'GET',
        headers: {
          Authorization:
            'Basic ' + Buffer.from(MJ_APIKEY_PUBLIC + ':' + MJ_APIKEY_PRIVATE).toString('base64'),
          'Content-Type': 'application/json',
        },
      });
      const data = (await response.json()) as {
        Data: { ['Text-part']: string; MJMLContent: string }[];
      };

      const content = data.Data[0]['Text-part'];
      const index = content.indexOf("<<Besoin d'aide ?");

      const cleanContent = content
        .slice(0, index)
        .trim()
        .replaceAll(/{{var:(.+?)(?::"")?}}/g, '{{ $1 }}')
        .replaceAll(/^<<(.*)>>\W?\[{{ (.+?) }}\].*$/gm, "{{ cta $2 '$1' }}");

      const template: string[] = [];
      template.push('---');
      template.push(`subject: Potentiel - {{ REPLACE_ME }}`);
      template.push('---');
      template.push('');
      template.push(cleanContent);

      await writeFile(`${dirName}/${key.replaceAll('.', '_')}.md`, template.join('\n'));
    }
  }
};

await main();
