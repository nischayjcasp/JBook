import ViewPost from "./ViewPost";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <ViewPost id={id} />;
};

export default Page;
