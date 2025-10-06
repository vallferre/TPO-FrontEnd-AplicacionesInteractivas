import React from "react";
import styled from "styled-components";

const ImageUpload = ({ onChange, multiple = true, label = "Click to upload image", id = "product-images" }) => {
  return (
    <StyledWrapper>
      <label className="custum-file-upload" htmlFor={id}>
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M10 1C9.73 1 9.48 1.1 9.29 1.29L3.29 7.29C3.1 7.48 3 7.73 3 8V20C3 21.66 4.34 23 6 23H7C7.55 23 8 22.55 8 22C8 21.45 7.55 21 7 21H6C5.45 21 5 20.55 5 20V9H10C10.55 9 11 8.55 11 8V3H18C18.55 3 19 3.45 19 4V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 2.34 19.66 1 18 1H10ZM9 7H6.41L9 4.41V7ZM14 15.5C14 14.12 15.12 13 16.5 13C17.88 13 19 14.12 19 15.5V17H20C21.1 17 22 17.9 22 19C22 20.1 21.1 21 20 21H13C11.9 21 11 20.1 11 19C11 17.9 11.9 17 13 17H14V15.5Z"
            />
          </svg>
        </div>
        <div className="text">
          <span>{label}</span>
        </div>
        <input type="file" id={id} accept="image/*" onChange={onChange} multiple={multiple} />
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Asegura que tome el ancho del contenedor y evite que estilos globales de label lo pisen */
  width: 100%;
  display: flex;
  justify-content: flex-start;

  .custum-file-upload {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    justify-content: center;
    height: 200px;
    width: 100%;
    max-width: 360px;
    cursor: pointer;
    border: 2px dashed #cacaca;
    background-color: #fff;
    padding: 1.25rem;
    border-radius: 10px;
    box-shadow: 0px 48px 35px -48px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s ease, background-color 0.2s ease;
  }

  .custum-file-upload:hover {
    border-color: #135bec;
    background-color: #f9fbff;
  }

  .custum-file-upload .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custum-file-upload .icon svg {
    height: 72px;
    width: 72px;
    color: rgba(75, 85, 99, 1);
  }

  .custum-file-upload .text {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custum-file-upload .text span {
    font-weight: 500;
    color: rgba(75, 85, 99, 1);
  }

  .custum-file-upload input {
    display: none;
  }
`;

export default ImageUpload;
