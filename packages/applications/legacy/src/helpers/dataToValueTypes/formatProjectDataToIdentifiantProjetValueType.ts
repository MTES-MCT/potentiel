import { IdentifiantProjet } from '@potentiel-domain/projet';

export const formatProjectDataToIdentifiantProjetValueType = ({
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
  IdentifiantProjet.convertirEnValueType(
    `${appelOffreId}#${periodeId}#${familleId ?? ''}#${numeroCRE}`,
  );
