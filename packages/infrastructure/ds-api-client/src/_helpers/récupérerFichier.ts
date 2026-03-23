type RécupérerFichierProps = {
  attestation: {
    url: string;
    contentType: string;
  };
  dossierNumber: number;
};

export const récupérerFichier = async ({ attestation, dossierNumber }: RécupérerFichierProps) => {
  const fichier = await fetch(attestation.url);

  if (!fichier.ok) {
    throw new Error(
      `Impossible de récupérer l'attestation de garanties financières pour le dossier ${dossierNumber}`,
    );
  }

  if (!fichier.body) {
    throw new Error(
      `Le fichier de l'attestation de garanties financières est introuvable pour le dossier ${dossierNumber}`,
    );
  }
  return fichier;
};
