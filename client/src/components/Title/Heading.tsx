import React from 'react';
import styled from 'styled-components';

type HeadingProps = {
  title: string;
  description?: string;
};

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <>
      <Header>{title}</Header>
      {description && <Description>{description}</Description>}
    </>
  );
};

const Header = styled.div`
  font-size: 4rem;
`;
const Description = styled.p`
  color: grey;
  font-size: 1rem;
`;
