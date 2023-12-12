import { FC, FormHTMLAttributes } from 'react';

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLFormElement>;
};

export const Form: FC<FormProps> = ({ children, ref, ...formProps }) => (
  <form {...formProps} ref={ref}>
    <div className="text-sm italic mb-4">
      Sauf mention contraire "(optionnel)" dans le label, tous les champs sont obligatoires
    </div>
    {children}
  </form>
);
