import { CustomErrorPage } from '@/components/pages/custom-error/CustomErrorPage';

export default async function PageIntrouvable() {
  return <CustomErrorPage statusCode="404" type="NotFoundError" />;
}
