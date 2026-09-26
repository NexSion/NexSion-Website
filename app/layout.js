import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "NexSion — Visual Bookmark Workspace",
  description:
    "Turn your new tab into a visual, drag-and-drop bookmark workspace with quick save, smart search, and Google sign-in sync.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          {children}
          <footer className="site-footer">
            NexSion — built by Arabi Islam. Not affiliated with Google.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
