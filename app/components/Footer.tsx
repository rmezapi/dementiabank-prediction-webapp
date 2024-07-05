import React from 'react';
import '/styles/Global.css';

export function links() {
    return [{ rel: "stylesheet", href: "/styles/Global.css" }];
  }

export function Footer() {
  return (
    <footer className="footer min-h-dvh bg-gray-100 p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Rodrigo Meza & CareYaya. All rights reserved.</p>
      </div>
    </footer>
  );
}