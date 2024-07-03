import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to 30c",
  description: "This is an e-commerce project made by Arun Sinha.",
  keywords: "react, javascript, programming",
};

export default Meta;
