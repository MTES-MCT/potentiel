import { IdentifiantProjet, Lauréat, Éliminé } from '@potentiel-domain/projet';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { Section } from '@/components/atoms/menu/Section';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';

import { getAbandonInfos, getAchèvement, getLauréatInfos, getRaccordement } from '../../_helpers';
import { getRecours } from '../../../../_helpers/getRecours';

import { EtapesProjet, ÉtapeProjet } from './ÉtapesProjet';

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
      const abandon = await getAbandonInfos(identifiantProjet.formatter());
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
          <EtapesProjet
            étapes={étapes}
            identifiantProjet={identifiantProjetValue}
            doitAfficherAttestationDésignation={!!lauréat.attestationDésignation}
          />
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
  const étapes: Array<ÉtapeProjet> = [
    {
      type: 'designation',
      date: lauréat.notifiéLe.formatter(),
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

  if (recours?.dateAccord) {
    étapes.push({
      type: 'recours',
      date: recours.dateAccord.formatter(),
      dateDemande: recours.dateDemande.formatter(),
    });
  }

  const dateMiseEnService =
    raccordement && raccordement.dossiers.length
      ? raccordement.dossiers
          .map((dossier) => dossier.miseEnService?.dateMiseEnService?.formatter())
          .filter(Boolean)
          .sort()[0]
      : undefined;

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

  return étapes
    .filter((a) => a.date)
    .sort((a, b) => a.date!.localeCompare(b.date!))
    .concat(étapes.filter((a) => !a.date));
};
