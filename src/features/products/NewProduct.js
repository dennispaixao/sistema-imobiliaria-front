import NewProductForm from "./NewProductForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetCategoriesQuery } from "../categories/categoriesApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  useTitle("imobiliaria: criar anuncio");
  const navigate = useNavigate();

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
  const clickBackButton = () => {
    navigate("/dash/products");
  };

  if (!users?.length || !categories?.length)
    return <PulseLoader color={"#FFF"} />;

  const content = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button className="button" onClick={clickBackButton}>
        voltar para produtos
      </button>
      <NewProductForm users={users} categories={categories} />
    </div>
  );

  return content;
};
export default NewProduct;
