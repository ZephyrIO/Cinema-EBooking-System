'use client';
import localFont from "next/font/local";
import { useState } from "react";
import UserContext, { UserProvider } from "./components/UserContext";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/* export const metadata = {
  title: "Cinema E-Booking System",
  description: "Developed by Some Cool Dudes",
}; */

export default function RootLayout({ children }) {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserContext.Provider value={{userData, setUserData}}>
          {children}
        </UserContext.Provider>
      </body>
    </html>
  );
}
