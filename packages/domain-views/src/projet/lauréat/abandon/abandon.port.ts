export type RécupérerPiéceJustificativeAbandonProjetPort = (
  identifiantProjet: string,
  format: string,
) => Promise<ReadableStream | undefined>;
