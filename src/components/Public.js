import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section
      className="public"
      style={{ color: "#fff", "text-shadow": "5px 5px 5px #333" }}
    >
      <header>
        <h1>
          Bem vindo a <span className="nowrap">MMendes Imobiliaria</span>
        </h1>
      </header>
      <main className="public__main">
        <br />
        <p>Responsável: Marcia Mendes Paixão</p>
      </main>
      <footer>
        <Link to="/login" style={{ fontSize: "1.5rem", color: "pink" }}>
          Login administrativo
        </Link>
      </footer>
    </section>
  );
  return content;
};
export default Public;
