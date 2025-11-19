import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:8080";

export const checkoutOrder = createAsyncThunk(
  "cart/checkout",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return rejectWithValue("No token found");

    const { data } = await axios.post(
      `${URL}/cart/checkout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  }
);
