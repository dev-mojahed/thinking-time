import React from 'react';

export const BoltBadge: React.FC = () => {
  return (
    <a
      href="https://bolt.new/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 hover:scale-110 group"
      aria-label="Built with Bolt.new"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
        <img
          src="https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/refs/heads/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.svg"
          alt="Built with Bolt.new"
          className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-2xl"
        />
      </div>
    </a>
  );
};