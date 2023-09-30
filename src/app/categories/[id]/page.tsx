import { FC } from "react";

const page = ({ params }: { params: { id: string } }) => {
  return <div>Category {params.id}</div>;
};

export default page;
