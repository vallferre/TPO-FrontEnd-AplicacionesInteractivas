import React, { useState, useContext } from "react"; // ✅ agregado useContext
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../assets/EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext); // ✅ obtener updateUser del contexto

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    password: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById("profile-image");
    if (fileInput) fileInput.value = "";
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("jwtToken");
      const submitData = new FormData();

      const userJson = JSON.stringify(formData);
      submitData.append("user", new Blob([userJson], { type: "application/json" }));

      if (profileImage) submitData.append("fileImage", profileImage);

      const response = await fetch("http://localhost:8080/users/edit", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: submitData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update profile");
      }

      const data = await response.json();
      toast.success(data.message || "Profile updated successfully!");

      // ✅ Actualizar los datos del usuario globalmente (para Navigation.jsx)
      // Si el backend devuelve la nueva URL o el id, la usamos
      updateUser({
        username: data.username || formData.username,
        email: data.email || formData.email,
        name: data.name || formData.name,
        surname: data.surname || formData.surname,
        profileImageUrl: data.profileImageUrl || null,
      });

      // Limpiar campos
      setFormData((prev) => ({ ...prev, password: "" }));
      setProfileImage(null);
      setImagePreview(null);

      // Esperar un momento para mostrar el mensaje antes de redirigir
      setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "An error occurred while updating profile");
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <h1>Editar Perfil</h1>
          <p>Actualiza la información de tu perfil.</p>
        </div>

        <div className="profile-image-section">
          <div className="profile-image-container">
            <div className="profile-image-wrapper">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="profile-image-preview"
                />
              ) : (
                <div className="profile-image-placeholder">
                  <span className="material-symbols-outlined">person</span>
                </div>
              )}
            </div>

            <div className="profile-image-actions">
              <label htmlFor="profile-image" className="image-upload-btn">
                <span className="material-symbols-outlined">photo_camera</span>
                Cambiar foto
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {imagePreview && (
                <button
                  type="button"
                  className="image-remove-btn"
                  onClick={handleRemoveImage}
                >
                  <span className="material-symbols-outlined">delete</span>
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          {/* Campos de texto */}
          {["name", "surname", "email", "username"].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={field === "email" ? "email" : "text"}
                value={formData[field]}
                placeholder={`Enter ${field}`}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* Campo de contraseña */}
          <div className="form-group password-group">
            <label htmlFor="password">New Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/profile")}
            >
              Cancelar
            </button>
            <button type="submit" className="update-btn">
              Actualizar Perfil
            </button>
          </div>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default EditProfile;
