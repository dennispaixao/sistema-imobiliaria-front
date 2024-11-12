import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
const UsersList = () => {
  const [searchBoxInput, setSearchBoxInput] = useState("");
  const { isAdmin } = useAuth();
  useTitle("Lista de usuários");
  const navigate = useNavigate();

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = isAdmin && (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link className="button icon-button" to="/dash/">
            <FontAwesomeIcon icon={faBackward} />
          </Link>
          <Link className="button" to="/dash/users/new">
            Adicionar novo usuário
          </Link>
        </div>
        <p className="errmsg">{error?.data?.message}</p>
      </div>
    );
  }

  if (isSuccess) {
    const { ids, entities } = users;

    const tableContent =
      isAdmin &&
      ids?.length &&
      ids
        .filter((id) =>
          entities[id].username
            .toLowerCase()
            .startsWith(searchBoxInput.toLowerCase())
        )
        .map((userId) => <User key={userId} userId={userId} />);

    const handleUserChange = (event) => {
      setSearchBoxInput(event.target.value);
    };
    content = isAdmin && (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link className="button icon-button" to="/dash/">
            <FontAwesomeIcon icon={faBackward} />
          </Link>
          <Link className="button" to="/dash/users/new">
            Adicionar novo usuário
          </Link>
        </div>
        <label htmlFor="searchUsers" className={"offScreen"}>
          Procurar por usuarios
        </label>
        <input
          type="text"
          name="search"
          id="searchUsers"
          placeholder="Buscar Usuarios"
          className={`form__input`}
          value={searchBoxInput}
          onChange={(e) => handleUserChange(e)}
        />
        <table className="table table--users">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th user__username">
                Usuário
              </th>
              <th scope="col" className="table__th user__roles">
                Permições
              </th>
              <th scope="col" className="table__th user__edit">
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
export default UsersList;
