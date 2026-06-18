import Alert from '@codegouvfr/react-dsfr/Alert';

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { Section } from '@/components/atoms/section/Section';
import { TitreChamp } from '@/components/atoms/section/TitreChamp';
import { TitrePageRaccordement } from '../TitrePageRaccordement';
import { DossiersRaccordementSection } from './DossiersRaccordement.section';

// PROPS
type Props = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const DétailsRaccordementDuProjetPageTest = (
  { identifiantProjet }: Props,
  // {
  // identifiantProjet,
  // gestionnaireRéseau,
  // dossiers,
  // actions,
  // lienRetour: { label, href },
  // }
) => {
  // FAKE PROPS
  const gestionnaireRéseau = 'Enedis';
  const gestionnaireRéseauAction = {
    href: '',
    label: 'Modifier',
  };
  const créerNouveauDossier = true;

  return (
    <>
      <TitrePageRaccordement />
      <div className="my-2 md:my-4 flex flex-col gap-4">
        <div className="flex flex-row items-start gap-8">
          {gestionnaireRéseau && (
            <div className="flex-1">
              <Section title="Gestionnaire de réseau" className="w-fit">
                <div className="flex flex-col gap-1">
                  <div>
                    <TitreChamp>Identité du gestionnaire de réseau</TitreChamp>
                    <span>{gestionnaireRéseau}</span>
                  </div>
                  {gestionnaireRéseauAction && (
                    <TertiaryLink
                      href={gestionnaireRéseauAction.href}
                      key={gestionnaireRéseauAction.label}
                    >
                      {gestionnaireRéseauAction.label}
                    </TertiaryLink>
                  )}
                </div>
              </Section>
            </div>
          )}
          {créerNouveauDossier && (
            <Alert
              severity="info"
              small
              className="flex-1"
              description={
                <div className="p-3">
                  Si le raccordement comporte plusieurs points d'injection, vous devez ajouter un
                  nouveau dossier de raccordement.
                </div>
              }
            />
          )}
        </div>
        <DossiersRaccordementSection identifiantProjet={identifiantProjet} />
      </div>
    </>
  );
};
