import NewCategorieForm from "./NewCategorieForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import useAuth from "../../hooks/useAuth";
const NewCategorie = () => {
  useTitle("imobiliaria: criar anuncio");
  const [username] = useAuth();

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length) return <PulseLoader color={"#FFF"} />;

  const content = (
    <NewCategorieForm
      users={users.filter((user) => {
        return user.username === username;
      })}
    />
  );

  return content;
};
export default NewCategorie;
