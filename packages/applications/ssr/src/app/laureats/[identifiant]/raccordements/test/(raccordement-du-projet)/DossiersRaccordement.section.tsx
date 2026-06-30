import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet, IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import { Heading3 } from '@/components/atoms/headings';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getRaccordement } from '../../../_helpers';
import {
  getDemandeComplèteDeRaccordementActionTest,
  getPropositionTechniqueEtFinancièreAction,
  getSupprimerDossierActionTest,
} from '../../(raccordement-du-projet)/(détails)/_helpers';
import { getMiseEnServiceAction } from '../../(raccordement-du-projet)/(détails)/_helpers/getMiseEnServiceAction';
import { Dossier, type DossierEtape } from './Dossier';

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
        <div className="w-full h-fit flex flex-col gap-4 p-3">
          <Heading3 as="h2" className="flex items-center mb-1">
            Dossiers de Raccordement
          </Heading3>
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
              <Dossier
                key={dossier.référence.formatter()}
                dossierEtapes={mapToDossierData({ dossier, rôle, estProjetAchevé })}
                peutSupprimerDossier={getSupprimerDossierActionTest({
                  rôle,
                  estAchevé: estProjetAchevé,
                  dossierEstEnService: !!dossier.miseEnService?.dateMiseEnService?.date,
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
    date: {
      date: dossier.demandeComplèteRaccordement.dateQualification?.formatter(),
      fallbackText: 'Date à transmettre',
    },
    document: {
      url: dossier.demandeComplèteRaccordement.accuséRéception
        ? DocumentProjet.bind(dossier.demandeComplèteRaccordement.accuséRéception).formatter()
        : undefined,
      fallbackText: 'Accusé de réception à transmettre',
    },
    action: getDemandeComplèteDeRaccordementActionTest({ rôle, estProjetAchevé, dossier }),
  });

  étapes.push({
    type: 'ptf',
    date: {
      date: dossier.propositionTechniqueEtFinancière?.dateSignature.formatter(),
      fallbackText: 'Date de signature à transmettre',
    },
    document: {
      url: dossier.propositionTechniqueEtFinancière
        ? DocumentProjet.bind(
            dossier.propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée,
          ).formatter()
        : undefined,
      fallbackText: 'Document à transmettre',
    },
    action: getPropositionTechniqueEtFinancièreAction({ rôle, dossier, estProjetAchevé }),
  });

  étapes.push({
    type: 'mise-en-service',
    date: {
      date: dossier.miseEnService?.dateMiseEnService?.formatter(),
      fallbackText: 'Date de mise en service à transmettre',
    },
    action: getMiseEnServiceAction({ rôle, dossier }),
  });

  return étapes;
};
