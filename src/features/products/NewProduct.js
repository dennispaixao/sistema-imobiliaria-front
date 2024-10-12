import NewProductForm from "./NewProductForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetCategoriesQuery } from "../categories/categoriesApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

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

  const content = <NewProductForm users={users} categories={categories} />;

  return content;
};
export default NewProduct;
