import { Heading1 } from '../atoms/headings';

export const PageTemplate = ({
  heading1,
  children,
}: {
  heading1: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="bg-blue-france-sun-base text-white py-6 mb-3">
        <Heading1 className="text-white fr-container">{heading1}</Heading1>
      </div>
      <div className="fr-container my-10">{children}</div>
    </>
  );
};
