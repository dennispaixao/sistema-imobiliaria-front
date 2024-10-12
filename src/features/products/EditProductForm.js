import { useState, useEffect } from "react";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "./productsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import { parseToNum, formatNumbers } from "../../utils/format";

const EditProductForm = ({ product, categories, username }) => {
  const { isAdmin } = useAuth();

  const [updateProduct, { isLoading, isSuccess, isError, error }] =
    useUpdateProductMutation();

  const [
    deleteProduct,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteProductMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(product.title);
  const [text, setText] = useState(product.text);
  const [status, setStatus] = useState(product.status);
  const [downpayment, setDownpayment] = useState(product.downpayment);
  const [price, setPrice] = useState(product.price);
  const [selectedCategories, setSelectedCategories] = useState(
    Array.isArray(product.categories) ? [...product.categories] : []
  );

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      navigate("/dash/products");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onPriceChanged = (e) => setPrice(formatNumbers(e.target.value));
  const onDownpaymentChanged = (e) =>
    setDownpayment(formatNumbers(e.target.value));
  const onStatusChanged = (e) => setStatus(e.target.value);
  const onCategoriesChange = (event) => {
    const category = event.target.value;
    if (event.target.checked) {
      // Adiciona a categoria ao array se for selecionada
      setSelectedCategories([...selectedCategories, category]);
    } else {
      // Remove a categoria do array se for desmarcada
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    }
  };

  const canSave = [title, text].every(Boolean) && !isLoading;

  const onSaveProductClicked = async (e) => {
    if (canSave) {
      console.log(
        product._id,
        title,
        text,
        downpayment,
        status,
        price,
        selectedCategories
      );
      const response = await updateProduct({
        id: product._id,
        title,
        text,
        downpayment,
        status,
        price,
        categories: selectedCategories,
      });
      console.log(response);
    }
  };

  const onDeleteProductClicked = async () => {
    await deleteProduct({ id: product.id });
  };

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deleteButton = null;
  if (isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteProductClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const created = new Date(product.createdAt).toLocaleString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(product.updatedAt).toLocaleString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Product #{product.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveProductClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          className={`form__input form__input--status`}
          value={status}
          onChange={onStatusChanged}
        >
          <option value="1">À venda</option>
          <option value="2">Vendido</option>
        </select>
        <label className="form__label" htmlFor="text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />
        <label className="form__label" htmlFor="downpayment">
          Entrada:
        </label>
        <input
          className={`form__input `}
          id="downpayment"
          name="downpayment"
          type="text"
          autoComplete="off"
          value={downpayment}
          onChange={onDownpaymentChanged}
        />
        <label className="form__label" htmlFor="price">
          Valor:
        </label>
        <input
          className={`form__input `}
          id="price"
          name="price"
          type="text"
          autoComplete="off"
          value={price}
          onChange={onPriceChanged}
        />
        {categories?.map((category, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={category.id}
              checked={selectedCategories?.includes(category.id)}
              value={category.id}
              onChange={onCategoriesChange}
            />
            <label htmlFor={category}>{category.name}</label>
          </div>
        ))}
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
        ASSIGNED TO:
        <p>{username} </p>
      </form>
    </>
  );

  return content;
};

export default EditProductForm;
