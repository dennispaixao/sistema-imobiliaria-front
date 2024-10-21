import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "./productsApiSlice";
import { memo } from "react";

const Product = ({ productId }) => {
  const { product } = useGetProductsQuery("productsList", {
    selectFromResult: ({ data }) => ({
      product: data?.entities[productId],
    }),
  });

  const navigate = useNavigate();

  if (product) {
    const updated = new Date(product.updatedAt).toLocaleString("pt-BR", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => navigate(`/dash/products/${productId}`);
    const categoriesNames = product.categories.reduce((ac, cat) => {
      return ac + cat.name + ", ";
    }, "");
    console.log("categories", categoriesNames);
    return (
      <tr className="table__row">
        <td className="table__cell product__cod">{product.ticket}</td>
        <td className="table__cell product__title">{product.title}</td>
        <td className="table__cell product__categories">{categoriesNames}</td>
        <td className="table__cell product__updated">{updated}</td>
        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

const memoizedProduct = memo(Product);
export default memoizedProduct;
