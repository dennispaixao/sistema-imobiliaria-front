import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewCategorieMutation } from "./categoriesApiSlice";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

const NewCategorieForm = ({ users }) => {
  const { username, isAdmin } = useAuth();
  const [addNewCategorie, { isLoading, isSuccess, isError, error }] =
    useAddNewCategorieMutation();

  const navigate = useNavigate();

  const { data: userToFilter } = useGetUsersQuery("usersList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setName("");
      navigate("/dash/categories");
    }
  }, [isSuccess, navigate]);

  const onNameChanged = (e) => {
    setName(e.target.value);
  };

  useEffect(() => {
    const { ids: idsUsers, entities: entitiesUsers } = userToFilter;
    let userIdentifier = idsUsers.find(
      (i) => entitiesUsers[i].username === username
    );
    setUserId(userIdentifier);
  }, [userToFilter, username]);

  const canSave = [name].every(Boolean) && !isLoading;
  const onSaveCategorieClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewCategorie({
        name,
        user: userId,
      });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validNameClass = !name ? "form__input--incomplete" : "";

  const content = !isAdmin ? (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link className="button icon-button" to="/dash/categories">
        <FontAwesomeIcon icon={faBackward} />
      </Link>
      <h3 className={errClass}>{error?.data?.message}</h3>
    </div>
  ) : (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link className="button icon-button" to="/dash/categories">
        <FontAwesomeIcon icon={faBackward} />
      </Link>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveCategorieClicked}>
        <div className="form__title-row">
          <h2>New Categorie</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="name">
          Name:
        </label>
        <input
          className={`form__input`}
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          value={name}
          onChange={onNameChanged}
        />
        ASSIGNED TO:
        <p>{username} </p>
        <input type="hidden" name="user" value={userId} />
      </form>
    </div>
  );

  return content;
};

export default NewCategorieForm;
