import { IdentifiantProjet, type Lauréat, type Éliminé } from '@potentiel-domain/projet';

import { getLauréatInfos } from '@/app/_helpers';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getRecours } from '../../../../_helpers/getRecours';
import { getAchèvement, getOptionalAbandon, getRaccordement } from '../../_helpers';
import { EtapesProjet, type ÉtapeProjet } from './ÉtapesProjet';

type ÉtapesProjetSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Étapes du projet';

export const ÉtapesProjetSection = ({
  identifiantProjet: identifiantProjetValue,
}: ÉtapesProjetSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const achèvement = await getAchèvement(identifiantProjet.formatter());
      const abandon = await getOptionalAbandon(identifiantProjet.formatter());
      const recours = await getRecours(identifiantProjet.formatter());
      const lauréat = await getLauréatInfos(identifiantProjet.formatter());
      const raccordement = await getRaccordement(identifiantProjet.formatter());

      const étapes = mapToÉtapesData({
        lauréat,
        achèvement,
        abandon,
        recours,
        raccordement,
      });

      return (
        <Section title={sectionTitle} className="min-w-0">
          <EtapesProjet étapes={étapes} identifiantProjet={identifiantProjetValue} />
        </Section>
      );
    }),
    sectionTitle,
  );

type GetÉtapesData = {
  lauréat: Lauréat.ConsulterLauréatReadModel;
  achèvement: Lauréat.Achèvement.ConsulterAchèvementReadModel;
  abandon?: Lauréat.Abandon.ConsulterAbandonReadModel;
  recours?: Éliminé.Recours.ConsulterRecoursReadModel;
  raccordement?: Lauréat.Raccordement.ConsulterRaccordementReadModel;
};

const mapToÉtapesData = ({
  lauréat,
  achèvement,
  abandon,
  raccordement,
  recours,
}: GetÉtapesData) => {
  // la "notification" d'un projet lauréat est sa date de recours accordé s'il a fait l'objet d'un recours, sinon sa date de désignation
  const étapes: Array<ÉtapeProjet> = recours?.dateAccord
    ? [
        {
          type: 'recours',
          date: lauréat.notifiéLe.formatter(),
          dateDemande: recours.dateDemande.formatter(),
        },
      ]
    : [
        {
          type: 'designation',
          date: lauréat.notifiéLe.formatter(),
          hasNoDocument: lauréat.attestationDésignation ? undefined : true,
        },
      ];

  if (abandon?.accordéLe) {
    étapes.push({
      type: 'abandon',
      date: abandon.accordéLe.formatter(),
      dateDemande: abandon.demandéLe.formatter(),
    });

    return étapes;
  }

  étapes.push({
    type: 'achèvement-prévisionel',
    date: achèvement.dateAchèvementPrévisionnel.formatter(),
  });

  const dateMiseEnService = raccordement?.miseEnService?.date.formatter() ?? undefined;

  if (dateMiseEnService) {
    étapes.push({
      type: 'mise-en-service',
      date: dateMiseEnService,
    });
  } else {
    étapes.push({ type: 'mise-en-service' });
  }

  if (achèvement.estAchevé && achèvement.dateAchèvementRéel) {
    étapes.push({
      type: 'achèvement-réel',
      date: achèvement.dateAchèvementRéel.formatter(),
    });
  } else {
    étapes.push({ type: 'achèvement-réel' });
  }

  return (
    étapes
      .filter((a) => a.date)
      // biome-ignore lint/style/noNonNullAssertion: C'est acceptable de forcer la valeur de date ici car on a filter avant
      .sort((a, b) => a.date!.localeCompare(b.date!))
      .concat(étapes.filter((a) => !a.date))
  );
};
