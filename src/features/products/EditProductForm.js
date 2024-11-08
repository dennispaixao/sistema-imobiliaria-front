import { useState, useEffect } from "react";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "./productsApiSlice";
import {
  useAddNewImageMutation,
  useDeleteImageMutation,
} from "../images/imagesApiSlice";

import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan, faTrash } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import { formatNumbers } from "../../utils/format";

const EditProductForm = ({ product, categories, username }) => {
  const { isAdmin } = useAuth();

  const [updateProduct, { isLoading, isSuccess, isError, error }] =
    useUpdateProductMutation();

  const [
    deleteProduct,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteProductMutation();
  const [addNewImages, { isSuccess: isSuccessImage }] =
    useAddNewImageMutation();
  const [deleteImages] = useDeleteImageMutation();

  const navigate = useNavigate();
  const [initialImages, setInitialImages] = useState(
    Array.isArray(product.images) ? [...product.images] : []
  );
  const [deletedImagesfromInitial, setDeletedImagesFromInitial] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState([]);

  const [userId, setUserId] = useState(product.user.id);
  const [title, setTitle] = useState(product.title);
  const [text, setText] = useState(product.text);
  const [status, setStatus] = useState(product.status);
  const [downpayment, setDownpayment] = useState(product.downpayment);
  const [price, setPrice] = useState(product.price);
  const [selectedCategories, setSelectedCategories] = useState(
    Array.isArray(product.categories)
      ? [...product.categories].map((cat) => cat._id)
      : []
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
  useEffect(() => {
    if (isSuccess && isSuccessImage) {
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
  }, [isSuccess, isSuccessImage, isDelSuccess, navigate]);

  // Função para deletar imagem da lista
  const handleDeleteImage = (indexToDelete) => {
    // Atualiza a lista de imagens selecionadas e as pré-visualizações
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToDelete)
    );
    setSelectedImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToDelete)
    );
  };

  useEffect(() => {
    console.log("deletedImagesFromInitial:", deletedImagesfromInitial);
  }, [deletedImagesfromInitial]);

  useEffect(() => {
    console.log("Initial images:", initialImages);
  }, [initialImages]);
  const handleDeleteImageInitial = (image) => {
    // Atualiza a lista de imagens deletadas inicialmente
    setDeletedImagesFromInitial((prevImages) => [...prevImages, image]);

    // Atualiza a lista de imagens iniciais excluindo a imagem passada
    setInitialImages((prevImages) => {
      return prevImages.filter((prevImage) => prevImage !== image);
    });
  };

  const handleImageUpload = async () => {
    const formData = new FormData();

    // Adiciona cada imagem ao FormData com o campo "images"
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (selectedImages.length > 0) {
        const response = await addNewImages(formData).unwrap();
        // Supondo que a resposta contém um array de URLs em response.urls
        return response.urls || [];
      } // Retorna as URLs ou um array vazio
    } catch (err) {
      console.error("Erro ao enviar as imagens:", err);
      return []; // Retorna um array vazio em caso de erro
    }
  };
  const canSave = [title, text].every(Boolean) && !isLoading;

  const onSaveProductClicked = async (e) => {
    try {
      if (canSave) {
        console.log("Initial", initialImages);
        console.log("Deleted", deletedImagesfromInitial);

        // Verifica se deletedImagesfromInitial é um array
        if (!Array.isArray(deletedImagesfromInitial)) {
          throw new Error("deletedImagesfromInitial não é um array.");
        }

        // Se houver imagens deletadas, chama a função para deletá-las
        if (deletedImagesfromInitial.length > 0) {
          const imageUrls = { imageUrls: deletedImagesfromInitial };

          const delet = await deleteImages(imageUrls).unwrap();
          console.log("RETORNO", delet);
        }

        let imageUploadResult = [];

        // Faz o upload das novas imagens, se existirem

        if (selectedImages.length > 0) {
          imageUploadResult = await handleImageUpload();
        }

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

        console.log("imageUploadResult", imageUploadResult);
        imageUploadResult = [...imageUploadResult, ...initialImages];
        console.log("imageeupload", imageUploadResult);
        // Faz a atualização do produto com as novas imagens
        const response = await updateProduct({
          id: product._id,
          userId,
          title,
          text,
          downpayment,
          status,
          price,
          categories: selectedCategories,
          images: imageUploadResult,
        });

        console.log("Resposta da atualização do produto:", response);
      }
    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
    }
  };

  const onDeleteProductClicked = async () => {
    let confirmed = false;
    confirmed = window.confirm(
      `deseja mesmo excluir o produto ${product.title}`
    );
    if (confirmed) {
      try {
        const imageUrls = { imageUrls: product.images };
        await deleteImages(imageUrls);
        await deleteProduct({ id: product.id });
      } catch (e) {
        console.error(e);
      }
    }
  };
  useEffect(() => {}, [
    selectedImagePreviews,
    initialImages,
    deletedImagesfromInitial,
  ]);

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

  const content = isAdmin ? (
    <>
      <p className={errClass}>{errContent}</p>
      <div className="img__previews--container">
        {selectedImagePreviews.length > 0 && (
          <>
            {selectedImagePreviews.map((image, index) => (
              <div key={`selected-${index}`} className="image-previews">
                <img
                  src={image}
                  alt={`Pré-visualização ${index + 1}`}
                  className="img-preview"
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
          </>
        )}

        {initialImages.length > 0 && (
          <>
            {initialImages.map((image, index) => (
              <div key={`initial-${index}`} className="image-previews">
                <img
                  src={image}
                  alt={`Pré-visualização ${index + 1}`}
                  className="img-preview"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImageInitial(image)}
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
          </>
        )}
      </div>

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
        <input
          type="file"
          onChange={(e) => handleImageChange(e.target.files)}
          accept="image/*"
          multiple
        />
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
        <fieldset>
          <legend>Categorias</legend>
          {categories?.map((category, index) => (
            <div key={index}>
              <label className="custom-checkbox" htmlFor={category.id}>
                {category.name}
                <input
                  type="checkbox"
                  id={category.id}
                  checked={selectedCategories?.includes(category._id)}
                  value={category.id}
                  onChange={(e) => onCategoriesChange(e)}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          ))}
        </fieldset>
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
  ) : (
    <>{"Sem permissão de acesso administrativo"}</>
  );

  return content;
};

export default EditProductForm;
