import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./auth";
import Cookies from "js-cookie";

// Mock js-cookie
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with null token when no cookie exists", () => {
    (Cookies.get as Mock).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should initialize with token from cookie", () => {
    const testToken = "test-token";
    (Cookies.get as Mock).mockReturnValue(testToken);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.token).toBe(testToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("should set token and cookie on login", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const testToken = "new-test-token";
    act(() => {
      result.current.login(testToken);
    });

    expect(result.current.token).toBe(testToken);
    expect(result.current.isAuthenticated).toBe(true);
    expect(Cookies.set).toHaveBeenCalledWith("authToken", testToken, {
      expires: 7,
    });
  });

  it("should clear token and remove cookie on logout", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(Cookies.remove).toHaveBeenCalledWith("authToken");
  });

  it("should throw error when useAuth is used outside of AuthProvider", () => {
    const useAuthWithoutProvider = () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      renderHook(() => useAuth());
    };

    expect(useAuthWithoutProvider).toThrow(
      "useAuth must be used within an AuthProvider",
    );
  });
});
