import { FC } from 'react';

import { Form } from '@/components/atoms/form/Form';

import { exportProjetAction } from './exportProjet.action';

export const ExportProjetForm: FC = () => (
  <Form
    action={exportProjetAction}
    actionButtons={{
      submitLabel: 'Exporter les données de raccordement',
    }}
  >
    <input type="hidden" name="typeExport" value="raccordement" />
  </Form>
);
