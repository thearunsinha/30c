export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  //calculate shipping price (if order is over Rs1000 then its free, otherwise Rs100 will be charged)
  state.shippingPrice = addDecimals(state.itemsPrice > 1000 ? 0 : 100);
  //calculate tax price(18% GST)
  state.taxPrice = addDecimals(Number((0.18 * state.itemsPrice).toFixed(2)));
  //calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
