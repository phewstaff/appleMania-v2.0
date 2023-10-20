import Header from "@/components/layout/Header";
import Products from "@/components/products/Products";

const page = ({ params }: { params: { categoryId: string } }) => {
  return (
    <>
      <Header backButton basket />
      <Products id={params.categoryId} />
    </>
  );
};

export default page;
