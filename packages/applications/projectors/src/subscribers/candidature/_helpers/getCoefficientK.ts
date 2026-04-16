import { AppelOffre } from '@potentiel-domain/appel-offre';
import { CahierDesCharges, Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

export const getCoefficientK = (
  appelOffre: AppelOffre.AppelOffreReadModel,
  identifiantProjet: IdentifiantProjet.ValueType,
  technologie: Candidature.TypeTechnologie.ValueType<AppelOffre.Technologie>,
  coefficientKChoisi?: boolean,
) => {
  const { période, famille } = getPériodeAndFamille(identifiantProjet, appelOffre);
  const cahierDesCharges = CahierDesCharges.bind({
    appelOffre,
    période,
    famille,
    technologie: technologie.type,
    cahierDesChargesModificatif: undefined,
  });

  const champCoefficientK = cahierDesCharges.getChampsSupplémentaires().coefficientKChoisi;
  return champCoefficientK?.type === 'défaut'
    ? champCoefficientK.valeur
    : coefficientKChoisi === undefined && champCoefficientK?.type === 'optionnel'
      ? champCoefficientK?.valeurParDéfaut
      : coefficientKChoisi;
};

const getPériodeAndFamille = (
  identifiantProjet: IdentifiantProjet.ValueType,
  appelOffre: AppelOffre.AppelOffreReadModel,
) => {
  const période = appelOffre.periodes.find((période) => période.id === identifiantProjet.période);

  if (!période) {
    throw new Error('Période non trouvée');
  }

  const famille = période.familles?.find((famille) => famille.id === identifiantProjet.famille);

  return { période, famille };
};
