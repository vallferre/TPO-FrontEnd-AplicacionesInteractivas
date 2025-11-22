import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchCurrentUser,
  fetchUserAvatar,
  updateUserProfile,
} from "../../../redux/slices/AuthSlice";

import {
  selectUser,
  selectUserAvatar,
  selectAuthLoading,
} from "../../../redux/slices/AuthSelectors";

import { toast } from "react-toastify";
import "./EditProfile.css";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const avatar = useSelector(selectUserAvatar);
  const loading = useSelector(selectAuthLoading);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Load initial user + avatar
  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchUserAvatar());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        username: user.username || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    document.getElementById("profile-image").value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateUserProfile({ formData, profileImage }))
      .unwrap()
      .then(() => {
        toast.success("Perfil actualizado");
        dispatch(fetchCurrentUser());
        dispatch(fetchUserAvatar());
        navigate("/profile");
      })
      .catch((err) => {
        toast.error(err || "Error al actualizar perfil");
      });
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">

        <div className="edit-profile-header">
          <h1>Editar Perfil</h1>
        </div>

        {/* PROFILE IMAGE */}
        <div className="profile-image-section">
          <div className="profile-image-container">
            <div className="profile-image-wrapper">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="profile-image-preview" />
              ) : avatar ? (
                <img src={avatar} alt="current" className="profile-image-preview" />
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

              {(imagePreview || profileImage) && (
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

        {/* FORM */}
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          {["name", "surname", "email", "username"].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.toUpperCase()}</label>
              <input
                name={field}
                type={field === "email" ? "email" : "text"}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* PASSWORD */}
          <div className="form-group password-group">
            <label>Contraseña nueva</label>
            <div className="password-input-wrapper">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/profile")}
            >
              Cancelar
            </button>

            <button type="submit" className="update-btn" disabled={loading}>
              {loading ? "Guardando..." : "Actualizar Perfil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;