import { renameFile } from '@potentiel-libraries/file-storage';

type FileToMove = {
  from: string;
  to: string;
};

type RenommerFichiersProps = {
  files: readonly FileToMove[];
};

export const renommerFichiers = async (props: RenommerFichiersProps) => {
  for (const file of props.files) {
    try {
      console.info(`Renaming ${file.from} to ${file.to}`);
      await renameFile(file.from, file.to);
      console.debug(`Renamed ${file.from} to ${file.to}`);
    } catch (e) {
      console.log(e);

      console.error(`Error while moving ${file.from}`, e);
    }
  }
  console.info(`Completed ${props.files.length} files`);
};
