import { Route, Switch, useLocation } from 'wouter';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Burgers from './pages/Burgers';
import Cakes from './pages/Cakes';
import Biscuits from './pages/Biscuits';
import Sweets from './pages/Sweets';
import Bakery from './pages/Bakery';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import Admin from './pages/Admin';

import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ProductProvider } from './context/ProductContext';
import { UIProvider } from './context/UIContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { PromoCodeProvider } from './context/PromoCodeContext';
import { ShippingProvider } from './context/ShippingContext';
import { OrderProvider } from './context/OrderContext';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';

// ... imports

const NavbarWrapper = () => {
  const [location] = useLocation();
  const isAdmin = location.startsWith('/admin');
  const isCheckout = location.startsWith('/checkout');

  if (isAdmin || isCheckout) return null;
  return <Navbar />;
};

function App() {
  // Providers wrapped: Product > Toast > Favorites > Promo > Shipping > UI > Order > Cart
  return (
    <ToastProvider>
      <ProductProvider>
        <FavoritesProvider>
          <PromoCodeProvider>
            <ShippingProvider>
              <UIProvider>
                <OrderProvider>
                  <CartProvider>
                    <NavbarWrapper />
                    <Switch>
                      <Route path="/" component={Home} />
                      <Route path="/burgers" component={Burgers} />
                      <Route path="/cakes" component={Cakes} />
                      <Route path="/biscuits" component={Biscuits} />
                      <Route path="/sweets" component={Sweets} />
                      <Route path="/bakery" component={Bakery} />
                      <Route path="/wishlist" component={Wishlist} />
                      <Route path="/checkout" component={Checkout} />
                      <Route path="/track-order" component={TrackOrder} />
                      <Route path="/track-order/:orderId" component={TrackOrder} />
                      <Route path="/orders" component={Orders} />
                      <Route path="/admin" component={Admin} />
                      <Route>404: No food here!</Route>
                    </Switch>
                  </CartProvider>
                </OrderProvider>
              </UIProvider>
            </ShippingProvider>
          </PromoCodeProvider>
        </FavoritesProvider>
      </ProductProvider>
    </ToastProvider>
  );
}

export default App;
