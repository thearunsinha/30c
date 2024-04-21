import { Row, Col } from "react-bootstrap";
import products from "../products";
import Product from "../components/Product";

const HomeScreen = () => {
  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => {
          return (
            <Col key={product._id} cm={12} md={6} lg={4} xl={3}>
              <Product
                productArr={product}
                image={product.image}
                name={product.name}
                price={product.price}
              />
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default HomeScreen;