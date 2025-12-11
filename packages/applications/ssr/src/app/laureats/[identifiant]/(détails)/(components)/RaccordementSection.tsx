import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { GetRaccordementForProjectPage } from '../_helpers/getRaccordementData';

import { Section } from './Section';

type RaccordementSectionProps = { raccordement: GetRaccordementForProjectPage };

export const RaccordementSection = async ({ raccordement }: RaccordementSectionProps) => (
  <Section title="Raccordement au réseau">
    {raccordement.value ? (
      <>
        <div>
          <span className="mb-0">Gestionnaire de réseau</span> :{' '}
          {raccordement.value.gestionnaireDeRéseau}{' '}
        </div>
        <div className="mb-0">
          {raccordement.value.nombreDeDossiers === 0
            ? 'Aucun dossier de raccordement renseigné'
            : raccordement.value.nombreDeDossiers === 1
              ? 'Un dossier de raccordement renseigné'
              : `${raccordement.value.nombreDeDossiers} dossiers de raccordement renseignés`}
        </div>
        {raccordement.action && (
          <TertiaryLink href={raccordement.action.url}>{raccordement.action.label}</TertiaryLink>
        )}
      </>
    ) : (
      <div>Champs non renseigné</div>
    )}
  </Section>
);
