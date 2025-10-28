import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "../hero";

describe("Hero", () => {
  it("highlights Forestal MT positioning", () => {
    render(<Hero />);

    expect(screen.getByText(/Exporting Nature Without Borders/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Heritage you can verify\. Quality you can measure\. Sourcing you can trust\./i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore Catalog/i })).toBeVisible();
  });
});
