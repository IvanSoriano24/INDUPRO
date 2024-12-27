import React from "react"
import { Container, Row, Col } from "reactstrap"
const Home = () => {
    return (
        <>
        <Container>
            <Row>
                <Col xs="4" className="bg-primary square-column" style={{ backgroundColor: 'rgba(128, 128, 128, 0.1)' }}>Columna 1</Col>
                <Col xs="4" className="bg-warning">Columna 1</Col>
                <Col xs="4" className="bg-primary">Columna 1</Col>
            </Row>
        </Container>
        </>
    )
}

export default Home