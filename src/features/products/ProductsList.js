import { useGetProductsQuery } from "./productsApiSlice";
import Product from "./Product";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useSelector } from "react-redux";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetCategoriesQuery } from "../categories/categoriesApiSlice";
import { Link } from "react-router-dom";
import { useState } from "react";

const ProductsList = () => {
  useTitle("imobiliaria: Products List");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [searchBoxInput, setSearchBoxInput] = useState("");
  const { data: userToFilter } = useGetUsersQuery("usersList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const { data: categories } = useGetCategoriesQuery("categoriesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const { username, isManager, isAdmin } = useAuth();
  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductsQuery("productsList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p>
          <Link to="/dash/products/new" className="button">
            Adicionar novo produto
          </Link>
        </p>
        <p className="errmsg">{error?.data?.message}</p>
      </div>
    );
  }

  if (isSuccess) {
    const { ids = [], entities = {} } = products;

    let filteredIds = [];

    if (isManager || isAdmin) {
      filteredIds = ids.filter((id) => {
        const productCategories = entities[id]?.categories || [];

        const matchesSearchBoxInput = (prod) => {
          return (
            prod.ticket.toString().startsWith(searchBoxInput) ||
            prod.title.toLowerCase().startsWith(searchBoxInput.toLowerCase())
          );
        };

        const productMatches = matchesSearchBoxInput(entities[id]);

        const categoryMatches =
          !selectedCategorie ||
          productCategories.some(
            (cat) => cat.name === selectedCategorie // Comparando com o _id da categoria selecionada
          );

        return categoryMatches && productMatches;
      });
    } else {
      const { ids: idsUsers, entities: entitiesUsers } = userToFilter;
      const userId = idsUsers.find(
        (i) => entitiesUsers[i].username === username
      );
      filteredIds = ids.filter((i) => entities[i].user === userId);
    }

    const tableContent =
      filteredIds.length > 0 ? (
        filteredIds.map((productId) => (
          <Product key={productId} productId={productId} />
        ))
      ) : (
        <p>Sem produtos correspondentes à categoria selecionada.</p>
      );

    const handleSearchChange = (event) => {
      setSearchBoxInput(event.target.value);
    };

    const handleCategorieChange = (event) => {
      setSelectedCategorie(event.target.value);
    };

    content = (
      <>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link to="/dash/products/new" className="button">
            Adicionar novo produto
          </Link>
          <input
            type="text"
            name="search"
            onChange={handleSearchChange}
            placeholder="Buscar por ticket ou título"
          />
          <label htmlFor="searchCategories">Categoria</label>
          <select
            name="categories"
            id="categories"
            onChange={handleCategorieChange}
            value={selectedCategorie || ""}
          >
            <option value="">todas</option>
            {categories?.ids?.map((id) => (
              <option key={id} value={categories.entities[id].name}>
                {categories.entities[id].name}
              </option>
            ))}
          </select>
          <table className="table table--products">
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th product__cod">
                  Cod
                </th>
                <th scope="col" className="table__th product__title">
                  Título
                </th>
                <th scope="col" className="table__th product__created">
                  {"Categoria(s)"}
                </th>
                <th scope="col" className="table__th product__updated">
                  Atualizado
                </th>
                <th scope="col" className="table__th product__edit">
                  Editar
                </th>
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
      </>
    );
  }

  return content;
};

export default ProductsList;
