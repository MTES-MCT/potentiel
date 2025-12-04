import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { DocumentProjet, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

import { ChampAvecMultiplesActions } from '../../_helpers/types';

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export type GetAchèvementData = ChampAvecMultiplesActions<{
  estAchevé: boolean;
  dateAchèvementPrévisionnel: DateTime.RawType;
  dateAchèvementRéel?: DateTime.RawType;
  attestation?: DocumentProjet.RawType;
  preuveTransmissionAuCocontractant?: DocumentProjet.RawType;
}>;

export const getAchèvementData = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetAchèvementData> => {
  const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
    type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  if (Option.isNone(achèvement)) {
    return notFound();
  }

  const value = {
    estAchevé: achèvement.estAchevé,
    dateAchèvementPrévisionnel: achèvement.dateAchèvementPrévisionnel.formatter(),
    dateAchèvementRéel: achèvement.dateAchèvementPrévisionnel.formatter(),
    attestation: achèvement.estAchevé ? achèvement.attestation.formatter() : undefined,
    preuveTransmissionAuCocontractant:
      achèvement.estAchevé && Option.isSome(achèvement.preuveTransmissionAuCocontractant)
        ? achèvement.preuveTransmissionAuCocontractant.formatter()
        : undefined,
  };

  const actions = [];

  if (rôle.aLaPermission('achèvement.modifier')) {
    actions.push({
      label: "Modifier les informations d'achèvement du projet",
      url: Routes.Achèvement.modifierAttestationConformité(identifiantProjet.formatter()),
    });
  }

  if (rôle.aLaPermission('achèvement.transmettreAttestation') && !achèvement.estAchevé) {
    actions.push({
      label: "Transmettre l'attestation de conformité",
      url: Routes.Achèvement.transmettreAttestationConformité(identifiantProjet.formatter()),
    });
  }

  if (rôle.aLaPermission('achèvement.transmettreDate') && !achèvement.estAchevé) {
    actions.push({
      label: "Transmettre la date d'achèvement réel",
      url: Routes.Achèvement.transmettreDateAchèvement(identifiantProjet.formatter()),
    });
  }

  return { value, actions };
};
