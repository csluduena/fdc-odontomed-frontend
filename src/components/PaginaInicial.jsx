import logo from "../assets/odontomed512_512.png";
import logo1 from "../assets/odontomedBigLogo.png";
import "../styles/PaginaInicial.scss";
import { FaDollarSign, FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DashboardIngresos } from "./dashboard/DashboardIngresos";
import { DashboardEgresos } from "./dashboard/DashboardEgresos";
import { DashboardComparativo } from "./dashboard/DashboardComparativo";

export const PaginaInicial = () => {
  return (
    <div className="pagina-inicial">
      <div className="pagina-inicial-container">
        <img src={logo} alt="Logo" className="pagina-inicial-logo" />
        <img src={logo1} alt="Logo1" className="pagina-inicial-logo-1" />
        <p className="pag-ini-titulo">Cash Flow</p>
      </div>
      <div className="pagina-inicial-container">
        <Link to="/ingresos">
          <button className="btn-ingresos">
            <FaDollarSign className="btn-icon" />
            Ingresos
          </button>
        </Link>
        <Link to="/egresos">
          <button className="btn-gastos">
            <FaMoneyBillWave className="btn-icon" />
            Egresos
          </button>
        </Link>
      </div>

      <DashboardIngresos />
      <DashboardEgresos />
      <DashboardComparativo />
    </div>
  );
};
