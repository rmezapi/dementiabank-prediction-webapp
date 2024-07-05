import React from 'react';
import 'app/styles/Global.css';

export function links() {
    return [{ rel: "stylesheet", href: "/app/styles/Global.css" }];
  }

export function Footer() {
  return (
    <footer className="footer bg-gray-100 p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Rodrigo Meza. All rights reserved.</p>
      </div>
    </footer>
  );
}