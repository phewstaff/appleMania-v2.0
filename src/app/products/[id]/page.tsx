import Header from "@/components/layout/Header";
import Products from "@/components/products/Products";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <Header backButton basket />
      <Products params={params} />
    </>
  );
};

export default page;
