import { Readable } from 'stream';

export type RemplacerAccuséRéceptionDemandeComplèteRaccordement = ({
  fichierASupprimerPath,
  nouveauFichier: { path, content },
}: {
  fichierASupprimerPath: string;
  nouveauFichier: {
    path: string;
    content: Readable;
  };
}) => Promise<void>;
