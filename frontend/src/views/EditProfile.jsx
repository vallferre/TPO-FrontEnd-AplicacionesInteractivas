import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();

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
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar imagen seleccionada
  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    // También puedes resetear el input file
    const fileInput = document.getElementById('profile-image');
    if (fileInput) fileInput.value = '';
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("jwtToken");

      // Crear FormData
      const submitData = new FormData();

      // Convertir formData a JSON y agregar como Blob
      const userJson = JSON.stringify(formData);
      submitData.append("user", new Blob([userJson], { type: "application/json" }));

      // Agregar imagen si existe
      if (profileImage) {
        submitData.append("fileImage", profileImage);
      }

      const response = await fetch("http://localhost:8080/users/edit", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // NO poner Content-Type, lo hace automáticamente el navegador
        },
        body: submitData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update profile");
      }

      const data = await response.json();
      setMessage(data.message || "Profile updated successfully!");

      // Limpiar campos
      setFormData((prev) => ({ ...prev, password: "" }));
      setProfileImage(null);
      setImagePreview(null);

      // Redirigir tras 1.5 segundos
      setTimeout(() => {
        navigate("/profile");
      }, 1500);

    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "An error occurred while updating profile");
    }
  };


  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <h1>Edit Profile</h1>
          <p>Update your profile information.</p>
        </div>

        {/* Sección de imagen de perfil */}
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
                Change Photo
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              
              {imagePreview && (
                <button 
                  type="button" 
                  className="image-remove-btn"
                  onClick={handleRemoveImage}
                >
                  <span className="material-symbols-outlined">delete</span>
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John"
              value={formData.name}
              onChange={handleChange}
              pattern="[A-Za-zÀ-ÿ\s]{2,40}"
              title="Solo letras y espacios (2 a 40 caracteres)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input
              id="surname"
              name="surname"
              type="text"
              placeholder="Doe"
              value={formData.surname}
              onChange={handleChange}
              pattern="[A-Za-zÀ-ÿ\s]{2,40}"
              title="Solo letras y espacios (2 a 40 caracteres)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              title="Ingresá un email válido"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

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
                pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}"
                title="Al menos 6 caracteres, una letra y un número"
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
            <p className="form-note">Leave blank to keep your current password.</p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
            <button type="submit" className="update-btn">
              Update Profile
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