'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils//zod/document/manyDocuments';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: manyDocuments({ acceptedFileTypes: ['application/pdf'] }),
});

export type ModifierAttestationConformitéFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, attestation },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Achèvement.ModifierAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.UseCase.ModifierAttestationConformité',
      data: {
        identifiantProjetValue: identifiantProjet,
        attestationValue: attestation,
        modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
        modifiéeLeValue: new Date().toISOString(),
      },
    });

    const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
      type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    const aDéjàTransmisUnDossierDeRaccordement =
      Option.isSome(raccordement) && raccordement.dossiers.length > 0;

    return {
      status: 'success',
      redirection: {
        url: aDéjàTransmisUnDossierDeRaccordement
          ? Routes.Lauréat.détails.tableauDeBord(identifiantProjet)
          : Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet),
        message: 'Votre attestation de conformité a bien été transmise',
      },
    };
  });

export const modifierAttestationConformitéAction = formAction(action, schema);
