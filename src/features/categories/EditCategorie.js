import { useParams } from "react-router-dom";
import EditCategorieForm from "./EditCategorieForm";
import { useGetCategoriesQuery } from "./categoriesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditCategorie = () => {
  useTitle("techCategories: Edit Categorie");

  const { id } = useParams();

  const { username, isManager, isAdmin } = useAuth();

  const { categorie } = useGetCategoriesQuery("categoriesList", {
    selectFromResult: ({ data }) => ({
      categorie: data?.entities[id],
    }),
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!categorie || !users?.length) return <PulseLoader color={"#FFF"} />;

  if (!isManager && !isAdmin) {
    if (categorie.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditCategorieForm categorie={categorie} users={users} />;

  return content;
};
export default EditCategorie;
