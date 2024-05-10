import { ReduxProvider } from "./stateManagement/provider";

import "./globals.css";
import Navbar from "./components/NavBar";
// App.js or App.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Footer from "./components/Footer";

library.add(faBars); // Add the sandwich (bars) icon to the library

export const metadata = {
  title: "Marcel  Rezende",
  description: "Production management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <ReduxProvider>
        <body className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">{children}</div>
          <Footer />
        </body>
      </ReduxProvider>
    </html>
  );
}
