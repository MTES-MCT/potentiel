import { FC } from 'react';
import { ProjetBanner, ProjetBannerProps } from '../molecules/projet/ProjetBanner';
import { Heading1 } from '../atoms/headings';

export type PageTemplateProps =
  | {
      type: 'projet';
      projet: ProjetBannerProps;
      heading: React.ReactNode;
      children: React.ReactNode;
    }
  | {
      type: 'default';
      banner: React.ReactNode;
      children: React.ReactNode;
    };

type BannerProps = {
  children: React.ReactNode;
};
const Banner = ({ children }: BannerProps) => (
  <div className="bg-blue-france-sun-base text-white py-6 mb-3">
    <div className="fr-container">{children}</div>
  </div>
);

type ContainerProps = {
  children: React.ReactNode;
};
const Container = ({ children }: ContainerProps) => (
  <div className="fr-container my-10">{children}</div>
);

export const PageTemplate: FC<PageTemplateProps> = (props) => {
  switch (props.type) {
    case 'projet':
      return (
        <>
          <Banner>
            <ProjetBanner {...props.projet} />
          </Banner>
          <Container>
            <Heading1 className="mt-0 mb-8">{props.heading}</Heading1>
            {props.children}
          </Container>
        </>
      );
    default:
      return (
        <>
          <Banner>{props.banner}</Banner>
          <Container>{props.children}</Container>
        </>
      );
  }
};
