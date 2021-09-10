const priceFormatter = (price: number, round: boolean = true) => {
  return round ? Math.round(price / 100) : price / 100;
};

export default priceFormatter;
