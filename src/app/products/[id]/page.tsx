import Products from "@/components/products/Products";

const page = ({ params }: { params: { categoryId: string } }) => {
  return <Products id={params.categoryId} />;
};

export default page;
