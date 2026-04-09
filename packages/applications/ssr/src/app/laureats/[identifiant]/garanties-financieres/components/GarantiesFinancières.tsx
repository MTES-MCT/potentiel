import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { getGarantiesFinancièresAttestationLabel } from '../_helpers/getGarantiesFinancièresAttestationLabel';
import { getGarantiesFinancièresDateLabel } from '../_helpers/getGarantiesFinancièresDateLabel';
import { getGarantiesFinancièresTypeLabel } from '../_helpers/getGarantiesFinancièresTypeLabel';

type GarantiesFinancièresProps = {
  garantiesFinancières: PlainType<Lauréat.GarantiesFinancières.GarantiesFinancières.ValueType>;
  peutModifier: boolean;
  validéLe?: PlainType<DateTime.ValueType>;
  soumisLe?: PlainType<DateTime.ValueType>;
  document?: PlainType<DocumentProjet.ValueType>;
};

export const GarantiesFinancières: FC<GarantiesFinancièresProps> = ({
  garantiesFinancières,
  validéLe,
  soumisLe,
  document,
  peutModifier,
}) => {
  const gf = Lauréat.GarantiesFinancières.GarantiesFinancières.bind(garantiesFinancières);
  return (
    <div className="text-base flex flex-col gap-2">
      {gf.type.estInconnu() ? (
        <span className="font-semibold italic">
          {peutModifier
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
      {!gf.estConstitué() && (
        <span className="font-semibold italic">
          {getGarantiesFinancièresAttestationLabel(gf.type.type)} manquante
        </span>
      )}

      {gf.estAvecDateÉchéance() && (
        <div>
          Date d'échéance :{' '}
          <FormattedDate className="font-semibold" date={gf.dateÉchéance.formatter()} />
        </div>
      )}
      {gf.estConstitué() && (
        <div>
          {getGarantiesFinancièresDateLabel(gf.type.type)} :{' '}
          <FormattedDate className="font-semibold" date={gf.constitution.date.formatter()} />
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
      {document && (
        <DownloadDocument
          format="pdf"
          label={
            gf.estExemption()
              ? 'Télécharger la délibération approuvant le projet objet de l’offre'
              : "Télécharger l'attestation de constitution"
          }
          url={Routes.Document.télécharger(DocumentProjet.bind(document).formatter())}
        />
      )}
    </div>
  );
};
