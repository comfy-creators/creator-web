/** @format */

import GenerateForm from "@/components/generate-form";
import GenerateHeading from "@/components/generate-heading";

type Props = {
  searchParams: Promise<{ workflow?: string }>;
};

export default async function GeneratePage({ searchParams }: Props) {
  const { workflow } = await searchParams;
  return (
    <div className="mx-[12%] flex flex-col gap-10 py-10">
      <GenerateHeading workflowId={workflow ?? null} />
      <GenerateForm workflowId={workflow ?? null} />
    </div>
  );
}
