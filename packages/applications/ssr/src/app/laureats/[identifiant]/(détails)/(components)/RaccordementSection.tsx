import Link from 'next/link';

import { GetRaccordementForProjectPage } from '../_helpers/getRaccordementData';

import { Section } from './Section';

type RaccordementSectionProps = { raccordement: GetRaccordementForProjectPage };

export const RaccordementSection = ({ raccordement }: RaccordementSectionProps) => (
  <Section title="Raccordement au réseau">
    {raccordement.value ? (
      <>
        <div>
          <span className="mb-0 font-semibold">Gestionnaire de réseau</span> :{' '}
          {raccordement.value.gestionnaireDeRéseau}{' '}
        </div>
        <div className="mb-0 font-semibold">
          {raccordement.value.nombreDeDossiers === 0
            ? 'Aucun dossier de raccordement renseigné'
            : raccordement.value.nombreDeDossiers === 1
              ? 'Un dossier de raccordement renseigné'
              : `${raccordement.value.nombreDeDossiers} dossiers de raccordement renseignés`}
        </div>
        {raccordement.action && (
          <Link className="w-fit" href={raccordement.action.url}>
            {raccordement.action.label}
          </Link>
        )}
      </>
    ) : (
      <div>Champs non renseigné</div>
    )}
  </Section>
);
