import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Rooms from "../pages/Rooms";

vi.mock("../services/api", () => ({ get: vi.fn() }));
import api from "../services/api";

beforeEach(() => {
  vi.clearAllMocks();
});

test("rooms page fetches and displays rooms", async () => {
  const sample = [
    {
      id: 1,
      roomNumber: "101",
      roomType: "Single",
      description: "Cozy",
      pricePerNight: 30,
      capacity: 1,
      bookings: [],
    },
  ];
  api.get.mockResolvedValue({ data: sample });

  render(<Rooms />);

  await waitFor(() => expect(api.get).toHaveBeenCalledWith("/rooms"));
  expect(await screen.findByText(/Room 101/i)).toBeInTheDocument();
});
