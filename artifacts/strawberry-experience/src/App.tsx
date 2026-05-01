import { Route, Switch } from "wouter";
import StrawberryExperience from "@/pages/StrawberryExperience";
import MenuPage from "@/pages/MenuPage";
import OrderPage from "@/pages/OrderPage";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={StrawberryExperience} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/order" component={OrderPage} />
      <Route>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060004", color: "#ffb3c6", fontSize: "1.5rem" }}>
          Page not found — <a href="/" style={{ color: "#ff6b9d", marginLeft: "0.5rem" }}>Go Home</a>
        </div>
      </Route>
    </Switch>
  );
}
