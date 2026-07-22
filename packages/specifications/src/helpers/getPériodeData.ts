import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

export const getPériodeData = ({
  appelOffresId,
  périodeId,
}: {
  appelOffresId: string;
  périodeId: string;
}) => {
  const appelOffresDetails = appelsOffreData.find((ao) => ao.id === appelOffresId);
  return appelOffresDetails?.periodes.find((p) => p.id === périodeId);
};
