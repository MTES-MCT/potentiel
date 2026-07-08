import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getLauréatOrRedirect } from '../../../../(raccordement-du-projet)/(détails)/_helpers';
import { ModifierDocumentPage, type ModifierDocumentPageProps } from './ModifierDocument.page';

type PageProps = {
  params: Promise<{
    identifiant: string;
    reference: string;
    type: string;
  }>;
};

export const metadata: Metadata = { title: 'Modifier le document' };

export default async function Page(props0: PageProps) {
  const params = await props0.params;

  const { identifiant, reference, type } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.ModifierDocumentUseCase>(
        'Lauréat.Raccordement.UseCase.ModifierDocument',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      ).formatter();
      const typeDocument = Lauréat.Raccordement.TypeDocumentsRaccordement.convertirEnValueType(
        decodeParameter(type),
      );
      const referenceDossierRaccordement =
        Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
          decodeParameter(reference),
        );

      await getLauréatOrRedirect(identifiantProjet);

      const document = await mediator.send<Lauréat.Raccordement.ConsulterDocumentQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterDocument',
        data: {
          identifiantProjetValue: identifiantProjet,
          référenceDossierRaccordementValue: referenceDossierRaccordement.formatter(),
          typeDocumentValue: typeDocument.formatter(),
        },
      });

      if (Option.isNone(document)) {
        return notFound();
      }

      const props = mapToProps({
        identifiantProjet,
        référence: referenceDossierRaccordement,
        document,
      });

      return (
        <ModifierDocumentPage
          identifiantProjet={props.identifiantProjet}
          raccordement={props.raccordement}
        />
      );
    }),
  );
}

type MapToProps = (params: {
  identifiantProjet: IdentifiantProjet.RawType;
  référence: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel['référence'];
  document: NonNullable<Lauréat.Raccordement.ConsulterDocumentReadModel>;
}) => ModifierDocumentPageProps;

const mapToProps: MapToProps = ({ identifiantProjet, référence, document }) => ({
  identifiantProjet,
  raccordement: {
    reference: référence.formatter(),
    document: {
      dateSignature: document.dateSignature.formatter(),
      documentSignée: document.document.formatter(),
      type: document.type.formatter(),
    },
  },
});
