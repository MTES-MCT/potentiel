import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { ProjetEntity } from '../projet.entity';
import { IdentifiantProjet } from '../..';

export type ListerProjetsEligiblesPreuveRecanditureReadModel = Array<{
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  nom: string;
  dateDésignation: DateTime.RawType;
}>;

export type RécupérerProjetsEligiblesPreuveRecanditurePort = (
  identifiantUtilisateur: string,
) => Promise<ReadonlyArray<ProjetEntity>>;

export type ListerProjetsEligiblesPreuveRecanditureDependencies = {
  récupérerProjetsEligiblesPreuveRecanditure: RécupérerProjetsEligiblesPreuveRecanditurePort;
};

export type ListerProjetsEligiblesPreuveRecanditureQuery = Message<
  'Candidature.Query.ListerProjetsEligiblesPreuveRecandidature',
  {
    identifiantUtilisateur: string;
  },
  ListerProjetsEligiblesPreuveRecanditureReadModel
>;

export const registerProjetsEligiblesPreuveRecanditureQuery = ({
  récupérerProjetsEligiblesPreuveRecanditure,
}: ListerProjetsEligiblesPreuveRecanditureDependencies) => {
  const handler: MessageHandler<ListerProjetsEligiblesPreuveRecanditureQuery> = async ({
    identifiantUtilisateur,
  }) => {
    const result = await récupérerProjetsEligiblesPreuveRecanditure(identifiantUtilisateur);

    return result.map(mapToReadModel);
  };

  mediator.register('Candidature.Query.ListerProjetsEligiblesPreuveRecandidature', handler);
};

const mapToReadModel = ({
  appelOffre,
  famille,
  nom,
  numéroCRE,
  période,
  dateDésignation,
}: ProjetEntity): ListerProjetsEligiblesPreuveRecanditureReadModel[number] => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(
    `${appelOffre}#${période}#${famille}#${numéroCRE}`,
  ),
  appelOffre,
  période,
  famille,
  numéroCRE,
  nom,
  dateDésignation,
});
