/**
 * Ícones de traço (24×24), os mesmos do app. `.dot` marca os detalhes preenchidos.
 * Adicione aqui e use com <Icon name="..." />.
 */
export const icons = {
  cpu: '<rect x="5" y="5" width="14" height="14" rx="3"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M8.5 2v3M12 2v3M15.5 2v3M8.5 19v3M12 19v3M15.5 19v3M2 8.5h3M2 12h3M2 15.5h3M19 8.5h3M19 12h3M19 15.5h3"/>',
  gpu: '<rect x="2.5" y="6" width="19" height="10.5" rx="2"/><circle cx="8.5" cy="11.25" r="3"/><circle cx="15.5" cy="11.25" r="3"/><circle class="dot" cx="8.5" cy="11.25" r=".9"/><circle class="dot" cx="15.5" cy="11.25" r=".9"/><path d="M7 16.5v3h10v-3"/>',
  memory:
    '<rect x="2" y="6.5" width="20" height="10" rx="2"/><rect x="5.5" y="9.5" width="4.5" height="4" rx=".8"/><rect x="14" y="9.5" width="4.5" height="4" rx=".8"/><path d="M5.5 16.5v3M8 16.5v3M10.5 16.5v3M13.5 16.5v3M16 16.5v3M18.5 16.5v3"/>',
  storage:
    '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 12.5h18M6.5 15.25h5"/><circle class="dot" cx="17.5" cy="15.25" r="1"/>',
  board:
    '<rect x="3" y="3" width="18" height="18" rx="2.5"/><rect x="6.5" y="6.5" width="5.5" height="5.5" rx="1"/><path d="M15 6.5V12M18 6.5V12M6.5 16.5h11"/>',
  net: '<rect x="9" y="3.5" width="6" height="5" rx="1"/><path d="M12 8.5v4M5 15.5v-3h14v3M12 12.5v3"/><rect x="2.5" y="15.5" width="5" height="5" rx="1"/><rect x="9.5" y="15.5" width="5" height="5" rx="1"/><rect x="16.5" y="15.5" width="5" height="5" rx="1"/>',
  gauge:
    '<path d="M5.28 20.22A9.5 9.5 0 1 1 18.72 20.22M12 13.5l4.6-4.6"/><circle class="dot" cx="12" cy="13.5" r="1.6"/>',
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
  driver: '<path d="M12 3.5v11.5M7.5 10.5l4.5 4.5 4.5-4.5M4.5 20h15"/>',
  bag: '<rect x="4.5" y="7" width="15" height="14" rx="2"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/>',
  check: '<path d="M6 12.5l4 4 8-9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevronDown: '<path d="M6 9.5l6 6 6-6"/>',
  arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  arrowRight: '<path d="M2 12h42M36 5l8 7-8 7"/>',
  arrowUpRight: '<path d="M7 17 17 7M9 7h8v8"/>',
  github:
    '<path d="M9 19c-4.5 1.4-4.5-2.2-6.3-2.7M15 21.5v-3.6a3.1 3.1 0 0 0-.9-2.4c2.9-.3 6-1.4 6-6.4a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.4 0C6.1 1.8 5 2.1 5 2.1a4.6 4.6 0 0 0-.1 3.5 5 5 0 0 0-1.4 3.5c0 5 3.1 6.1 6 6.4a3.1 3.1 0 0 0-.9 2.4v3.6"/>',
  githubSolid:
    '<path class="solid" d="M12 2.2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2.2z"/>',
  play: '<path class="solid" d="M8 5.5v13l10-6.5z"/>',
} as const;

export type IconName = keyof typeof icons;
