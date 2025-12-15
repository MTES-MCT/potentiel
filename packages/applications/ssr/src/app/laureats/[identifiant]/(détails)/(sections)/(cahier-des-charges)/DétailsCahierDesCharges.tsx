import Notice from '@codegouvfr/react-dsfr/Notice';
import Link from 'next/link';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { ChampObligatoireAvecAction } from '../../../_helpers/types';

export type CahierDesChargesProps = ChampObligatoireAvecAction<
  | {
      estInitial: true;
      estAlternatif: false;
      doitChoisirUnCahierDesChargesModificatif: boolean;
      cahierDesChargesURL: string;
      estSoumisAuxGarantiesFinancières: boolean;
    }
  | {
      estInitial: false;
      estAlternatif: boolean;
      doitChoisirUnCahierDesChargesModificatif: false;
      dateParution: AppelOffre.CahierDesChargesModifié['paruLe'];
      cahierDesChargesURL: string;
      estSoumisAuxGarantiesFinancières: boolean;
    }
>;

export const DétailsCahierDesCharges = ({ value, action }: CahierDesChargesProps) =>
  value && (
    <>
      <div>
        Instruction selon le cahier des charges{' '}
        {value.estInitial
          ? 'initial (en vigueur à la candidature)'
          : `${
              value.estAlternatif ? 'alternatif' : ''
            } modifié rétroactivement et publié le ${value.dateParution}`}
        {', '}
        <Link target="_blank" className="w-fit" href={value.cahierDesChargesURL}>
          voir le cahier des charges
        </Link>
      </div>
      {value.doitChoisirUnCahierDesChargesModificatif && (
        <Notice
          description="Votre cahier des charges actuel ne vous permet pas d'accéder aux fonctionnalités
       dématérialisées d'information au Préfet et de modification de votre projet (abandon...), vous devez d'abord choisir un cahier des charges"
          title="Modification de votre projet"
          severity="warning"
        />
      )}
      {action && <TertiaryLink href={action.url}> {action.label}</TertiaryLink>}
    </>
  );
