import Notice from '@codegouvfr/react-dsfr/Notice';

import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import type { ChampAvecAction } from '../../_helpers';

export type CahierDesChargesDétailsProps = ChampAvecAction<
  PlainType<Lauréat.ConsulterCahierDesChargesReadModel> & {
    doitChoisirUnCahierDesChargesModificatif: boolean;
  }
>;

export const CahierDesChargesDétails = ({ value, action }: CahierDesChargesDétailsProps) =>
  value && (
    <>
      <div>
        Instruction selon le cahier des charges{' '}
        <strong>
          {!value.cahierDesChargesModificatif
            ? 'initial (en vigueur à la candidature)'
            : `${
                value.cahierDesChargesModificatif.alternatif ? 'alternatif' : ''
              } modifié rétroactivement et publié le ${value.cahierDesChargesModificatif.paruLe}`}
        </strong>
        .
      </div>
      <div>
        Appel d'offre {value.appelOffre.title}, {value.période.title} période
        {value.famille && <>, famille {value.famille?.title}</>}.
      </div>
      <TertiaryLink
        href={value.appelOffre.cahiersDesChargesUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Voir le cahier des charges
      </TertiaryLink>
      {value.doitChoisirUnCahierDesChargesModificatif && (
        <Notice
          description={
            <span className="inline-block">
              Votre cahier des charges actuel ne vous permet pas d'accéder aux fonctionnalités
              dématérialisées d'information au Préfet et de modification de votre projet
              (abandon...), vous devez d'abord choisir un cahier des charges.
            </span>
          }
          title="Modification de votre projet"
          severity="warning"
          className="print:hidden"
        />
      )}
      {action && <TertiaryLink href={action.url}> {action.label}</TertiaryLink>}
    </>
  );
