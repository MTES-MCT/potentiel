'use client';

import { FC } from 'react';
import Link from 'next/link';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';

import { DémarrerInstructionDemandeMainlevéeGarantiesFinancières } from './DémarrerInstructionDemandeMainlevéeGarantiesFinancières';

export type InstruireDemandeMainlevéeGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  mainlevée: { statut: string };
  urlAppelOffre: string;
};

export const InstruireDemandeMainlevéeGarantiesFinancières: FC<
  InstruireDemandeMainlevéeGarantiesFinancièresProps
> = ({ projet, mainlevée: { statut }, urlAppelOffre }) => {
  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <TitrePageGarantiesFinancières title="Instruire une demande mainlevée des garanties financières" />
      <Alert
        description={
          <span>
            Vous pouvez consulter l'appel d'offres du projet en accédant à{' '}
            <Link href={urlAppelOffre} target="_blank">
              cette page de la CRE
            </Link>
          </span>
        }
        severity="info"
        small
        className="mb-4"
      />
      {GarantiesFinancières.StatutMainlevéeGarantiesFinancières.convertirEnValueType(
        statut,
      ).estDemandé() && (
        <DémarrerInstructionDemandeMainlevéeGarantiesFinancières
          identifiantProjet={projet.identifiantProjet}
        />
      )}
    </PageTemplate>
  );
};
