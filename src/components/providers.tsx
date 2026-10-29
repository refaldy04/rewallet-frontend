"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
const theme = createTheme({
  palette: {
    primary: { main: "#18634a", dark: "#124d3a", contrastText: "#fff" },
    secondary: { main: "#d9f48b", contrastText: "#152d27" },
    background: { default: "#f5f7f3", paper: "#fff" },
    text: { primary: "#152d27", secondary: "#60726a" },
    error: { main: "#a63636" },
    divider: "#e1e7df",
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 46, padding: "11px 20px", borderRadius: 9 },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, variant: "outlined", size: "small" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { background: "#fff", minHeight: 48 },
        notchedOutline: { borderColor: "#d8e1d6" },
      },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 20, padding: 8 } } },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontSize: 13, alignItems: "center" },
      },
    },
  },
});
export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    // Retire the old Redux Persist payload, which could contain a bearer token and PIN.
    try {
      localStorage.removeItem("persist:auth");
    } catch {
      /* Storage can be disabled by the browser. */
    }
    const navigate = (event: Event) => {
      const path = (event as CustomEvent<string>).detail;
      if (path.startsWith("/login?") || path === "/onboarding/pin") {
        router.replace(path);
        router.refresh();
      }
    };
    window.addEventListener("rewallet-navigate", navigate);
    return () => window.removeEventListener("rewallet-navigate", navigate);
  }, [router]);
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}
