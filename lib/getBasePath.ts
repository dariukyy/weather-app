export const getBasePath = () => {
  let base_url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://dariukyy-weather-app.vercel.app";

  return base_url;
};
