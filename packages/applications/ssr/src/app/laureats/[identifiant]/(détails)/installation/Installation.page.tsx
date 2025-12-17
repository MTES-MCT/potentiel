import { Heading2 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { NatureDeLExploitationSection } from './(sections)/(nature-de-l-exploitation)/NatureDeLExploitation.section';
import { AutorisationUrbanismeSection } from './(sections)/(autorisation-d-urbanisme)/AutorisationUrbanisme.section';
import { InstallationSection } from './(sections)/(installation)/Installation.section';

type Props = { identifiantProjet: string };

export const InstallationPage = ({ identifiantProjet }: Props) => (
  <ColumnPageTemplate
    heading={<Heading2>Installation</Heading2>}
    leftColumn={{
      children: <InstallationLeft identifiantProjet={identifiantProjet} />,
    }}
    rightColumn={{
      children: <InstallationRight identifiantProjet={identifiantProjet} />,
    }}
  />
);

const InstallationLeft = ({ identifiantProjet }: Props) => {
  return <InstallationSection identifiantProjet={identifiantProjet} />;
};

const InstallationRight = ({ identifiantProjet }: Props) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <AutorisationUrbanismeSection identifiantProjet={identifiantProjet} />
      <NatureDeLExploitationSection identifiantProjet={identifiantProjet} />
    </div>
  );
};
