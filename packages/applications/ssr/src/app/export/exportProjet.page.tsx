import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';

import { ExportProjetForm } from './exportProjet.form';

export const ExportProjetPage: FC = () => (
  <PageTemplate banner={<Heading1>Exporter des données projets</Heading1>}>
    <p>
      Cette page permet d'exporter les données des projets, vous devez tout d'abord sélectionner le
      type d'export désiré
    </p>
    <ExportProjetForm />
  </PageTemplate>
);
