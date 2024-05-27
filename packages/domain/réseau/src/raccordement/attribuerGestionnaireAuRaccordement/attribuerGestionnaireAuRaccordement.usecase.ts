import { Message, MessageHandler, mediator } from 'mediateur';

export type AttribuerGestionnaireAuRaccordementUseCase = Message<
  'Réseau.Gestionnaire.UseCase.AttribuerGestionnaireAuRaccordement',
  {
    identifiantGestionnaireRéseauValue: string;
    projet: {
      identifiantProjetValue: string;
      appelOffreValue: string;
      périodeValue: string;
      familleValue: string;
      numéroCREValue: string;
    };
  }
>;

export const registerAttribuerGestionnaireAuRaccordementUseCase = () => {
  const handler: MessageHandler<AttribuerGestionnaireAuRaccordementUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    projet,
  }) => {
    console.log('🤘🏻', identifiantGestionnaireRéseauValue, projet);
    // await mediator.send<GestionnaireRéseau.Attr>()
    // const commandParams = {
    //   identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
    //     identifiantGestionnaireRéseauValue,
    //   ),
    //   projet: {
    //     ...projet,
    //     identifiantProjet: IdentifiantProjet.convertirEnValueType(projet.identifiantProjetValue),
    //   },
    // };
    // appeler la commande
  };

  mediator.register('Réseau.Gestionnaire.UseCase.AttribuerGestionnaireAuRaccordement', handler);
};
