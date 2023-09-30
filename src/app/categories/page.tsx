import Categories from "@/components/categories/Categories";
import Layout from "@/components/layout/Layout";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <Layout basket={true} backButton={true} title={"Categories"}>
      <Categories />
    </Layout>
  );
};

export default page;
