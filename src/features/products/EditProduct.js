import { useParams } from "react-router-dom";
import EditProductForm from "./EditProductForm";
import { useGetProductsQuery, useGetProductById } from "./productsApiSlice";
import { useGetCategoriesQuery } from "../categories/categoriesApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import { useNavigate } from "react-router-dom";

const EditProduct = () => {
  const navigate = useNavigate();
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
  const clickBackButton = () => {
    navigate("/dash/products");
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button className="button" onClick={clickBackButton}>
        voltar para produtos
      </button>

      <EditProductForm
        product={product}
        categories={categories}
        username={username}
      />
    </div>
  );

  return content;
};
export default EditProduct;
