import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { récupérerLauréatNonAbandonné } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  ModifierAchèvementPage,
  type ModifierAchèvementPageProps,
} from './ModifierAchèvement.page';

export const metadata: Metadata = { title: `Modifier l'attestation de conformité` };

export default async function Page(props0: IdentifiantParameter) {
  const params = await props0.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Achèvement.ModifierAchèvementUseCase>(
        'Lauréat.Achèvement.UseCase.ModifierAchèvement',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      ).formatter();

      const projet = await récupérerLauréatNonAbandonné(identifiantProjet);

      const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
        type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
        data: { identifiantProjetValue: identifiantProjet },
      });

      if (Option.isNone(achèvement) || !achèvement.estAchevé) {
        return notFound();
      }

      const props = mapToProps(projet.identifiantProjet, achèvement, projet.notifiéLe);

      return (
        <ModifierAchèvementPage
          identifiantProjet={props.identifiantProjet}
          dateTransmissionAuCocontractant={props.dateTransmissionAuCocontractant}
          lauréatNotifiéLe={props.lauréatNotifiéLe}
          attestationConformité={props.attestationConformité}
          rapportAssocié={props.rapportAssocié}
          preuveTransmissionAuCocontractant={props.preuveTransmissionAuCocontractant}
        />
      );
    }),
  );
}

type MapToProps = (
  identifiantProjet: IdentifiantProjet.ValueType,
  achèvement: Lauréat.Achèvement.ConsulterAchèvementAchevéReadModel,
  notifiéLe: DateTime.ValueType,
) => ModifierAchèvementPageProps;

const mapToProps: MapToProps = (
  identifiantProjet,
  { attestation, rapportAssocié, preuveTransmissionAuCocontractant, dateAchèvementRéel },
  notifiéLe,
) => ({
  identifiantProjet: identifiantProjet.formatter(),
  lauréatNotifiéLe: notifiéLe.formatter(),
  dateTransmissionAuCocontractant: dateAchèvementRéel.formatter(),
  attestationConformité: Option.isSome(attestation) ? attestation.formatter() : undefined,
  rapportAssocié: Option.isSome(rapportAssocié) ? rapportAssocié.formatter() : undefined,
  preuveTransmissionAuCocontractant: Option.isSome(preuveTransmissionAuCocontractant)
    ? preuveTransmissionAuCocontractant.formatter()
    : undefined,
});
