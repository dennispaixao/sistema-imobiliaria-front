import { useGetProductsQuery } from "./productsApiSlice";
import Product from "./Product";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useGetUsersQuery } from "../users/usersApiSlice";

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
    content = <p className="errmsg">{error?.data?.message}</p>;
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
      <table className="table table--products">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th product__title">
              Título
            </th>
            <th scope="col" className="table__th product__created">
              Created
            </th>
            <th scope="col" className="table__th product__updated">
              Updated
            </th>
            <th scope="col" className="table__th product__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};
export default ProductsList;
