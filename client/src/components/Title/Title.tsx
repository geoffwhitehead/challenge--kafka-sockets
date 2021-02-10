import React from "react";
import styled from "styled-components";

type TitleProps = {
  title: string;
  description: string;
};

export const Title: React.FC<TitleProps> = ({ title, description }) => {
  return (
    <>
      <Header>{title}</Header>
      <Description>{description}</Description>
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
