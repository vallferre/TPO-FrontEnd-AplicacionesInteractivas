import { createAsyncThunk } from "@reduxjs/toolkit";

export const checkoutOrder = createAsyncThunk(
  "order/checkoutOrder",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return rejectWithValue("No token found");

    try {
      const response = await fetch("http://localhost:8080/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const message = await response.text();
        return rejectWithValue(message || "Checkout failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
