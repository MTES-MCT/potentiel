'use client';

import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';
import { TypeGarantiesFinancièresSelectProps } from '../../TypeGarantiesFinancièresSelect';
import { FormulaireGarantiesFinancières } from '../../FormulaireGarantiesFinancières';

import { enregistrerGarantiesFinancièresAction } from './enregistrerGarantiesFinancières.action';

export type EnregistrerGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
};

export const EnregistrerGarantiesFinancièresPage: FC<EnregistrerGarantiesFinancièresProps> = ({
  projet,
  typesGarantiesFinancières,
}) => (
  <PageTemplate banner={<ProjetBanner {...projet} />}>
    <TitrePageGarantiesFinancières title="Enregistrer des garanties financières" />

    <FormulaireGarantiesFinancières
      identifiantProjet={projet.identifiantProjet}
      action={enregistrerGarantiesFinancièresAction}
      submitButtonLabel="Enregistrer"
      typesGarantiesFinancières={typesGarantiesFinancières}
    />
  </PageTemplate>
);
