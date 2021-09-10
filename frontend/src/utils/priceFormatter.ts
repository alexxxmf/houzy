const priceFormatter = (price: number, round: boolean = true) => {
  // TODO: add currency handling
  const formattedPrice = round ? Math.round(price / 100) : price / 100;
  return `${formattedPrice}€`;
};

export default priceFormatter;
