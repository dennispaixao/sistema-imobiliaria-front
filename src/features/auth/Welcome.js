import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const Welcome = () => {
  const { username, isAdmin } = useAuth();

  useTitle(`techProducts: ${username}`);

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const content = (
    <section className="welcome">
      <p>{today}</p>

      <h1>Welcome {username}!</h1>

      <p>
        <Link to="/dash/products">Produtos</Link>
      </p>

      {isAdmin && (
        <p>
          <Link to="/dash/users">Usuários</Link>
        </p>
      )}

      {isAdmin && (
        <p>
          <Link to="/dash/categories">Categorias</Link>
        </p>
      )}
    </section>
  );

  return content;
};
export default Welcome;
