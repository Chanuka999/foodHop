import React, {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import axios from "axios";

const CartContext = createContext();

const cartReducer = (state, action) => {
  const getId = (ci) => ci?._id || ci?.item?._id || ci?.item?.id;
  switch (action.type) {
    case "HYDRATE_CART":
      return action.payload;
    case "ADD_ITEM": {
      const { _id, item, quantity } = action.payload;
      const exists = state.find((ci) => getId(ci) === _id);
      if (exists) {
        return state.map((ci) =>
          getId(ci) === _id
            ? { ...ci, quantity: (ci.quantity || 0) + quantity }
            : ci
        );
      }
      return [...state, { _id, item, quantity }];
    }
    // handle item removal
    case "REMOVE_ITEM": {
      return state.filter((ci) => getId(ci) !== action.payload);
    }

    case "UPDATE_ITEM": {
      const { _id, quantity } = action.payload;
      return state.map((ci) => (getId(ci) === _id ? { ...ci, quantity } : ci));
    }
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

const initializer = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return; // don't hydrate cart when user is not authenticated

    axios
      .get("http://localhost:4000/api/cart", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => dispatch({ type: "HYDRATE_CART", payload: res.data }))
      .catch((err) => {
        // suppress noisy logs for unauthorized/forbidden (not logged-in) flows
        const status = err?.response?.status;
        if (status && [401, 403].includes(status)) return;
        console.error(err);
      });
  }, []);

  const addToCart = useCallback(async (item, qty = 1) => {
    const token = localStorage.getItem("authToken");
    // accept either an item object or a direct id
    const itemId =
      typeof item === "string"
        ? item
        : item && (item._id || item.id || item.item?._id || item.item?.id);

    // If not authenticated, update local state only
    if (!token) {
      if (!itemId) {
        console.warn("addToCart called without a valid item id (local)", item);
        return;
      }
      const localId = itemId || `local-${Date.now()}`;
      // Avoid spreading a string (if caller passed an id) which would
      // produce a broken object. Normalize to a proper item object.
      const itemObj =
        item && typeof item === "object" ? { ...item } : { _id: itemId };
      if (!itemObj._id) itemObj._id = itemId;

      const payload = {
        _id: localId,
        item: itemObj,
        quantity: qty,
      };
      dispatch({ type: "ADD_ITEM", payload });
      return payload;
    }

    if (!itemId) {
      console.warn("addToCart called without a valid item id", item);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/cart",
        { itemId, quantity: qty },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({ type: "ADD_ITEM", payload: res.data });
      return res.data;
    } catch (err) {
      const status = err?.response?.status;
      if (status && [401, 403].includes(status)) {
        // user not authorized — don't spam console with stack traces
        console.warn("addToCart unauthorized", status);
        return;
      }
      console.error("addToCart error", err);
      throw err;
    }
  }, []);

  // correctly named removeFromCart (was removeFormCart) and dispatches REMOVE_ITEM
  const removeFromCart = useCallback(async (_id) => {
    if (!_id) {
      console.warn("removeFromCart called without id", _id);
      return;
    }
    const token = localStorage.getItem("authToken");
    // local fallback when not authenticated
    if (!token) {
      dispatch({ type: "REMOVE_ITEM", payload: _id });
      return { _id };
    }
    try {
      await axios.delete(`http://localhost:4000/api/cart/${_id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "REMOVE_ITEM", payload: _id });
    } catch (err) {
      const status = err?.response?.status;
      if (status && [401, 403].includes(status)) {
        console.warn("removeFromCart unauthorized", status);
        return;
      }
      console.error("removeFromCart error", err);
      throw err;
    }
  }, []);

  const updateQuantity = useCallback(async (_id, qty) => {
    if (!_id) {
      console.warn("updateQuantity called without id", _id, qty);
      return;
    }
    const token = localStorage.getItem("authToken");
    // local fallback when not authenticated
    if (!token) {
      dispatch({ type: "UPDATE_ITEM", payload: { _id, quantity: qty } });
      return { _id, quantity: qty };
    }
    try {
      const res = await axios.put(
        `http://localhost:4000/api/cart/${_id}`,
        { quantity: qty },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({ type: "UPDATE_ITEM", payload: res.data });
      return res.data;
    } catch (err) {
      const status = err?.response?.status;
      if (status && [401, 403].includes(status)) {
        console.warn("updateQuantity unauthorized", status);
        return;
      }
      console.error("updateQuantity error", err);
      throw err;
    }
  }, []);

  const clearCart = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    await axios.post(
      "http://localhost:4000/api/cart/clear",
      {},
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const totalItems = cartItems.reduce((sum, ci) => sum + (ci.quantity || 0), 0);
  const totalAmount = cartItems.reduce((sum, ci) => {
    const price = ci?.item?.price ?? 0;
    const qty = ci?.quantity ?? 0;
    return sum + price * qty;
  }, 0);
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
