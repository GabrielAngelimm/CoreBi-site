/** Exemplo de atualização de driver mostrado na seção Drivers. */
export const driverExample = {
  device: "GeForce RTX 4060 Ti",
  vendor: "NVIDIA",
  installed: "619.12",
  latest: "621.24",
  steps: [
    { title: "Backup dos drivers atuais", detail: "214 drivers", ms: 1300 },
    { title: "Download do site da NVIDIA", detail: "612 MB", ms: 1900 },
    { title: "Assinatura conferida", detail: "NVIDIA Corporation", ms: 900 },
    { title: "Driver instalado", detail: "sem reiniciar", ms: 1600 },
  ],
} as const;
