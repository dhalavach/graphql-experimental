// src/components/Canvas.tsx
import React from 'react';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  flex: 1;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Canvas: React.FC = () => {
  return (
    <CanvasContainer>
      <h1>Canvas Area</h1>
    </CanvasContainer>
  );
};

export default Canvas;
