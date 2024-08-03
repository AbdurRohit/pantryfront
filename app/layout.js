import { Inter } from "next/font/google";
import ThemeRegistry from './ThemeRegistry';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pantry App",
  description: "A simple pantry management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}