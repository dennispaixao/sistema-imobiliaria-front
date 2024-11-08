import { useParams } from "react-router-dom";
import EditProductForm from "./EditProductForm";
import { useGetProductsQuery } from "./productsApiSlice";
import { useGetCategoriesQuery } from "../categories/categoriesApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link className="button icon-button" to="/dash/products">
        <FontAwesomeIcon icon={faBackward} />
      </Link>

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
