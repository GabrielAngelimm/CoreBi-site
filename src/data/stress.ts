/** Números da demonstração do teste de carga. Um passo vale 5 s; 120 passos são 10 min. */
export const stress = {
  min: 30,
  max: 92,
  cut: 85,
  steps: 120,
  /** temperatura do processador parado, antes do teste */
  start: 42,
} as const;

/**
 * Os dois PCs que a demonstração alterna. `cpu` e `gpu` são onde cada temperatura
 * estabilizaria; `k` é a rapidez com que sobe. No cooler fraco o processador passaria de
 * 85 °C, então o teste para antes.
 */
export const scenarios = [
  { label: "Cooler bom", cpu: 77, gpu: 71, k: 0.06 },
  { label: "Cooler fraco", cpu: 96, gpu: 73, k: 0.045 },
] as const;
