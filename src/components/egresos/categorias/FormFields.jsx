import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import "./FormFields.scss";

export const FormFields = ({ formData, handleChange, categoriasEgresos }) => {
  const [siguienteCodigo, setSiguienteCodigo] = useState("");
  const [categoriasNivel, setCategoriasNivel] = useState([]);
  const [rutaNavegacion, setRutaNavegacion] = useState([]);

  const actualizarCodigo = useCallback(
    (nuevoCodigo) => {
      setSiguienteCodigo(nuevoCodigo);
      if (formData.codigo !== nuevoCodigo) {
        handleChange({
          target: {
            name: "codigo",
            value: nuevoCodigo,
          },
        });
      }
    },
    [formData.codigo, handleChange]
  );

  useEffect(() => {
    // Actualizar ruta de navegación
    if (formData.categoriaPadre) {
      const ruta = [];
      let categoriaActual = categoriasEgresos.find(
        (c) => c.codigo === formData.categoriaPadre
      );

      while (categoriaActual) {
        ruta.unshift(categoriaActual);
        categoriaActual = categoriasEgresos.find(
          (c) => c.codigo === categoriaActual.categoriaPadre
        );
      }

      setRutaNavegacion(ruta);
    } else {
      setRutaNavegacion([]);
    }

    // Generar siguiente código
    if (formData.categoriaPadre) {
      const categoriaPadre = categoriasEgresos.find(
        (c) => c.codigo === formData.categoriaPadre
      );
      if (categoriaPadre) {
        const subcategorias = categoriasEgresos.filter(
          (c) => c.categoriaPadre === formData.categoriaPadre
        );
        const ultimoNumero =
          subcategorias.length > 0
            ? Math.max(
                ...subcategorias.map((c) => parseInt(c.codigo.split(".").pop()))
              )
            : 0;
        const nuevoCodigo = `${categoriaPadre.codigo}.${ultimoNumero + 1}`;
        actualizarCodigo(nuevoCodigo);
      }
    } else {
      const categoriasNivel1 = categoriasEgresos.filter(
        (c) => !c.categoriaPadre
      );
      const ultimoNumero =
        categoriasNivel1.length > 0
          ? Math.max(...categoriasNivel1.map((c) => parseInt(c.codigo)))
          : 0;
      const nuevoCodigo = `${ultimoNumero + 1}`;
      actualizarCodigo(nuevoCodigo);
    }

    // Actualizar lista de categorías del nivel actual
    const categoriasDelNivel = categoriasEgresos.filter((c) =>
      formData.categoriaPadre
        ? c.categoriaPadre === formData.categoriaPadre
        : !c.categoriaPadre
    );
    setCategoriasNivel(categoriasDelNivel);
  }, [formData.categoriaPadre, categoriasEgresos, actualizarCodigo]);

  const handleAgregarSubcategoria = (categoria) => {
    handleChange({
      target: {
        name: "categoriaPadre",
        value: categoria.codigo,
      },
    });
  };

  const handleNavegar = (categoria) => {
    handleChange({
      target: {
        name: "categoriaPadre",
        value: categoria.codigo,
      },
    });
  };

  const mostrarSubcategorias = (categoria) => {
    const subcategorias = categoriasEgresos.filter(
      (c) => c.categoriaPadre === categoria.codigo
    );
    return (
      subcategorias.length > 0 && (
        <ul className="lista-subcategorias">
          {subcategorias.map((subcat) => (
            <li key={subcat._id} className="subcategoria-item">
              <div className="categoria-info">
                <span className="categoria-codigo">{subcat.codigo}</span>
                <span className="categoria-nombre">{subcat.nombre}</span>
              </div>
              <div className="categoria-acciones">
                <button
                  type="button"
                  onClick={() => handleNavegar(subcat)}
                  className="btn-navegar"
                >
                  Ver subcategorías
                </button>
                <button
                  type="button"
                  onClick={() => handleAgregarSubcategoria(subcat)}
                  className="btn-agregar-subcategoria"
                >
                  + Agregar Subcategoría
                </button>
              </div>
            </li>
          ))}
        </ul>
      )
    );
  };

  return (
    <div className="form-fields-container">
      {rutaNavegacion.length > 0 && (
        <div className="ruta-navegacion">
          <button
            type="button"
            onClick={() =>
              handleChange({
                target: { name: "categoriaPadre", value: "" },
              })
            }
            className="btn-navegacion"
          >
            Inicio
          </button>
          {rutaNavegacion.map((cat) => (
            <span key={cat._id}>
              <span className="separador-ruta">›</span>
              <button
                type="button"
                onClick={() => handleNavegar(cat)}
                className="btn-navegacion"
              >
                {cat.nombre}
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="form-group">
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="form-input"
          placeholder="Nombre de la categoría"
          required
        />
        <div className="codigo-sugerido">Código: {siguienteCodigo}</div>
      </div>

      {categoriasNivel.length > 0 && (
        <div className="categorias-nivel">
          <ul className="lista-categorias">
            {categoriasNivel.map((categoria) => (
              <li key={categoria._id} className="categoria-item">
                <div className="categoria-info">
                  <span className="categoria-codigo">{categoria.codigo}</span>
                  <span className="categoria-nombre">{categoria.nombre}</span>
                </div>
                <div className="categoria-acciones">
                  <button
                    type="button"
                    onClick={() => handleAgregarSubcategoria(categoria)}
                    className="btn-agregar-subcategoria"
                  >
                    + Agregar Subcategoría
                  </button>
                </div>
                {mostrarSubcategorias(categoria)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

FormFields.propTypes = {
  formData: PropTypes.shape({
    codigo: PropTypes.string,
    nombre: PropTypes.string.isRequired,
    nivel: PropTypes.number,
    categoriaPadre: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  categoriasEgresos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      codigo: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      nivel: PropTypes.number.isRequired,
      categoriaPadre: PropTypes.string,
    })
  ).isRequired,
};
