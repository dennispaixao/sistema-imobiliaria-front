import { useState, useEffect } from "react";
import {
  useUpdateCategorieMutation,
  useDeleteCategorieMutation,
} from "./categoriesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditCategorieForm = ({ categorie, users }) => {
  const { isAdmin } = useAuth();

  const [updateCategorie, { isLoading, isSuccess, isError, error }] =
    useUpdateCategorieMutation();

  const [
    deleteCategorie,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteCategorieMutation();

  const navigate = useNavigate();

  const [name, setName] = useState(categorie.name);
  const [userId, setUserId] = useState(categorie.user);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setName("");
      setUserId("");
      navigate("/dash/categories");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);

  const canSave = [name, userId].every(Boolean) && !isLoading;

  const onSaveCategorieClicked = async (e) => {
    if (canSave) {
      await updateCategorie({
        id: categorie.id,
        user: userId,
        name,
      });
    }
  };

  const onDeleteCategorieClicked = () => {
    if (window.confirm(`Deseja deletar a categoria ${categorie.name}?`)) {
      deleteCategorie({ id: categorie.id });
    }
  };

  const created = new Date(categorie.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(categorie.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validNameClass = !name ? "form__input--incomplete" : "";
  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deleteButton = null;
  if (isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteCategorieClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Categorie #{categorie.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveCategorieClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>
        <label className="form__label" htmlFor="categorie-name">
          name:
        </label>
        <input
          className={`form__input ${validNameClass}`}
          id="categorie-title"
          name="name"
          type="text"
          autoComplete="off"
          value={name}
          onChange={onNameChanged}
        />
        ASSIGNED TO:
        <div className="form__divider">
          <p className="form__created">
            Created:
            <br />
            {created}
          </p>
          <p className="form__updated">
            Updated:
            <br />
            {updated}
          </p>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditCategorieForm;
