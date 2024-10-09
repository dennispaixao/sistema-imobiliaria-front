import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import ProductsList from "./features/products/ProductsList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditProduct from "./features/products/EditProduct";
import NewProduct from "./features/products/NewProduct";
import NewCategorieForm from "./features/categories/NewCategorieForm";
import EditCategorie from "./features/categories/EditCategorie";
import CategoriesList from "./features/categories/CategoriesList";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

function App() {
  useTitle("Dan D. Repairs");

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                  <Route path="categories">
                    <Route index element={<CategoriesList />} />
                    <Route path=":id" element={<EditCategorie />} />
                    <Route path="new" element={<NewCategorieForm />} />
                  </Route>
                </Route>

                <Route path="products">
                  <Route index element={<ProductsList />} />
                  <Route path=":id" element={<EditProduct />} />
                  <Route path="new" element={<NewProduct />} />
                </Route>
              </Route>
              {/* End Dash */}
            </Route>
          </Route>
        </Route>
        {/* End Protected Routes */}
      </Route>
      <Route path="/*" element={<Login />} />
    </Routes>
  );
}

export default App;
