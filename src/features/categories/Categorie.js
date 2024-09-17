import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "./categoriesApiSlice";
import { memo } from "react";

const Product = ({ productId }) => {
  const { product } = useGetProductsQuery("productsList", {
    selectFromResult: ({ data }) => ({
      product: data?.entities[productId],
    }),
  });

  const navigate = useNavigate();

  if (product) {
    const created = new Date(product.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(product.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => navigate(`/dash/products/${productId}`);

    return (
      <tr className="table__row">
        <td className="table__cell product__title">{product.title}</td>
        <td className="table__cell product__created">{created}</td>
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
