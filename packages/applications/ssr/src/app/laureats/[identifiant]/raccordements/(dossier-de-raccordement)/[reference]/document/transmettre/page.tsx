import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getLauréatOrRedirect } from '../../../../(raccordement-du-projet)/(détails)/_helpers';
import { TransmettreDocumentPage } from './TransmettreDocument.page';

type PageProps = {
  params: Promise<{
    identifiant: string;
    reference: string;
  }>;
};

export const metadata: Metadata = { title: 'Transmettre un document de raccordement' };

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant, reference } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.TransmettreDocumentUseCase>(
        'Lauréat.Raccordement.UseCase.TransmettreDocument',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      ).formatter();

      await getLauréatOrRedirect(identifiantProjet);

      const referenceDossierRaccordement = decodeParameter(reference);

      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet,
            référenceDossierRaccordementValue: referenceDossierRaccordement,
          },
        });

      if (Option.isNone(dossierRaccordement)) {
        return notFound();
      }

      const availableTypes = récupérerTypesDisponibles(dossierRaccordement);

      return (
        <TransmettreDocumentPage
          identifiantProjet={identifiantProjet}
          referenceDossierRaccordement={referenceDossierRaccordement}
          availableTypes={availableTypes}
        />
      );
    }),
  );
}

const récupérerTypesDisponibles = (
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel,
): Lauréat.Raccordement.TypeDocumentsRaccordement.RawType[] => {
  const availableTypes: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType[] = [];

  if (dossier.propositionTechniqueEtFinancière && !dossier.conventionDeRaccordement) {
    availableTypes.push('convention-de-raccordement');
  }

  if (!dossier.propositionTechniqueEtFinancière && dossier.conventionDeRaccordement) {
    availableTypes.push('proposition-technique-et-financière');
  }

  if (
    !dossier.propositionTechniqueEtFinancière &&
    !dossier.conventionDeRaccordement &&
    !dossier.conventionDirecteDeRaccordement
  ) {
    availableTypes.push(...Lauréat.Raccordement.TypeDocumentsRaccordement.type);
  }

  return availableTypes;
};
