import { FC, FormHTMLAttributes } from 'react';

type FormTemplateProps = FormHTMLAttributes<HTMLFormElement> & {
  children: React.ReactNode;
};

export const FormTemplate: FC<FormTemplateProps> = ({ children, ...formProps }) => (
  <form {...formProps}>
    <div className="text-sm italic mb-4">
      Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
    </div>
    {children}
  </form>
);
