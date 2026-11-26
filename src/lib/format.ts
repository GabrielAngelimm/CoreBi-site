const sizeFormat = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** 57966303 → "55,3 MB" (base 1024, como o Windows mostra). */
export function formatSize(bytes: number): string {
  return `${sizeFormat.format(bytes / 1024 / 1024)} MB`;
}

/** Encurta um hash para leitura: "226ea7e8…136228". */
export function shortHash(hash: string, head = 8, tail = 6): string {
  return hash.length <= head + tail ? hash : `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}

/** Número em pt-BR com casas fixas: 61.4 → "61,4". */
export function decimal(value: number, digits = 1): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** Inteiro em pt-BR: 3850 → "3.850". */
export function integer(value: number): string {
  return Math.round(value).toLocaleString("pt-BR");
}

/** Segundos → "mm:ss". */
export function clock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escapa o texto e troca **trecho** por <b>trecho</b>. Seguro para `set:html`. */
export function emphasis(text: string): string {
  const escaped = text.replace(/[&<>"']/g, (c) => htmlEscapes[c] ?? c);
  return escaped.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}
