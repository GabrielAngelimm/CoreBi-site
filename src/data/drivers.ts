/** Exemplo de atualização de driver mostrado na seção Drivers. */
export const driverExample = {
  device: "GeForce RTX 4060 Ti",
  vendor: "NVIDIA",
  installed: "619.12",
  latest: "621.24",
  /** Duração de cada passo na demonstração, em ms: tudo acaba em uns dois segundos. */
  steps: [
    { title: "Backup dos drivers atuais", detail: "214 drivers", ms: 420 },
    { title: "Download do site da NVIDIA", detail: "612 MB", ms: 760, count: 612 },
    { title: "Assinatura conferida", detail: "NVIDIA Corporation", ms: 320 },
    { title: "Driver instalado", detail: "sem reiniciar", ms: 520 },
  ],
} as const;
