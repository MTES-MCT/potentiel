import { CustomErrorPage } from '@/components/pages/custom-error/CustomError.page';

export default async function Page() {
  return <CustomErrorPage statusCode="500" type="ServerError" />;
}
