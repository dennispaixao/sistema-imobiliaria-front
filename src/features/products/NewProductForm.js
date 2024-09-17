import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewProductMutation } from "./productsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../users/usersApiSlice";

const NewProductForm = ({ users, categories }) => {
  const { username, isManager, isAdmin } = useAuth();
  const [addNewProduct, { isLoading, isSuccess, isError, error }] =
    useAddNewProductMutation();

  const navigate = useNavigate();

  const { data: userToFilter } = useGetUsersQuery("usersList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState(1);
  const [downPayment, setDownPayment] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      setStatus(1);
      setDownPayment(null);
      setPrice(0);
      navigate("/dash/products");
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    const { ids: idsUsers, entities: entitiesUsers } = userToFilter;
    let userIdentifier = idsUsers.find(
      (i) => entitiesUsers[i].username === username
    );
    setUserId(userIdentifier);
  }, [userToFilter, username]);
  const formatNumbers = (value) => {
    let digits = value.replace(/\D/g, "");
    let result = digits;
    if (digits.length > 2) {
      result = digits.slice(0, -2) + "," + digits.slice(-2);
    }
    if (digits.length > 5) {
      result =
        digits.slice(0, -5) +
        "." +
        digits.slice(-5, -2) +
        "," +
        digits.slice(-2);
    }
    if (digits.length > 8) {
      result =
        digits.slice(0, -8) +
        "." +
        digits.slice(-8, -5) +
        "." +
        digits.slice(-5, -2) +
        "," +
        digits.slice(-2);
    }
    return result;
  };
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onStatusChanged = (e) => setStatus(e.target.value);
  const onDownPaymentChanged = (e) => {
    setDownPayment(formatNumbers(e.target.value));
  };
  const onPriceChanged = (e) => {
    setPrice(formatNumbers(e.target.value));
  };
  const handleCheckboxChange = (event) => {
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

  const canSave = [title, text, userId, status].every(Boolean) && !isLoading;

  const parseToNum = (text) => {
    text = text.replace(".", "");
    text = text.replace(",", ".");
    return parseFloat(text);
  };
  const onSaveProductClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      console.log({
        user: userId,
        title,
        text,
        status,
        downpayment: parseToNum(downPayment),
        categories: selectedCategories,
      });
      await addNewProduct({
        user: userId,
        title,
        text,
        status,
        price: parseToNum(price),
        downpayment: parseToNum(downPayment),
        categories: selectedCategories,
      });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";
  const validStatusClass = !status ? "form__input--incomplete" : "";

  const content = !isAdmin ? (
    <h3 className={errClass}>{error?.data?.message}</h3>
  ) : (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveProductClicked}>
        <div className="form__title-row">
          <h2>New Product</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
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
          className={`form__input form__input--status ${validStatusClass}`}
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
          value={downPayment}
          onChange={onDownPaymentChanged}
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
              value={category.id}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={category}>{category.name}</label>
          </div>
        ))}
        <label
          className="form__label form__checkbox-container"
          htmlFor="username"
        >
          ASSIGNED TO:
        </label>
        <p>{username} </p>
        <input type="hidden" name="user" value={userId} />
      </form>
    </>
  );

  return content;
};

export default NewProductForm;
