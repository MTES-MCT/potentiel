import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getLauréatOrRedirect } from '../(raccordement-du-projet)/(détails)/_helpers';
import { DétailsRaccordementDuProjetPageTest } from './DétailsRaccordementDuProjetPageTest';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = { title: 'Raccordement du projet' };

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const lauréat = await getLauréatOrRedirect(identifiantProjet.formatter());

      // if (Option.isNone(raccordement) || raccordement.dossiers.length === 0) {
      //   return redirect(
      //     utilisateur.rôle.aLaPermission('raccordement.demande-complète-raccordement.transmettre')
      //       ? Routes.Raccordement.transmettreDemandeComplèteRaccordement(
      //           identifiantProjet.formatter(),
      //         )
      //       : Routes.Lauréat.détails.tableauDeBord(identifiantProjet.formatter()),
      //   );
      // }

      // const lienRetour = utilisateur.estGrd()
      //   ? {
      //       label: 'Retour vers les raccordements',
      //       href: Routes.Raccordement.lister,
      //     }
      //   : {
      //       label: 'Retour vers le projet',
      //       href: Routes.Projet.details(identifiantProjet.formatter()),
      //     };

      return (
        <DétailsRaccordementDuProjetPageTest identifiantProjet={identifiantProjet.formatter()} />
      );
    }),
  );
}

// type MapToDossierActions = (args: {
//   rôle: Role.ValueType;
//   dossiers: Lauréat.Raccordement.ConsulterRaccordementReadModel['dossiers'];
//   statutLauréat: Lauréat.StatutLauréat.ValueType;
// }) => DétailsRaccordementPageProps['dossiers'];

// const mapToDossierActions: MapToDossierActions = ({ rôle, dossiers, statutLauréat }) =>
//   dossiers.map((dossier) =>
//     mapToPlainObject({
//       ...dossier,
//       actions: {
//         supprimer: getSupprimerDossierAction({
//           rôle,
//           statutLauréat,
//           dossierEnService: !!dossier.miseEnService?.dateMiseEnService?.date,
//         }),

//         demandeComplèteRaccordement: {
//           transmettre: rôle.aLaPermission('raccordement.demande-complète-raccordement.transmettre'),
//           modifier: getModificationDCRAction({
//             rôle,
//             dossier,
//             statutLauréat,
//           }),
//           modifierRéférence:
//             rôle.aLaPermission('raccordement.référence-dossier.modifier') &&
//             !rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier'),
//         },

//         propositionTechniqueEtFinancière: {
//           transmettre: rôle.aLaPermission(
//             'raccordement.proposition-technique-et-financière.transmettre',
//           ),
//           modifier: getModificationPTFAction({
//             rôle,
//             dossier,
//             statutLauréat,
//           }),
//         },
//         miseEnService: {
//           transmettre: rôle.aLaPermission('raccordement.date-mise-en-service.transmettre'),
//           modifier: rôle.aLaPermission('raccordement.date-mise-en-service.modifier'),
//         },
//       },
//     }),
//   );

// type MapToRaccordementActions = (args: {
//   rôle: Role.ValueType;
//   statutLauréat: Lauréat.StatutLauréat.ValueType;
//   identifiantGestionnaireActuel: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
//   dossiers: Lauréat.Raccordement.ConsulterRaccordementReadModel['dossiers'];
// }) => DétailsRaccordementPageProps['actions'];

// const mapToRaccordementActions: MapToRaccordementActions = ({
//   rôle,
//   statutLauréat,
//   identifiantGestionnaireActuel,
//   dossiers,
// }) => ({
//   gestionnaireRéseau: {
//     modifier: getModificationGestionnaireRéseauAction({
//       rôle,
//       statutLauréat,
//       identifiantGestionnaireActuel,
//       aUnDossierEnService:
//         dossiers.filter((dossier) => !!dossier.miseEnService?.dateMiseEnService?.date).length > 0,
//     }),
//   },
//   créerNouveauDossier: rôle.aLaPermission('raccordement.demande-complète-raccordement.transmettre'),
// });
