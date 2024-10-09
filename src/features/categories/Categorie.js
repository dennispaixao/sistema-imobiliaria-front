import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "./categoriesApiSlice";
import { memo } from "react";

const Categorie = ({ categorieId }) => {
  const { categorie } = useGetCategoriesQuery("categoriesList", {
    selectFromResult: ({ data }) => ({
      categorie: data?.entities[categorieId],
    }),
  });

  const navigate = useNavigate();

  if (categorie) {
    const created = new Date(categorie.createdAt).toLocaleString("pt-BR", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(categorie.updatedAt).toLocaleString("pt-BR", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => navigate(`/dash/categories/${categorieId}`);

    return (
      <tr className="table__row">
        <td className="table__cell categorie__title">{categorie.name}</td>
        <td className="table__cell categorie__created">{created}</td>
        <td className="table__cell categorie__updated">{updated}</td>
        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

const memoizedCategorie = memo(Categorie);

export default memoizedCategorie;
