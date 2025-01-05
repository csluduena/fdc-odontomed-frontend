import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getIngresos } from "../../../services/ingresosService";
import { FaPencilAlt } from "react-icons/fa";
import "./ListadoIngresos.scss";
import { IngresosDatosAdicionales } from "./IngresosDatosAdicionales";
import { useSubcategoriasIngresos } from "../../../hooks/useSubcategoriasIngresos";

export const ListadoIngresos = ({ ultimoIngresoId }) => {
  const [ingresos, setIngresos] = useState([]);
  const [error, setError] = useState("");
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);
  const { subcategorias } = useSubcategoriasIngresos();

  useEffect(() => {
    cargarIngresos();
  }, []);

  const cargarIngresos = async () => {
    try {
      const data = await getIngresos();
      const ingresosOrdenados = data.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      setIngresos(ingresosOrdenados);
    } catch (error) {
      setError(error.message);
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const options = {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleDateString("es-AR", options);
  };

  const formatearImporte = (importe) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(importe);
  };

  const handleClickLapiz = (ingreso) => {
    setIngresoSeleccionado(ingreso);
  };

  if (error) {
    return <div className="error-mensaje">{error}</div>;
  }

  return (
    <div className="listado-ingresos-container">
      <h3 className="listado-titulo">Últimos Ingresos Registrados</h3>
      <div className="tabla-responsive">
        <table className="tabla-ingresos">
          <thead>
            <tr>
              <th>FECHA</th>
              <th>CATEGORÍA</th>
              <th>SUBCATEGORÍA</th>
              <th>IMPORTE</th>
              <th>ACCIONES</th>
              <th>OBS</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map((ingreso) => (
              <tr
                key={ingreso._id}
                className={
                  ingreso._id === ultimoIngresoId ? "nuevo-ingreso" : ""
                }
              >
                <td>{formatearFecha(ingreso.fecha)}</td>
                <td>
                  <div className="categoria-container">
                    <span className="categoria-cell">
                      {ingreso.categoria.nombre}
                    </span>
                    <div className="categoria-tooltip">
                      <div className="tooltip-content">
                        {ingreso.categoria.rutaCategoria
                          .map((cat) => cat.nombre)
                          .join(" → ")}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {ingreso.subcategoria ? (
                    <div className="subcategoria-container">
                      <span className="subcategoria-cell">
                        {ingreso.subcategoria.nombre}
                      </span>
                      <div className="subcategoria-tooltip">
                        <div className="tooltip-content">
                          {(() => {
                            const rutaSubcategoria = [];
                            let actual = subcategorias.find(
                              (s) => s.codigo === ingreso.subcategoria.codigo
                            );

                            while (
                              actual &&
                              !ingreso.categoria.rutaCategoria.find(
                                (cat) => cat.nombre === actual.nombre
                              )
                            ) {
                              rutaSubcategoria.unshift(actual.nombre);
                              actual = subcategorias.find(
                                (s) => s.codigo === actual.categoriaPadre
                              );
                            }

                            return rutaSubcategoria.join(" → ");
                          })()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="importe">{formatearImporte(ingreso.importe)}</td>
                <td className="acciones">
                  <button
                    className="btn-accion"
                    onClick={() => handleClickLapiz(ingreso)}
                  >
                    <FaPencilAlt />
                  </button>
                </td>
                <td className="observaciones">
                  {ingreso.observaciones?.trim() ? (
                    <span
                      className="tiene-obs"
                      title={ingreso.observaciones}
                      onClick={() => handleClickLapiz(ingreso)}
                    >
                      Sí
                    </span>
                  ) : (
                    "No"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ingresoSeleccionado && (
        <IngresosDatosAdicionales
          ingreso={ingresoSeleccionado}
          onClose={() => setIngresoSeleccionado(null)}
          onUpdate={cargarIngresos}
        />
      )}
    </div>
  );
};

ListadoIngresos.propTypes = {
  ultimoIngresoId: PropTypes.string,
};
