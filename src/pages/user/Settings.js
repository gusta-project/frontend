import { Helmet } from 'react-helmet';
import React, { useState, useCallback } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';

import Logo from 'media/logo.svg';

export default function UserSettings() {
  const [settings, setSettings] = useState({
    username: 'xXTeddyBearSlayer69Xx',
    email: 'SlayTeddiesAllDay@aol.com',
    filename: '',
    frontPageList: [
      {
        id: 1,
        name: 'Top Recipes of the Day'
      },
      {
        id: 2,
        name: 'Newest Recipes'
      },
      {
        id: 3,
        name: 'Featured Mixer'
      }
    ],
    droppedItems: [],
    draggedItem: {}
  });
  const handleFileInput = useCallback(
    (event) =>
      setSettings({
        ...settings,
        filename: event.target.files[0].name
      }),
    [settings, setSettings]
  );

  return (
    <Container>
      <Helmet title="Your Settings" />
      <Row className="text-center">
        <Col>
          <h1>User Settings</h1>
        </Col>
      </Row>
      <Form>
        <Row className="text-center">
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Username</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                name="username"
                type="text"
                defaultValue={settings.username}
                placeholder={settings.username}
                aria-describedby="Username"
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>E-mail</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                name="e-mail"
                type="email"
                defaultValue={settings.email}
                placeholder={settings.email}
                aria-describedby="E-mail address"
              />
            </InputGroup>
            <br />
          </Col>
        </Row>
        <Row className="text-center">
          <Col md="3" className="align-self-center">
            <img src={Logo} alt="Current profile pic" className="w-50" />
          </Col>
          <Col md="6" className="align-self-center">
            <h3>Profile Picture</h3>
            <InputGroup>
              <div className="custom-file">
                <Form.Control
                  name="profilePic"
                  type="file"
                  className="custom-file-input"
                  onChange={(event) => handleFileInput(event)}
                />
                <Form.Label className="custom-file-label text-left">
                  {settings.filename ? settings.filename : 'Choose a picture'}
                </Form.Label>
              </div>
              <InputGroup.Prepend>
                <Button className="button-animation">
                  <span>Upload</span>
                </Button>
              </InputGroup.Prepend>
            </InputGroup>
          </Col>
        </Row>
        <hr />
        <Row className="text-center">
          <Col />
        </Row>
        <Row className="text-center">
          <Col>
            <Button className="button-animation">
              <span>Save</span>
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
