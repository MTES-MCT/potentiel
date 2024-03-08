import { FC } from 'react';
import Link from 'next/link';
import { fr } from '@codegouvfr/react-dsfr';
import Download from '@codegouvfr/react-dsfr/Download';

import { Routes } from '@potentiel-libraries/routes';

import { Heading2 } from '@/components/atoms/headings';
import { CallOut } from '@/components/atoms/CallOut';
import { formatDateForText } from '@/utils/formatDateForText';

import { DépôtGarantiesFinancières } from './GarantiesFinancièresHistoriqueDépôts';

type GarantiesFinancièresDépôtEnCoursProps = {
  dépôt: DépôtGarantiesFinancières & { action?: 'modifier' };
  identifiantProjet: string;
};

export const GarantiesFinancièresDépôtEnCours: FC<GarantiesFinancièresDépôtEnCoursProps> = ({
  identifiantProjet,
  dépôt: { type, dateÉchéance, dateConstitution, attestation, action, dernièreMiseÀJour },
}) => (
  <>
    <Heading2 className="mb-4">Garanties financières en cours</Heading2>
    <CallOut
      className="w-1/2"
      colorVariant={'info'}
      content={
        <>
          <div className="text-sm italic mb-4">
            Dernière mise à jour le{' '}
            <span className="font-semibold">{formatDateForText(dernièreMiseÀJour.date)}</span> par{' '}
            <span className="font-semibold">{dernièreMiseÀJour.par}</span>
          </div>
          <div className="mt-5 gap-2">
            <div>
              Type : <span className="font-semibold">{type}</span>
            </div>
            {dateÉchéance && (
              <div>
                Date d'échéance :{' '}
                <span className="font-semibold">{formatDateForText(dateÉchéance)}</span>
              </div>
            )}
            {dateConstitution && (
              <div>
                Date de constitution :{' '}
                <span className="font-semibold">{formatDateForText(dateConstitution)}</span>
              </div>
            )}
            <div>
              {attestation && (
                <Download
                  details="fichier au format pdf"
                  label="Télécharger l'attestation"
                  linkProps={{ href: Routes.Document.télécharger(attestation), target: '_blank' }}
                />
              )}
            </div>
          </div>
          {action && (
            <Link
              className="flex md:max-w-lg w-fit"
              href={Routes.GarantiesFinancières.dépôt.modifier(identifiantProjet)}
            >
              <i className={`${fr.cx('ri-pencil-line')} mr-1`} aria-hidden />
              Modifier
            </Link>
          )}
        </>
      }
    />
  </>
);
