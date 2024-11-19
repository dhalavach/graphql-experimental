// src/components/Sidebar.tsx
import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #2d2d2d;
  color: #ffffff;
  padding: 1rem;
`;

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <h2>Sidebar</h2>
      <p>Options and tools will go here</p>
    </SidebarContainer>
  );
};

export default Sidebar;
