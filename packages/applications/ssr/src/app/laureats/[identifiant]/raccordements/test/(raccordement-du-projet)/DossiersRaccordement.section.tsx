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
import { Dossier, type DossierEtape } from './Dossier';

type DossierSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  statut: Lauréat.StatutLauréat.RawType;
};

const sectionTitle = 'Dossiers de Raccordement';

export const DossiersRaccordementSection = ({
  identifiantProjet: identifiantProjetValue,
  statut,
}: DossierSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
      const rôle = utilisateur.rôle;
      const peutAjouterUnDossier = rôle.aLaPermission(
        'raccordement.demande-complète-raccordement.transmettre',
      );
      const estProjetAchevé = statut === 'achevé';

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
                href: '',
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
  const estMisEnService = !!dossier.miseEnService?.dateMiseEnService;

  // DCR
  // modifier référence
  // accuséRéception.endsWith('.bin')
  // pas d'accusé de réception, ou de date et action.transmettre => modifierDemandeComplèteRaccordement

  //   miseEnService: {
  //     transmettre: rôle.aLaPermission('raccordement.date-mise-en-service.transmettre'),
  //     modifier: rôle.aLaPermission('raccordement.date-mise-en-service.modifier'),
  //   },
  // },

  étapes.push({
    type: 'dcr',
    date: dossier.demandeComplèteRaccordement.dateQualification?.formatter(),
    document: dossier.demandeComplèteRaccordement.accuséRéception
      ? {
          url: DocumentProjet.bind(dossier.demandeComplèteRaccordement.accuséRéception).formatter(),
        }
      : undefined,
    action: getDemandeComplèteDeRaccordementActionTest({ rôle, estProjetAchevé, dossier }),
  });

  if (dossier.propositionTechniqueEtFinancière) {
    étapes.push({
      type: 'ptf',
      date: dossier.propositionTechniqueEtFinancière.dateSignature.formatter(),
      document: {
        url: DocumentProjet.bind(
          dossier.propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée,
        ).formatter(),
      },
      action: getPropositionTechniqueEtFinancièreAction({ rôle, dossier, estProjetAchevé }),
    });
  } else {
    étapes.push({
      type: 'ptf',
      date: undefined,
      document: undefined,
      action: rôle.aLaPermission('raccordement.proposition-technique-et-financière.transmettre')
        ? {
            href: Routes.Raccordement.transmettrePropositionTechniqueEtFinancière(
              dossier.identifiantProjet.formatter(),
              dossier.référence.formatter(),
            ),
            label: 'Transmettre la proposition technique et financière',
          }
        : undefined,
    });
  }

  if (dossier.miseEnService?.dateMiseEnService) {
    étapes.push({
      type: 'mise-en-service',
      date: dossier.miseEnService.dateMiseEnService.formatter(),
      action: rôle.aLaPermission('raccordement.date-mise-en-service.modifier')
        ? {
            href: Routes.Raccordement.modifierDateMiseEnService(
              dossier.identifiantProjet.formatter(),
              dossier.référence.formatter(),
            ),
            label: 'Modifier la date de mise en service',
          }
        : undefined,
    });
  } else {
    étapes.push({
      type: 'mise-en-service',
      date: undefined,
      action: rôle.aLaPermission('raccordement.date-mise-en-service.transmettre')
        ? {
            href: Routes.Raccordement.transmettreDateMiseEnService(
              dossier.identifiantProjet.formatter(),
              dossier.référence.formatter(),
            ),
            label: 'Transmettre la date de mise en service',
          }
        : undefined,
    });
  }

  return (
    étapes
      .filter((a) => a.date)
      // biome-ignore lint/style/noNonNullAssertion: C'est acceptable de forcer la valeur de date ici car on a filter avant
      .sort((a, b) => a.date!.localeCompare(b.date!))
      .concat(étapes.filter((a) => !a.date))
  );
};
