import Button from "react-bootstrap/Button";
import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Row, Col, Image } from "react-bootstrap";

import { increment, decrement, customValue } from "../redux/reducers/counter";
import { getAll } from "../redux/asyncActions/character";
// class Series extends React.Component {
//   render() {
//     return <li>{this.props.name}</li>;
//   }
// }

const ListCharacter = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.character.results);
  React.useEffect(() => {
    dispatch(getAll()); //ketik punya action didalam redux harus dipanggilnya di dalam dispatch
  }, [dispatch]);

  React.useEffect(() => {}, [data]);
  return (
    <div>
      <Row>
        {data.results &&
          data.results.map((char) => {
            return (
              <Col md={4}>
                <Image src={char.image} fluid />
              </Col>
            );
          })}
      </Row>
      <Button
        disabled={data?.info?.prev === null}
        onClick={() => {
          data.info.prev && dispatch(getAll(data.info.prev));
        }}
      >
        Prev Page
      </Button>
      <Button
        disabled={data?.info?.next === null}
        onClick={() => {
          data.info.next && dispatch(getAll(data.info.next));
        }}
      >
        Next Page
      </Button>
    </div>
  );
};

function Wkwkw() {
  const hahaha = useSelector((state) => state.berhitung.value);
  const dispatch = useDispatch();
  return (
    <div>
      <Container className="d-flex justify-content-center flex-column gap-4 align-items-center min-vh-100">
        <div className="d-flex justify-content-center gap-4 align-items-center">
          <Button
            onClick={() => dispatch(decrement())}
            className="btn btn-primary"
          >
            -
          </Button>
          <h1>{hahaha}</h1>
          <Button
            onClick={() => dispatch(increment())}
            className="btn btn-primary"
          >
            +
          </Button>
        </div>
        <Form.Control
          onChange={(e) => dispatch(customValue(e.target.value))}
          className="text-center"
        />
        <Link to="/" className="btn btn-primary">
          To home page
        </Link>
      </Container>
    </div>
  );
}

export class Counter extends Component {
  render() {
    return (
      <div>
        <Wkwkw />
      </div>
    );
  }
}

class Count extends React.Component {
  render() {
    return (
      <>
        <div>
          <Helmet>
            <title>Counter</title>
          </Helmet>
          <ListCharacter />
        </div>
      </>
    );
  }
}

export default Count;
