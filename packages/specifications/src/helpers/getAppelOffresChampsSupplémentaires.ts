import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

export const getAppelOffresChampsSupplémentaires = ({
  appelOffresId,
  périodeId,
}: {
  appelOffresId: string;
  périodeId: string;
}) => {
  const appelOffresDetails = appelsOffreData.find((ao) => ao.id === appelOffresId);
  const périodeDetails = appelOffresDetails?.periodes.find((p) => p.id === périodeId);
  return {
    ...appelOffresDetails?.champsSupplémentaires,
    ...périodeDetails?.champsSupplémentaires,
  };
};
