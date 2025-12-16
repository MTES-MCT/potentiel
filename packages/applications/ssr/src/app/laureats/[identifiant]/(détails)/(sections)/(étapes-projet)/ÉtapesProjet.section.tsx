import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '@/app/_helpers';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { CahierDesChargesDétails } from './ÉtapesProjet';
import { Section } from '../../(components)/Section';

type CahierDesChargesSectionProps = {
  identifiantProjet: string;
};

export const CahierDesChargesSection = ({
  identifiantProjet: identifiantProjetValue,
}: CahierDesChargesSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    const achèvement = await getAchèvement(identifiantProjet.formatter());

    const abandon = await getAbandon(identifiantProjet);

    // recours pareil
    // raccordement

    const étapes = getÉtapesData({
      dateNotification: lauréat.notifiéLe.formatter(),
      dateAchèvementPrévisionnel: achèvement.dateAchèvementPrévisionnel.formatter(),
      abandon:
        abandon && abandon.accordéLe
          ? {
              dateAbandonAccordé: abandon.accordéLe.formatter(),
              dateDemandeAbandon: abandon.demandéLe.formatter(),
            }
          : undefined,
      dateRecoursAccordé: recours && recours.demande.accord?.accordéLe.formatter(),
      // y'a un petit sujet là
      dateMiseEnService: raccordement.value
        ? raccordement.value.dateMiseEnService?.formatter()
        : undefined,
      dateAchèvementRéel: achèvement.estAchevé
        ? achèvement.dateAchèvementRéel?.formatter()
        : undefined,
    });

    return (
      <Section title="Étapes du projet" className="flex-auto min-w-0">
        <EtapesProjetDétails value={value} action={action} />
      </Section>
    );
  });

import { DateTime } from '@potentiel-domain/common';

import { EtapesProjetProps } from '../(components)/EtapesProjetSection';
import { getAchèvement } from '../../_helpers/getAchèvement';
import { getAbandon } from '../../_helpers/getAbandon';

type GetÉtapesData = {
  dateNotification: DateTime.RawType;
  dateAchèvementPrévisionnel: DateTime.RawType;
  abandon?: {
    dateAbandonAccordé: DateTime.RawType;
    dateDemandeAbandon: DateTime.RawType;
  };
  dateAbandonAccordé?: DateTime.RawType;
  dateRecoursAccordé?: DateTime.RawType;
  dateMiseEnService?: DateTime.RawType;
  dateAchèvementRéel?: DateTime.RawType;
};

export const getÉtapesData = ({
  dateNotification,
  dateAchèvementPrévisionnel,
  abandon,
  dateRecoursAccordé,
  dateAchèvementRéel,
  dateMiseEnService,
}: GetÉtapesData) => {
  const étapes: EtapesProjetProps['étapes'] = [
    {
      type: 'designation',
      date: dateNotification,
    },
  ];

  if (abandon) {
    étapes.push({
      type: 'abandon',
      date: abandon.dateAbandonAccordé,
      dateDemande: abandon.dateDemandeAbandon,
    });

    return étapes;
  }

  étapes.push({
    type: 'achèvement-prévisionel',
    date: dateAchèvementPrévisionnel,
  });

  if (dateRecoursAccordé) {
    étapes.push({
      type: 'recours',
      date: dateRecoursAccordé,
    });
  }

  if (dateMiseEnService) {
    étapes.push({
      type: 'mise-en-service',
      date: dateMiseEnService,
    });
  }

  if (dateAchèvementRéel) {
    étapes.push({
      type: 'achèvement-réel',
      date: dateAchèvementRéel,
    });
  }

  return étapes;
};
