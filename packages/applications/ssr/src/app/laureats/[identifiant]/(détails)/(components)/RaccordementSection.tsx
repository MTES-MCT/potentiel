import Notice from '@codegouvfr/react-dsfr/Notice';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { GetRaccordementForProjectPage } from '../_helpers/getRaccordementData';

import { RaccordementAlertesData } from '../_helpers/getRaccordementAlert';
import { Section } from './Section';

type RaccordementSectionProps = {
  raccordement: GetRaccordementForProjectPage;
  raccordementAlerts: RaccordementAlertesData;
};

export const RaccordementSection = async ({
  raccordement,
  raccordementAlerts,
}: RaccordementSectionProps) => (
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
        {raccordementAlerts.map(({ label }, index) => (
          <Notice description={label} title="" severity="info" key={label + index} />
        ))}
        {raccordement.action && (
          <TertiaryLink href={raccordement.action.url}>{raccordement.action.label}</TertiaryLink>
        )}
      </>
    ) : (
      <div>Champs non renseigné</div>
    )}
  </Section>
);
