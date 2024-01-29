import React, { FC } from 'react';
import { ProjetBanner, ProjetBannerProps } from '../molecules/projet/ProjetBanner';
import Alert from '@codegouvfr/react-dsfr/Alert';

type CommonPageTemplateProps = {
  heading: React.ReactNode;
  children?: React.ReactNode;
  form?: React.ReactNode;
  information?: {
    title?: string;
    description: React.ReactNode;
  };
};

export type PageTemplateProps = CommonPageTemplateProps &
  (
    | {
        type: 'projet';
        projet: ProjetBannerProps;
      }
    | {
        type: 'default';
      }
  );

export const PageTemplate: FC<PageTemplateProps> = (props) => {
  switch (props.type) {
    case 'projet':
      return (
        <>
          <Banner>
            <ProjetBanner {...props.projet} />
          </Banner>
          <Container form={props.form} information={props.information} heading={props.heading}>
            {props.children || null}
          </Container>
        </>
      );
    default:
      return (
        <>
          <Banner>{props.heading}</Banner>
          <Container form={props.form} information={props.information}>
            {props.children || null}
          </Container>
        </>
      );
  }
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
  children: CommonPageTemplateProps['children'];
  heading?: React.ReactNode;
  form?: CommonPageTemplateProps['form'];
  information?: CommonPageTemplateProps['information'];
};
const Container = ({ heading, children, form, information }: ContainerProps) => (
  <div className="fr-container my-10">
    {heading || null}
    {(form || information) && (
      <div className="flex flex-col md:flex-row gap-8">
        {form && <div className="flex-1 mt-6">{form}</div>}
        {information && (
          <div className="flex md:max-w-lg items-stretch">
            <Alert
              severity="info"
              small
              title={information.title}
              description={<div className="py-4 text-justify">{information.description}</div>}
            />
          </div>
        )}
      </div>
    )}
    {children}
  </div>
);
