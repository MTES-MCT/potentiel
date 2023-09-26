type EnregistrerPiéceJustificativeAbandonOptions = {
  identifiantProjet: string;
  piéceJustificative: { format: string; content: ReadableStream };
};

export type EnregistrerPiéceJustificativeAbandonPort = (
  options: EnregistrerPiéceJustificativeAbandonOptions,
) => Promise<void>;
