import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';

import { Section } from '../../(components)/Section';
import { getLauréatInfos } from '../../../_helpers/getLauréat';
import { getAbandon } from '../../_helpers/getAbandon';
import { getAchèvement } from '../../_helpers/getAchèvement';
import { getRaccordement } from '../../_helpers/getRaccordement';

import { EtapesProjet, ÉtapeProjet } from './ÉtapesProjet';

type ÉtapesProjetSectionProps = {
  identifiantProjet: string;
};

export const ÉtapesProjetSection = async ({
  identifiantProjet: identifiantProjetValue,
}: ÉtapesProjetSectionProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

  const achèvement = await getAchèvement(identifiantProjet.formatter());

  const abandon = await getAbandon(identifiantProjet.formatter());

  const recours = await getRecours(identifiantProjet);

  const lauréat = await getLauréatInfos(identifiantProjet.formatter());

  const raccordement = await getRaccordement(identifiantProjet.formatter());
  const dateMiseEnService =
    raccordement && raccordement.dossiers.length
      ? raccordement.dossiers
          .map((dossier) => dossier.miseEnService?.dateMiseEnService)
          .filter(Boolean)
          .sort()[0]
          ?.formatter()
      : undefined;

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
    dateMiseEnService: dateMiseEnService,
    dateAchèvementRéel: achèvement.estAchevé
      ? achèvement.dateAchèvementRéel?.formatter()
      : undefined,
  });

  return (
    <Section title="Étapes du projet" className="min-w-0">
      <EtapesProjet
        étapes={étapes}
        identifiantProjet={identifiantProjetValue}
        doitAfficherAttestationDésignation={!!lauréat.attestationDésignation}
      />
    </Section>
  );
};

type GetÉtapesData = {
  dateNotification: DateTime.RawType;
  dateAchèvementPrévisionnel: DateTime.RawType;
  abandon?: {
    dateAbandonAccordé: DateTime.RawType;
    dateDemandeAbandon: DateTime.RawType;
  };
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
  const étapes: Array<ÉtapeProjet> = [
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
  } else {
    étapes.push({ type: 'mise-en-service' });
  }

  if (dateAchèvementRéel) {
    étapes.push({
      type: 'achèvement-réel',
      date: dateAchèvementRéel,
    });
  } else {
    étapes.push({ type: 'achèvement-réel' });
  }

  return étapes
    .filter((a) => a.date)
    .sort((a, b) => a.date!.localeCompare(b.date!))
    .concat(étapes.filter((a) => !a.date));
};

const getRecours = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<Éliminé.Recours.ConsulterRecoursReadModel | undefined> => {
  const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
    type: 'Éliminé.Recours.Query.ConsulterRecours',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  return Option.isNone(recours) ? undefined : recours;
};
