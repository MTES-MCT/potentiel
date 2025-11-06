import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { DocumentProjet, IdentifiantProjet } from '../../../..';
import { ChangementFournisseurEntity } from '../changementFournisseur.entity';
import { Fournisseur, TypeDocumentFournisseur } from '../..';

export type ConsulterChangementFournisseurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;

  changement: {
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    évaluationCarboneSimplifiée?: number;
    fournisseurs?: Array<Fournisseur.ValueType>;
    raison: string;
    pièceJustificative: DocumentProjet.ValueType;
  };
};

export type ConsulterChangementFournisseurQuery = Message<
  'Lauréat.Fournisseur.Query.ConsulterChangementFournisseur',
  {
    identifiantProjet: string;
    enregistréLe: string;
  },
  Option.Type<ConsulterChangementFournisseurReadModel>
>;

export type ConsulterChangementFournisseurDependencies = {
  find: Find;
};

export const registerConsulterChangementFournisseurQuery = ({
  find,
}: ConsulterChangementFournisseurDependencies) => {
  const handler: MessageHandler<ConsulterChangementFournisseurQuery> = async ({
    identifiantProjet,
    enregistréLe,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const demandeChangementFournisseur = await find<ChangementFournisseurEntity>(
      `changement-fournisseur|${identifiantProjetValueType.formatter()}#${enregistréLe}`,
    );

    return Option.match(demandeChangementFournisseur).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Fournisseur.Query.ConsulterChangementFournisseur', handler);
};

export const mapToReadModel = (result: ChangementFournisseurEntity) => {
  if (!result) {
    return Option.none;
  }

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),

    changement: {
      enregistréLe: DateTime.convertirEnValueType(result.changement.enregistréLe),
      enregistréPar: Email.convertirEnValueType(result.changement.enregistréPar),
      fournisseurs: result.changement.fournisseurs?.map(Fournisseur.convertirEnValueType),
      évaluationCarboneSimplifiée: result.changement.évaluationCarboneSimplifiée,
      raison: result.changement.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        result.identifiantProjet,
        TypeDocumentFournisseur.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(result.changement.enregistréLe).formatter(),
        result.changement.pièceJustificative?.format,
      ),
    },
  } satisfies ConsulterChangementFournisseurReadModel;
};
