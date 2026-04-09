import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';
import Link from 'next/link';
import { fr } from '@codegouvfr/react-dsfr';
import clsx from 'clsx';
import Success from '@codegouvfr/react-dsfr/picto/Success';
import Error from '@codegouvfr/react-dsfr/picto/Error';

import { Routes } from '@potentiel-applications/routes';

const prérequisMainlevée = {
  garantiesFinancièresValidées: {
    label: 'Le projet a des garanties financières validées',
    action: {
      label: 'Soumettre des nouvelles garanties financières',
      lien: Routes.GarantiesFinancières.dépôt.soumettre,
    },
  },
  attestationConstitutionTransmise: {
    label: "L'attestation de constitution des garanties financière est transmise dans Potentiel",
    action: {
      label: `Enregistrer l'attestation de constitution`,
      lien: Routes.GarantiesFinancières.actuelles.enregistrerAttestation,
    },
  },
  pasDeDépôtEnCours: {
    label:
      'Le projet ne dispose pas de demande de renouvellement ou de modifications de garanties financières en cours',
    action: undefined,
  },
  projetAchevéOuAbandonné: {
    label: 'Le projet est achevé ou abandonné',
    action: {
      label: `Transmettre l'attestation de conformité`,
      lien: Routes.Achèvement.transmettreAttestationConformité,
    },
  },
  attestationConformitéTransmise: {
    label: "L'attestation de conformité est transmise dans Potentiel",
    action: {
      label: `Enregistrer l'attestation de conformité`,
      lien: Routes.Achèvement.enregistrerAttestationConformité,
    },
  },
};

export type ChecklistMainlevéeProps = {
  identifiantProjet: string;
  prérequis: Partial<Record<keyof typeof prérequisMainlevée, boolean>>;
};

export const ChecklistMainlevée: FC<ChecklistMainlevéeProps> = ({
  identifiantProjet,
  prérequis,
}) => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Vous pouvez accéder à la demande de levée de vos garanties bancaires sur Potentiel si votre
        projet remplit <span className="font-semibold">toutes</span> les conditions suivantes :
        <ul className="list-none cursor-default list-inside my-2 ">
          {Object.entries(prérequisMainlevée).map(([key, { label, action }]) => {
            const complété = prérequis[key as keyof typeof prérequisMainlevée];
            if (complété === undefined) {
              return null;
            }
            return (
              <li
                key={key}
                className={'flex flex-row items-center gap-3'}
                aria-label={complété ? 'Ce prérequis est rempli' : "L'action reste à compléter"}
              >
                <span aria-hidden>
                  {complété ? <Success fontSize="medium" /> : <Error fontSize="medium" />}
                </span>
                <span className={clsx({ 'line-through': complété })}>{label}</span>
                {!complété && action && (
                  <Link
                    href={action.lien(identifiantProjet)}
                    className={fr.cx('fr-link', 'fr-link--icon-right')}
                  >
                    {action.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    }
  />
);
