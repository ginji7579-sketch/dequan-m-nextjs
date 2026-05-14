import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import WebsitePricing from "./pages/WebsitePricing";
import MediaMarketingPricing from "./pages/marketing-pricing";
import { LanguageProvider } from "./contexts/LanguageContext";

/**
 * App Component - Main application router and theme provider
 * Design Philosophy: Modern Business Minimalism
 * - Light theme with brand colors (Teal and Orange)
 * - Clean, professional aesthetic
 */
function Router() {
  return (
    <Switch>
      {/* 更具體的路徑優先 */}
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/privacy"} component={PrivacyPolicy} />
      <Route path={"/website-pricing"} component={WebsitePricing} />
      <Route path={"/media-marketing-pricing"} component={MediaMarketingPricing} />
      <Route path={"/404"} component={NotFound} />
      {/* 根路徑放在最後 */}
      <Route path={"/"} component={Home} />
      {/* 最終 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;