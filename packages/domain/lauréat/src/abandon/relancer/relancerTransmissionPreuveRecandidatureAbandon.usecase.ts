import { Message, MessageHandler, mediator } from 'mediateur';

export type RelancerTransmissionPreuveRecandidatureAbandonUseCase = Message<
  'RELANCER_TRANSMISSION_PREUVE_RECANDIDATURE_USECASE',
  {
    identifiantProjetValue: string;
    dateRelanceValue: string;
  }
>;

export const registerRelancerTransmissionPreuveRecandidatureAbandonUseCase = () => {
  const runner: MessageHandler<RelancerTransmissionPreuveRecandidatureAbandonUseCase> = async ({
    identifiantProjetValue,
    dateRelanceValue,
  }) => {
    // const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    // const preuveRecandidature = IdentifiantProjet.convertirEnValueType(preuveRecandidatureValue);
    // const dateNotification = DateTime.convertirEnValueType(dateNotificationValue);
    // const utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateurValue);
    // await mediator.send<TransmettrePreuveRecandidatureCommand>({
    //   type: 'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_COMMAND',
    //   data: {
    //     identifiantProjet,
    //     preuveRecandidature,
    //     dateNotification,
    //     utilisateur,
    //   },
    // });
  };
  mediator.register('RELANCER_TRANSMISSION_PREUVE_RECANDIDATURE_USECASE', runner);
};
