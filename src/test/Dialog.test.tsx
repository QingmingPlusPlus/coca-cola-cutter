import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";

describe("Dialog", () => {
  it("renders the title text when open", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>T</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText("T")).toBeVisible();
  });
});
