import { Lauréat } from '@potentiel-domain/projet';

export const mapToInstallateurImportéTimelineItemProps = (
  record: Lauréat.Installation.InstallationImportéeEvent,
) => {
  const { importéLe, installateur } = record.payload;
  return {
    date: importéLe,
    title: <div>Candidature : {<span className="font-semibold">{installateur}</span>}</div>,
  };
};
