import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewProductMutation } from "./productsApiSlice";
import { useAddNewImageMutation } from "../images/imagesApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { formatNumbers } from "../../utils/format";

const NewProductForm = ({ users, categories }) => {
  useTitle("Novo Produto");
  const { username, isAdmin } = useAuth();
  const [addNewProduct, { isLoading, isSuccess, isError, error }] =
    useAddNewProductMutation();
  const [
    addNewImages,
    {
      isLoading: isLoadingImage,
      isSuccess: isSucessImage,
      isError: isErrorImage,
      error: errorImage,
    },
  ] = useAddNewImageMutation();

  const navigate = useNavigate();
  const { data: userToFilter } = useGetUsersQuery("usersList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Estado para armazenar os arquivos e as pré-visualizações
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState(1);
  const [downpayment, setDownpayment] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (isSuccess && isSucessImage) {
      setTitle("");
      setText("");
      setUserId("");
      setStatus(1);
      setDownpayment(null);
      setPrice(0);
      setSelectedImages([]);
      setSelectedImagePreviews([]);
      navigate("/dash/products");
    }
  }, [isSuccess, isSucessImage, navigate]);

  useEffect(() => {
    const { ids: idsUsers, entities: entitiesUsers } = userToFilter;
    let userIdentifier = idsUsers.find(
      (i) => entitiesUsers[i].username === username
    );
    setUserId(userIdentifier);
  }, [userToFilter, username]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onStatusChanged = (e) => setStatus(e.target.value);
  const onDownPaymentChanged = (e) => {
    setDownpayment(formatNumbers(e.target.value));
  };
  const onPriceChanged = (e) => {
    setPrice(formatNumbers(e.target.value));
  };

  const handleCheckboxChange = (event) => {
    const category = event.target.value;
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e); // Certifique-se de que aqui você está recebendo arquivos

    // Atualiza o estado de imagens com os novos arquivos
    setSelectedImages((prevImages) => [...prevImages, ...files]);

    // Gera as pré-visualizações e atualiza o estado
    const imagePreviews = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    });

    Promise.all(imagePreviews).then((images) => {
      setSelectedImagePreviews((prevPreviews) => [...prevPreviews, ...images]);
    });
  };

  // Função para deletar imagem da lista
  const handleDeleteImage = (indexToDelete) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToDelete)
    );
    setSelectedImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleImageUpload = async () => {
    const formData = new FormData();

    // Adiciona cada imagem ao FormData com o campo "images"
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await addNewImages(formData).unwrap();
      // Supondo que a resposta contém um array de URLs em response.urls
      return response.urls || []; // Retorna as URLs ou um array vazio
    } catch (err) {
      console.error("Erro ao enviar as imagens:", err);
      return []; // Retorna um array vazio em caso de erro
    }
  };
  const canSave = [title, text, userId, status].every(Boolean) && !isLoading;

  const onSaveProductClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        const imageUploadResult = await handleImageUpload(); // Aguarda a resolução da promessa

        console.log("Resultado do upload de imagem:", imageUploadResult);

        // Verifica se imageUploadResult é um array de strings
        if (
          !Array.isArray(imageUploadResult) ||
          !imageUploadResult.every((url) => typeof url === "string")
        ) {
          throw new Error(
            "O resultado do upload da imagem é inválido ou não é um array de strings."
          );
        }

        await addNewProduct({
          user: userId,
          title,
          text,
          status,
          price,
          downpayment,
          categories: selectedCategories,
          images: imageUploadResult, // Usa as URLs retornadas aqui
        }).unwrap();

        console.log("Produto adicionado com sucesso!");
        navigate("/dash/products");
      } catch (err) {
        console.error("Erro ao adicionar produto ou imagens:", err);
      }
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

      {selectedImagePreviews.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
          {selectedImagePreviews.map((image, index) => (
            <div
              key={index}
              style={{
                marginRight: "10px",
                marginBottom: "10px",
                position: "relative",
              }}
            >
              <img
                src={image}
                alt={`Pré-visualização ${index + 1}`}
                style={{ width: "150px", height: "auto" }}
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(index)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={faTrash} style={{ color: "red" }} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form className="form" onSubmit={onSaveProductClicked}>
        <input
          type="file"
          onChange={(e) => handleImageChange(e.target.files)}
          accept="image/*"
          multiple
        />

        <div className="form__title-row">
          <h2>Novo Produto</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <label className="form__label" htmlFor="title">
          Título:
        </label>
        <input
          multiple
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
          Texto:
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
          className={`form__input`}
          id="downpayment"
          name="downpayment"
          type="text"
          autoComplete="off"
          value={downpayment}
          onChange={onDownPaymentChanged}
        />

        <label className="form__label" htmlFor="price">
          Valor:
        </label>
        <input
          className={`form__input`}
          id="price"
          name="price"
          type="text"
          autoComplete="off"
          value={price}
          onChange={onPriceChanged}
        />

        <fieldset>
          <legend>Categorias</legend>
          {categories?.map((category, index) => (
            <div key={index}>
              <label className="custom-checkbox" htmlFor={category.id}>
                {category.name}
                <input
                  type="checkbox"
                  id={category.id}
                  value={category.id}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          ))}
        </fieldset>

        <p>ASSIGNED TO:</p>
        <p>{username}</p>
        <input type="hidden" name="user" value={userId} />
      </form>
    </>
  );

  return content;
};

export default NewProductForm;
