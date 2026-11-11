import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "@/components/ui/Modal";

describe("Modal accessible names", () => {
  it("names the open dialog independently of an earlier closed dialog", () => {
    const onClose = vi.fn();
    const view = render(
      <>
        <Modal open={false} onClose={onClose} title="Generate topology with AI">First</Modal>
        <Modal open onClose={onClose} title="Save topology as template">Second</Modal>
      </>,
    );
    const dialog = screen.getByRole("dialog", { name: "Save topology as template" });
    const titleId = dialog.getAttribute("aria-labelledby");
    expect(titleId).toBeTruthy();
    expect(document.getElementById(titleId!)).toBe(
      within(dialog).getByRole("heading", { name: "Save topology as template" }),
    );
    const ids = Array.from(view.container.querySelectorAll("[id]"), (node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);

    view.rerender(
      <>
        <Modal open onClose={onClose} title="Generate topology with AI">First</Modal>
        <Modal open={false} onClose={onClose} title="Save a renamed template">Second</Modal>
      </>,
    );
    expect(screen.getByRole("dialog", { name: "Generate topology with AI" })).toBeVisible();
    expect(dialog.getAttribute("aria-labelledby")).toBe(titleId);
    expect(document.getElementById(titleId!)).toHaveTextContent("Save a renamed template");

    view.rerender(
      <>
        <Modal open={false} onClose={onClose} title="Generate topology with AI">First</Modal>
        <Modal open onClose={onClose} title="Save a renamed template">Second</Modal>
      </>,
    );
    expect(screen.getByRole("dialog", { name: "Save a renamed template" })).toBe(dialog);
    expect(dialog.getAttribute("aria-labelledby")).toBe(titleId);
  });
});
