import React from 'react';
import Form from 'react-bootstrap/Form';

const DataCountSelector = ({ defaultValue, onChangeDataCount }) => {
  return (
    <Form.Control as="select" defaultValue={defaultValue} onChange={onChangeDataCount}>
      <option value={5}>5/page</option>
      <option value={10}>10/page</option>
      <option value={15}>15/page</option>
    </Form.Control>
  );
};

export default DataCountSelector;