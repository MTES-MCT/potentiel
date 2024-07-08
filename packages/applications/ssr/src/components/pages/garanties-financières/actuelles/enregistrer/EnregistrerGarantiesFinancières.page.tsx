import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';
import { TypeGarantiesFinancièresSelectProps } from '../../TypeGarantiesFinancièresSelect';
import { FormulaireGarantiesFinancières } from '../../FormulaireGarantiesFinancières';

import { enregistrerGarantiesFinancièresAction } from './enregistrerGarantiesFinancières.action';

export type EnregistrerGarantiesFinancièresProps = {
  identifiantProjet: string;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
};

export const EnregistrerGarantiesFinancièresPage: FC<EnregistrerGarantiesFinancièresProps> = ({
  identifiantProjet,
  typesGarantiesFinancières,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageGarantiesFinancières title="Enregistrer des garanties financières" />

    <FormulaireGarantiesFinancières
      identifiantProjet={identifiantProjet}
      action={enregistrerGarantiesFinancièresAction}
      submitButtonLabel="Enregistrer"
      typesGarantiesFinancières={typesGarantiesFinancières}
    />
  </PageTemplate>
);
