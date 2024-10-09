import { useParams } from "react-router-dom";
import EditProductForm from "./EditProductForm";
import { useGetProductsQuery } from "./productsApiSlice";
import { useGetCategoriesQuery } from "../categories/categoriesApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditProduct = () => {
  useTitle("techProducts: Edit Product");

  const { id } = useParams();

  const { username, isManager, isAdmin } = useAuth();

  const { product } = useGetProductsQuery("productsList", {
    selectFromResult: ({ data }) => ({
      product: data?.entities[id],
    }),
  });

  const { categories } = useGetCategoriesQuery("categoriesList", {
    selectFromResult: ({ data }) => ({
      categories: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!product || !categories?.length) return <PulseLoader color={"#FFF"} />;

  if (!isManager && !isAdmin) {
    if (product.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = (
    <EditProductForm
      product={product}
      categories={categories}
      username={username}
    />
  );

  return content;
};
export default EditProduct;
