import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Alert } from "@mui/material";
import { FormFields } from "./FormFields";
import { INITIAL_SUBCATEGORIA_FORM_STATE } from "../../../config/constants";
import { FaSave } from "react-icons/fa";
import "./FormularioSubcategoriaEgreso.scss";
import { createSubcategoriaEgreso } from "../../../services/subcategoriaEgresosService";

export const FormularioSubcategoriaEgresos = ({
  onSubcategoriaCreada,
  subcategorias,
}) => {
  const [formData, setFormData] = useState(INITIAL_SUBCATEGORIA_FORM_STATE);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createSubcategoriaEgreso(formData);
      setFormData(INITIAL_SUBCATEGORIA_FORM_STATE);
      onSubcategoriaCreada();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.name === "nivel" ? Number(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="formulario-subcategoria"
    >
      {error && (
        <Alert severity="error" className="alerta-error">
          {error}
        </Alert>
      )}

      <div className="icono-centrado">
        <FaSave
          className="icono-agregar"
          onClick={handleSubmit}
          title="Guardar subcategoría"
        />
      </div>

      <div className="input-container">
        <FormFields
          formData={formData}
          handleChange={handleChange}
          subcategoriasEgresos={subcategorias}
        />
      </div>
    </Box>
  );
};

FormularioSubcategoriaEgresos.propTypes = {
  onSubcategoriaCreada: PropTypes.func.isRequired,
  subcategorias: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      codigo: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      nivel: PropTypes.number.isRequired,
      categoriaPadre: PropTypes.string,
    })
  ),
};
