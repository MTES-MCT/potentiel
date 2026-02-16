import { z } from 'zod';

import {
  actionnariatSchema,
  dateEchéanceOuConstitutionGfSchema,
  emailContactSchema,
  évaluationCarboneSimplifiéeSchema,
  nomCandidatSchema,
  nomProjetSchema,
  nomReprésentantLégalSchema,
  prixRéférenceSchema,
  puissanceALaPointeSchema,
  puissanceOuPuissanceDeSiteSchema,
  sociétéMèreSchema,
  technologieSchema,
  typeGarantiesFinancieresSchema,
  choixCoefficientKSchema,
  historiqueAbandonSchema,
  obligationDeSolarisationSchema,
  optionalPuissanceOuPuissanceDeSiteSchema,
  autorisationDUrbanismeSchema,
  installateurSchema,
  natureDeLExploitationOptionalSchema,
  dispositifDeStockageSchema,
} from './candidatureFields.schema';
import { localitéSchema } from './localité.schema';
import { typologieInstallationSchema } from './typologieInstallation.schema';

export const dépôtSchema = z
  .object({
    nomProjet: nomProjetSchema,
    sociétéMère: sociétéMèreSchema,
    nomCandidat: nomCandidatSchema,
    puissance: puissanceOuPuissanceDeSiteSchema,
    prixReference: prixRéférenceSchema,
    nomReprésentantLégal: nomReprésentantLégalSchema,
    emailContact: emailContactSchema,
    puissanceALaPointe: puissanceALaPointeSchema,
    evaluationCarboneSimplifiée: évaluationCarboneSimplifiéeSchema,
    actionnariat: actionnariatSchema,
    technologie: technologieSchema,
    typeGarantiesFinancières: typeGarantiesFinancieresSchema,
    dateÉchéanceGf: dateEchéanceOuConstitutionGfSchema,
    dateConstitutionGf: dateEchéanceOuConstitutionGfSchema,
    coefficientKChoisi: choixCoefficientKSchema,
    historiqueAbandon: historiqueAbandonSchema,
    obligationDeSolarisation: obligationDeSolarisationSchema,
    puissanceDeSite: optionalPuissanceOuPuissanceDeSiteSchema,
    autorisationDUrbanisme: autorisationDUrbanismeSchema,
    installateur: installateurSchema,
    localité: localitéSchema,
    typologieInstallation: typologieInstallationSchema,
    dispositifDeStockage: dispositifDeStockageSchema,
    natureDeLExploitation: natureDeLExploitationOptionalSchema,
    puissanceProjetInitial: optionalPuissanceOuPuissanceDeSiteSchema,
  })
  .superRefine((data, ctx) => {
    const typeGF = data.typeGarantiesFinancières;
    if (typeGF === 'avec-date-échéance' && !data.dateÉchéanceGf) {
      ctx.addIssue({
        code: 'custom',
        message: `La date d'échéance des garanties financières est requise lorsque le type est "avec date d'échéance"`,
        path: ['dateÉchéanceGf'],
      });
    }

    if (typeGF !== 'avec-date-échéance' && data.dateÉchéanceGf) {
      ctx.addIssue({
        code: 'custom',
        message: `La date d'échéance des garanties financières ne doit pas être complétée lorsque le type n'est pas "avec date d'échéance"`,
        path: ['dateÉchéanceGf'],
      });
    }
  });
