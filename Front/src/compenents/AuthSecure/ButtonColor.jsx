import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import '../../styles/monStyle.css'; // Assurez-vous d'importer votre fichier CSS

const ButtonColor = ({ onSuccessClick, onDangerClick, onWarningClick }) => {
  return (
    <section aria-labelledby="color-selection-heading">
      <Row className="graylogo rounded d-flex justify-content-center align-items-center m-2">
        <Col xs="auto" className="d-flex align-items-center">
          <p id="color-selection-heading" className="mb-0 mr-2 text-white">Choisissez votre couleur :</p>
          <Button
            className="round-button mx-4"
            variant="success"
            onClick={onSuccessClick}
            aria-label="Couleur verte"
          />
          <Button
            className="round-button mx-4"
            variant="danger"
            onClick={onDangerClick}
            aria-label="Couleur rouge"
          />
          <Button
            className="round-button mx-4"
            variant="warning"
            onClick={onWarningClick}
            aria-label="Couleur jaune"
          />
        </Col>
      </Row>
    </section>
  );
};

export default ButtonColor;