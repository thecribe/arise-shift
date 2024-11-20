import "./globals.css";

export const metadata = {
  title: "Manage Shifts",
  description:
    "App to automatically generate shift clockin time for arise nursing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className=" bg-gray-100">{children}</body>
    </html>
  );
}
