import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getRaccordement } from '../../../_helpers';
import {
  type DossierEtape,
  DossierRaccordement,
} from '../../(dossier-de-raccordement)/components/DossierRaccordement';
import {
  getDemandeComplèteDeRaccordementAction,
  getDocumentAction,
  getSupprimerDossierAction,
} from '../../(raccordement-du-projet)/(détails)/_helpers';
import { getMiseEnServiceAction } from './_helpers/getMiseEnServiceAction';

type DossierSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  estProjetAchevé: boolean;
};

const sectionTitle = 'Dossiers de Raccordement';

export const DossiersRaccordementSection = ({
  identifiantProjet: identifiantProjetValue,
  estProjetAchevé,
}: DossierSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
      const rôle = utilisateur.rôle;
      const peutAjouterUnDossier = rôle.aLaPermission(
        'raccordement.demande-complète-raccordement.transmettre',
      );

      const raccordement = await getRaccordement(identifiantProjet.formatter());

      return (
        <div className="w-full h-fit flex flex-col gap-4 py-3">
          {peutAjouterUnDossier && (
            <Button
              priority="secondary"
              iconId="fr-icon-add-circle-line"
              linkProps={{
                href: Routes.Raccordement.transmettreDemandeComplèteRaccordement(
                  identifiantProjetValue,
                ),
              }}
            >
              Ajouter un dossier de raccordement
            </Button>
          )}
          <div className="flex flex-wrap gap-4">
            {raccordement?.dossiers.map((dossier) => (
              <DossierRaccordement
                key={dossier.référence.formatter()}
                dossierEtapes={mapToDossierData({ dossier, rôle, estProjetAchevé })}
                peutSupprimerDossier={getSupprimerDossierAction({
                  rôle,
                  estAchevé: estProjetAchevé,
                  dossierEstEnService: !!dossier.dateMiseEnService?.date,
                })}
                référence={dossier.référence.formatter()}
                identifiantProjet={identifiantProjetValue}
              />
            ))}
          </div>
        </div>
      );
    }),
    sectionTitle,
  );

type GetDossierData = {
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  rôle: Role.ValueType;
  estProjetAchevé: boolean;
};

const mapToDossierData = ({ dossier, rôle, estProjetAchevé }: GetDossierData) => {
  const étapes: Array<DossierEtape> = [];

  étapes.push({
    type: 'dcr',
    ...(dossier.demandeComplèteRaccordement.dateQualification && {
      data: {
        date: dossier.demandeComplèteRaccordement.dateQualification?.formatter(),
        document: dossier.demandeComplèteRaccordement.accuséRéception
          ? DocumentProjet.bind(dossier.demandeComplèteRaccordement.accuséRéception).formatter()
          : undefined,
      },
    }),
    fallbackText: 'À transmettre',
    actions: getDemandeComplèteDeRaccordementAction({ rôle, estProjetAchevé, dossier }),
  });

  const {
    conventionDeRaccordement,
    propositionTechniqueEtFinancière,
    conventionDirecteDeRaccordement,
  } = dossier;

  if (
    !propositionTechniqueEtFinancière &&
    !conventionDeRaccordement &&
    !conventionDirecteDeRaccordement
  ) {
    étapes.push({
      type: 'document',
      fallbackText: 'À transmettre',
      actions: getDocumentAction({ rôle, dossier, estProjetAchevé }),
    });
  }

  for (const document of [
    conventionDeRaccordement,
    propositionTechniqueEtFinancière,
    conventionDirecteDeRaccordement,
  ]) {
    if (document) {
      const type = Lauréat.Raccordement.TypeDocumentsRaccordement.convertirEnValueType(
        document.document.typeDocument.split('/')[2],
      ).type;

      étapes.push({
        type,
        ...(document && {
          data: {
            date: document.dateSignature.formatter(),
            document: DocumentProjet.bind(document.document).formatter(),
          },
        }),
        fallbackText: 'À transmettre',
        actions: getDocumentAction({
          rôle,
          dossier,
          estProjetAchevé,
          type,
        }),
      });
    }
  }

  if (conventionDeRaccordement && !propositionTechniqueEtFinancière) {
    étapes.push({
      type: 'proposition-technique-et-financière',
      fallbackText: 'À transmettre',
      actions: getDocumentAction({
        rôle,
        dossier,
        estProjetAchevé,
        type: 'proposition-technique-et-financière',
      }),
    });
  }

  if (!conventionDeRaccordement && propositionTechniqueEtFinancière) {
    étapes.push({
      type: 'convention-de-raccordement',
      fallbackText: 'À transmettre',
      actions: getDocumentAction({
        rôle,
        dossier,
        estProjetAchevé,
        type: 'convention-de-raccordement',
      }),
    });
  }

  étapes.push({
    type: 'mise-en-service',
    ...(dossier.dateMiseEnService && {
      data: {
        date: dossier.dateMiseEnService.formatter(),
      },
    }),
    fallbackText: rôle.aLaPermission('raccordement.date-mise-en-service.transmettre')
      ? 'À transmettre'
      : 'La date de mise en service sera renseignée par le gestionnaire de réseau',
    actions: getMiseEnServiceAction({ rôle, dossier }),
  });

  return étapes;
};
