import NewProductForm from "./NewProductForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetCategoriesQuery } from "../categories/categoriesApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const NewProduct = () => {
  useTitle("imobiliaria: criar anuncio");

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });
  const { categories } = useGetCategoriesQuery("categoriesList", {
    selectFromResult: ({ data }) => ({
      categories: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length || !categories?.length)
    return <PulseLoader color={"#FFF"} />;

  const content = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link className="button icon-button" to="/dash/products">
        <FontAwesomeIcon icon={faBackward} />
      </Link>
      <NewProductForm users={users} categories={categories} />
    </div>
  );

  return content;
};
export default NewProduct;
