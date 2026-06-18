import Button from '@codegouvfr/react-dsfr/Button';

import { DocumentProjet, IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getRaccordement } from '../../../_helpers';
import { Dossier, type DossierEtape } from './Dossier';

type DossierSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Dossiers de Raccordement';

export const DossiersRaccordementSection = ({
  identifiantProjet: identifiantProjetValue,
}: DossierSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const raccordement = await getRaccordement(identifiantProjet.formatter());

      return (
        <Section title={sectionTitle} className="min-w-0">
          <Button
            priority="secondary"
            iconId="fr-icon-add-circle-line"
            linkProps={{
              href: '',
            }}
          >
            Ajouter un dossier de raccordement
          </Button>{' '}
          <div className="flex flex-wrap gap-4">
            {raccordement?.dossiers.map((dossier) => (
              <Dossier
                key={dossier.référence.formatter()}
                dossierEtapes={mapToDossierData({ dossier, rôle: utilisateur.rôle })}
                référence={dossier.référence.formatter()}
              />
            ))}
          </div>
        </Section>
      );
    }),
    sectionTitle,
  );

type GetDossierData = {
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  rôle: Role.ValueType;
};

const mapToDossierData = ({
  dossier: {
    identifiantProjet,
    demandeComplèteRaccordement,
    propositionTechniqueEtFinancière,
    miseEnService,
  },
  rôle,
}: GetDossierData) => {
  const étapes: Array<DossierEtape> = [];

  if (
    demandeComplèteRaccordement?.dateQualification &&
    demandeComplèteRaccordement?.accuséRéception
  ) {
    étapes.push({
      type: 'dcr',
      date: demandeComplèteRaccordement.dateQualification.formatter(),
      document: {
        url: DocumentProjet.bind(demandeComplèteRaccordement.accuséRéception).formatter(),
      },
      action: rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier')
        ? {
            href: '',
            label: 'Modifier',
          }
        : undefined,
    });
  }

  if (propositionTechniqueEtFinancière) {
    étapes.push({
      type: 'ptf',
      date: propositionTechniqueEtFinancière.dateSignature.formatter(),
      document: {
        url: DocumentProjet.bind(
          propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée,
        ).formatter(),
      },
      action: {
        href: '',
        label: 'Modifier',
      },
    });

    étapes.push({
      type: 'cr',
      date: undefined,
      action: {
        href: '',
        label: 'Transmettre la convention de raccordement',
      },
    });
  }

  if (!propositionTechniqueEtFinancière) {
    étapes.push({
      type: 'ptf',
      date: undefined,
      document: undefined,
      action: {
        href: '',
        label: 'Transmettre la proposition technique et financière',
      },
    });

    étapes.push({
      type: 'cr',
      date: undefined,
      action: {
        href: '',
        label: 'Transmettre la convention de raccordement',
      },
    });
  }

  if (miseEnService?.dateMiseEnService) {
    étapes.push({
      type: 'mise-en-service',
      date: miseEnService.dateMiseEnService.formatter(),
    });
  } else {
    étapes.push({
      type: 'mise-en-service',
      date: undefined,
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
