import { useGetProductsQuery } from "./productsApiSlice";
import Product from "./Product";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { Link } from "react-router-dom";

const ProductsList = () => {
  useTitle("imobiliaria: Products List");
  const { data: userToFilter } = useGetUsersQuery("usersList", {
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
          <Link to="/dash/products/new">Adicionar novo produto</Link>
        </p>{" "}
        <p className="errmsg">{error?.data?.message}</p>
      </div>
    );
  }

  if (isSuccess) {
    const { ids, entities } = products;

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
      filteredIds?.map((productId) => (
        <Product key={productId} productId={productId} />
      ));

    content = (
      <>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button className="button">
            <Link to="/dash/products/new">Adicionar novo produto</Link>
          </button>

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
