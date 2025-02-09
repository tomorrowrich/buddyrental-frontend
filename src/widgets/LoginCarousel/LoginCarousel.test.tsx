import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginCarousel } from "./LoginCarousel";
import "@testing-library/jest-dom";

// Mock Swiper modules
vi.mock("swiper/react", () => ({
  Swiper: ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style: React.CSSProperties;
  }) => (
    <div data-testid="swiper" style={style}>
      {children}
    </div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

vi.mock("swiper/modules", () => ({
  Autoplay: class AutoplayMock {},
}));

describe("LoginCarousel", () => {
  it("renders carousel with correct number of slides", () => {
    render(<LoginCarousel />);
    const slides = screen.getAllByTestId("swiper-slide");
    expect(slides).toHaveLength(3);
  });

  it("shows skeletons before images load", () => {
    render(<LoginCarousel />);
    const skeletons = screen.getAllByTestId("mui-skeleton");
    expect(skeletons).toHaveLength(3);
  });

  it("renders images with correct sources", () => {
    render(<LoginCarousel />);
    const images = screen.getAllByTestId("img");

    expect(images[0]).toHaveAttribute(
      "src",
      "https://picsum.photos/1920/1080?random=1",
    );
    expect(images[1]).toHaveAttribute(
      "src",
      "https://picsum.photos/1920/1080?random=2",
    );
    expect(images[2]).toHaveAttribute(
      "src",
      "https://picsum.photos/1920/1080?random=3",
    );
  });

  it("applies correct styles to swiper container", () => {
    render(<LoginCarousel />);
    const swiper = screen.getByTestId("swiper");

    expect(swiper).toHaveStyle({
      flex: "1",
      width: "100%",
      height: "75vh",
      borderRadius: "16px",
    });
  });

  it("handles image load events correctly", () => {
    render(<LoginCarousel />);
    const images = screen.getAllByTestId("img");
    const skeletons = screen.getAllByTestId("mui-skeleton");

    expect(skeletons).toHaveLength(3);
    expect(images[0]).toHaveStyle({ display: "none" });

    fireEvent.load(images[0]);

    expect(screen.getAllByTestId("mui-skeleton")).toHaveLength(2);
    expect(images[0]).toHaveStyle({ display: "block" });
  });

  it("maintains proper image dimensions", () => {
    render(<LoginCarousel />);
    const images = screen.getAllByTestId("img");

    images.forEach((img) => {
      expect(img).toHaveStyle({
        width: "100%",
        height: "100%",
        objectFit: "cover",
      });
    });
  });

  it("renders all images with correct alt text", () => {
    render(<LoginCarousel />);
    const images = screen.getAllByTestId("img");

    images.forEach((img, index) => {
      expect(img).toHaveAttribute("alt", `Slide ${index + 1}`);
    });
  });
});
