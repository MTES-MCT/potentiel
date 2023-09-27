type EnregistrerPiéceJustificativeAbandonOptions = {
  identifiantProjet: string;
  piéceJustificative: { format: string; content: ReadableStream };
};

export type EnregistrerPiéceJustificativeAbandonPort = (
  options: EnregistrerPiéceJustificativeAbandonOptions,
) => Promise<void>;

type EnregistrerRéponseSignéeOptions = {
  identifiantProjet: string;
  réponseSignée: { format: string; content: ReadableStream };
};

export type EnregistrerRéponseSignéePort = (
  options: EnregistrerRéponseSignéeOptions,
) => Promise<void>;
