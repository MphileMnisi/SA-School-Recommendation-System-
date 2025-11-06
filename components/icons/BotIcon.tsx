import React from 'react';

export const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 7h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
    <path d="M9 7H7a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2" />
    <path d="M8 15v1a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1" />
    <path d="M12 5V3" />
    <path d="M9 11v-1" />
    <path d="M15 11v-1" />
  </svg>
);
