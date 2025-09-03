import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login";

// mock api
vi.mock("../services/api", () => ({ post: vi.fn() }));
import api from "../services/api";

// mock react-router useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

test("login submits and stores token + navigates", async () => {
  api.post.mockResolvedValue({
    data: { token: "test-token", user: { id: 1, email: "x@test" } },
  });

  render(<Login />);

  fireEvent.change(screen.getByPlaceholderText(/Email/i), {
    target: { value: "x@test" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: "password" },
  });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() =>
    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      email: "x@test",
      password: "password",
    })
  );
  expect(localStorage.getItem("token")).toBe("test-token");
  expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
});
