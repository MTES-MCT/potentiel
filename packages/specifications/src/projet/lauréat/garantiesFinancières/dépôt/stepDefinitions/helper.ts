import { IdentifiantProjet } from '@potentiel-domain/common';

import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

export const defaultDépôtData = {
  typeGarantiesFinancières: 'consignation',
  dateÉchéance: undefined,
  format: 'application/pdf',
  dateConstitution: '2024-01-01',
  contenuFichier: 'contenu fichier',
  dateSoumission: '2024-01-02',
  soumisPar: 'porteur@test.test',
  dateModification: '2024-01-03',
  modifiéPar: 'user@test.test',
  dateSuppression: '2024-01-04',
  suppriméPar: 'porteur@test.test',
  dateValidation: '2024-01-05',
  validéPar: 'dreal@test.test',
};

export type DépôtExempleData = {
  type?: string;
  "date d'échéance"?: string;
  'date de constitution'?: string;
  format?: string;
  'contenu fichier'?: string;
  'date de soumission'?: string;
  'soumis par'?: string;
  'date de modification'?: string;
  'modifié par'?: string;
  'date de suppression'?: string;
  'supprimé par'?: string;
  'date de validation'?: string;
  'validé par'?: string;
};

export const getDépôtData = (
  identifiantProjet: IdentifiantProjet.ValueType,
  exemple: DépôtExempleData,
) => ({
  identifiantProjetValue: identifiantProjet.formatter(),
  typeValue: exemple.type ?? defaultDépôtData.typeGarantiesFinancières,
  dateÉchéanceValue: exemple[`date d'échéance`]
    ? new Date(exemple[`date d'échéance`]).toISOString()
    : defaultDépôtData.dateÉchéance,
  dateConstitutionValue: new Date(
    exemple[`date de constitution`] ?? defaultDépôtData.dateConstitution,
  ).toISOString(),
  attestationValue: {
    content: convertStringToReadableStream(
      exemple['contenu fichier'] ?? defaultDépôtData.contenuFichier,
    ),
    format: exemple.format ?? defaultDépôtData.format,
  },
  contenuFichier: exemple['contenu fichier'] ?? defaultDépôtData.contenuFichier,
  soumisParValue: exemple['soumis par'] ?? defaultDépôtData.soumisPar,
  soumisLeValue: new Date(
    exemple['date de soumission'] ?? defaultDépôtData.dateSoumission,
  ).toISOString(),
  modifiéLeValue: new Date(
    exemple['date de modification'] ?? defaultDépôtData.dateModification,
  ).toISOString(),
  modifiéParValue: exemple['modifié par'] ?? defaultDépôtData.modifiéPar,
  suppriméLeValue: new Date(
    exemple['date de suppression'] ?? defaultDépôtData.dateSuppression,
  ).toISOString(),
  suppriméParValue: exemple['supprimé par'] ?? defaultDépôtData.suppriméPar,
  validéLeValue: new Date(
    exemple['date de validation'] ?? defaultDépôtData.dateValidation,
  ).toISOString(),
  validéParValue: exemple['validé par'] ?? defaultDépôtData.validéPar,
});
