import HewMotherClient from '@/app/hew/mother/[id]/HewMotherClient';

export default function HewMotherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <HewMotherClient params={params} />;
}
