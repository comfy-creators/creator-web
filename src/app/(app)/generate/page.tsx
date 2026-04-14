/** @format */

import GenerateForm from "@/components/generate-form";

type Props = {
  searchParams: Promise<{ workflow?: string }>;
};

export default async function GeneratePage({ searchParams }: Props) {
  const { workflow } = await searchParams;
  return <GenerateForm workflowId={workflow ?? null} />;
}
