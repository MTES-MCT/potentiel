import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { getGarantiesFinancièresTypeLabel } from '@/app/_helpers';

import { DétailsGarantiesFinancièresPageProps } from '../DétailsGarantiesFinancières.page';

type GarantiesFinancièresProps = {
  title: string;

  // en réalité ce champs peut accueillir soit des GF actuelles soit un dépôt,
  // mais le type Actuel gère plus de cas
  garantiesFinancières: PlainType<
    Omit<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel, 'statut'>
  >;
  attestation?: PlainType<DocumentProjet.ValueType>;
  statutBadge?: React.ReactNode;
  actions: DétailsGarantiesFinancièresPageProps['actions'];
};

export const GarantiesFinancières: FC<GarantiesFinancièresProps> = ({
  title,
  actions,
  garantiesFinancières: {
    dateConstitution,
    dernièreMiseÀJour,
    soumisLe,
    validéLe,
    garantiesFinancières,
    attestation,
  },
  statutBadge,
}) => {
  const gf = Lauréat.GarantiesFinancières.GarantiesFinancières.bind(garantiesFinancières);
  return (
    <>
      <div>
        <div className="flex gap-2">
          <Heading2>{title}</Heading2>
          {statutBadge}
        </div>
        <div className="text-xs italic">
          Dernière mise à jour le{' '}
          <FormattedDate className="font-semibold" date={dernièreMiseÀJour.date.date} />
          {dernièreMiseÀJour.par && (
            <>
              {' '}
              par <span className="font-semibold">{dernièreMiseÀJour.par.email}</span>
            </>
          )}
        </div>
        <div className="mt-5 mb-5 gap-2 text-base flex flex-col">
          {gf.type.estInconnu() ? (
            <span className="font-semibold italic">
              {actions.includes('garantiesFinancières.actuelles.modifier')
                ? 'Type de garanties financières manquant'
                : `Type à compléter par l'autorité instructrice compétente`}
            </span>
          ) : (
            <div>
              Type :{' '}
              <span className="font-semibold">
                {getGarantiesFinancièresTypeLabel(gf.type.formatter())}
              </span>
            </div>
          )}
          {!attestation && (
            <span className="font-semibold italic">
              {gf.estExemption()
                ? 'Délibération approuvant le projet objet de l’offre'
                : 'Attestation de constitution des garanties financières'}{' '}
              manquante
            </span>
          )}
        </div>

        {gf.estAvecDateÉchéance() && (
          <div>
            Date d'échéance :{' '}
            <FormattedDate className="font-semibold" date={gf.dateÉchéance.formatter()} />
          </div>
        )}
        {dateConstitution && (
          <div>
            Date de {gf.estExemption() ? `délibération` : `constitution`} :{' '}
            <FormattedDate className="font-semibold" date={dateConstitution.date} />
          </div>
        )}

        {validéLe && (
          <div>
            Validé le : <FormattedDate className="font-semibold" date={validéLe.date} />
          </div>
        )}
        {soumisLe && (
          <div>
            Soumis le : <FormattedDate className="font-semibold" date={soumisLe.date} />
          </div>
        )}
        <div>
          {attestation && (
            <DownloadDocument
              format="pdf"
              label={
                gf.estExemption()
                  ? 'Télécharger la délibération approuvant le projet objet de l’offre'
                  : "Télécharger l'attestation de constitution"
              }
              url={Routes.Document.télécharger(DocumentProjet.bind(attestation).formatter())}
            />
          )}
        </div>
      </div>
    </>
  );
};
