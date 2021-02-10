import { render, screen } from "@testing-library/react";
import React from "react";
import { App } from "./App";

test("renders the title", () => {
  render(<App />);
  const Header = screen.getByText(/Starship Builder/i);
  expect(Header).toBeInTheDocument();
});

test("renders the available starships table", () => {
  render(<App />);
  const Header1 = screen.getByText(/Cost/i);
  const Header2 = screen.getByText(/Crew/i);
  expect(Header1).toBeInTheDocument();
  expect(Header2).toBeInTheDocument();
});

test("renders the starships table", () => {
  render(<App />);
  const Header1 = screen.getByText(/Build Progress/i);
  const Header2 = screen.getByText(/Navigation/i);
  expect(Header1).toBeInTheDocument();
  expect(Header2).toBeInTheDocument();
});
