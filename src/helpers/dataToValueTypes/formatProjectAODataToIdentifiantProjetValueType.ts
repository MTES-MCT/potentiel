import { IdentifiantProjet } from '@potentiel-domain/common';

export const formatProjectAODataToIdentifiantProjetValueType = ({
  appelOffreId,
  periodeId,
  familleId,
  numeroCRE,
}: {
  appelOffreId: string;
  periodeId: string;
  familleId?: string;
  numeroCRE: string;
}) =>
  IdentifiantProjet.convertirEnValueType(`${appelOffreId}#${periodeId}#${familleId}#${numeroCRE}`);
