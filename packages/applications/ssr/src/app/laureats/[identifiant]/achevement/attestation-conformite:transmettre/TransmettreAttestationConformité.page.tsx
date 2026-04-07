import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { InfoBoxAttestationConformité } from '../InfoAttestationConformité';

import {
  TransmettreAttestationConformitéForm,
  TransmettreAttestationConformitéFormProps,
} from './TransmettreAttestationConformité.form';

export type TransmettreAttestationConformitéPageProps = TransmettreAttestationConformitéFormProps;

export const TransmettreAttestationConformitéPage: FC<
  TransmettreAttestationConformitéPageProps
> = ({ identifiantProjet, demanderMainlevée, lauréatNotifiéLe }) => (
  <ColumnPageTemplate
    heading={<Heading1>Transmettre l'attestation de conformité du projet</Heading1>}
    leftColumn={{
      children: (
        <TransmettreAttestationConformitéForm
          demanderMainlevée={demanderMainlevée}
          identifiantProjet={identifiantProjet}
          lauréatNotifiéLe={lauréatNotifiéLe}
        />
      ),
    }}
    rightColumn={{
      children: (
        <>
          <InfoBoxAttestationConformité />
          <Alert
            severity="warning"
            small
            className="mb-4"
            description={
              <p className="p-3">
                Avant de transmettre votre{' '}
                <span className="font-semibold">attestation de conformité</span> sur la plateforme,
                veuillez vérifier avec le cocontractant que tous les éléments attendus sur Potentiel
                sont corrects. Une fois l'achèvement déclaré sur Potentiel, vous ne pourrez plus
                effectuer de demandes ni de déclarations sur la plateforme. Vous aurez cependant
                toujours la possibilité de modifier les rubriques :{' '}
                <span className="font-semibold">Raccordement au réseau</span> et{' '}
                <span className="font-semibold">Garanties financières</span>.
              </p>
            }
          />
        </>
      ),
    }}
  />
);
