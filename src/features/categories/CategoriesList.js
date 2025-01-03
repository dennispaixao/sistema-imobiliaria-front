import { useGetCategoriesQuery } from "./categoriesApiSlice";
import Categorie from "./Categorie";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
const CategoriesList = () => {
  useTitle("imobiliaria: Categories List");
  const { data: userToFilter } = useGetUsersQuery("usersList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [selectedCategorie, setSelectedCategorie] = useState("");
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
    content = (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link className="button icon-button" to="/dash/">
            <FontAwesomeIcon icon={faBackward} />
          </Link>
          <Link className="button" to="/dash/categories/new">
            Adicionar nova categoria
          </Link>
        </div>
        <p className="errmsg">{error?.data?.message}</p>
      </div>
    );
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
      filteredIds
        ?.filter((id) =>
          entities[id].name
            .toLowerCase()
            .includes(selectedCategorie.toLowerCase())
        )
        .map((categorieId) => (
          <Categorie key={categorieId} categorieId={categorieId} />
        ));
    const handleCategorieChange = (event) => {
      setSelectedCategorie(event.target.value);
    };
    content = (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link className="button icon-button" to="/dash/">
            <FontAwesomeIcon icon={faBackward} />
          </Link>
          <Link className="button" to="/dash/categories/new">
            Adicionar nova categoria
          </Link>
        </div>

        <label htmlFor="searchCategories" className={"offScreen"}>
          Procurar por categoria
        </label>
        <input
          type="text"
          name="search"
          id="searchCategories"
          placeholder="Buscar Categorias"
          className={`form__input`}
          value={selectedCategorie}
          onChange={(e) => handleCategorieChange(e)}
        />
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
      </div>
    );
  }

  return content;
};
export default CategoriesList;
