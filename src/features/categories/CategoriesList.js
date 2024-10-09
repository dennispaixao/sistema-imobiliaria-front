import { useGetCategoriesQuery } from "./categoriesApiSlice";
import Categorie from "./Categorie";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { Link } from "react-router-dom";
const CategoriesList = () => {
  useTitle("imobiliaria: Categories List");
  const { data: userToFilter } = useGetUsersQuery("usersList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { username, isManager, isAdmin } = useAuth();

  const {
    data: categories,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCategoriesQuery("categoriesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = categories;

    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      const { ids: idsUsers, entities: entitiesUsers } = userToFilter;
      let userId = idsUsers.find((i) => entitiesUsers[i].username === username);
      filteredIds = ids.filter((i) => entities[i].user === userId);
    }

    const tableContent =
      ids?.length &&
      filteredIds?.map((categorieId) => (
        <Categorie key={categorieId} categorieId={categorieId} />
      ));

    content = (
      <>
        <p>
          <Link to="/dash/categories/new">Adicionar nova categoria</Link>
        </p>

        <table className="table table--categories">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th categorie__title">
                Nome
              </th>
              <th scope="col" className="table__th categorie__created">
                Criada
              </th>
              <th scope="col" className="table__th categorie__updated">
                Alterada
              </th>
              <th scope="col" className="table__th categorie__edit">
                Editar
              </th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
      </>
    );
  }

  return content;
};
export default CategoriesList;
