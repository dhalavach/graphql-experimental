// src/components/Toolbar.tsx
import React from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  height: 50px;
  background-color: #333;
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

const Toolbar: React.FC = () => {
  return (
    <ToolbarContainer>
      <p>Toolbar</p>
    </ToolbarContainer>
  );
};

export default Toolbar;
