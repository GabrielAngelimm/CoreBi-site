import { site } from "@/config/site";

/** A versão publicada do app, como o site precisa dela. */
export interface Release {
  readonly version: string;
  readonly pageUrl: string;
  readonly publishedAt: string;
  readonly installer: {
    readonly name: string;
    readonly url: string;
    readonly sizeBytes: number;
    readonly sha256: string | null;
  };
}

/** Usada quando o GitHub não responde no build. Atualize junto com cada release. */
const fallback: Release = {
  version: "1.0.0",
  pageUrl: `${site.links.releases}/tag/v1.0.0`,
  publishedAt: "2026-11-23T21:38:51Z",
  installer: {
    name: "CoreBi-1.0.0-win-x64-setup.exe",
    url: `${site.links.releases}/download/v1.0.0/CoreBi-1.0.0-win-x64-setup.exe`,
    sizeBytes: 57_966_303,
    sha256: "226ea7e8d04b7491afab46c69453e4e2d5019d367d6172a9a1c7d2d928136228",
  },
};

interface GitHubAsset {
  name: string;
  size: number;
  browser_download_url: string;
  digest?: string | null;
}

interface GitHubRelease {
  tag_name: string;
  html_url: string;
  published_at: string;
  assets: GitHubAsset[];
}

const installerPattern = /-win-x64-setup\.exe$/i;

function parse(data: GitHubRelease): Release | null {
  const asset = data.assets.find((a) => installerPattern.test(a.name));
  if (!asset) return null;
  const sha256 = asset.digest?.startsWith("sha256:") ? asset.digest.slice(7) : null;
  return {
    version: data.tag_name.replace(/^v/, ""),
    pageUrl: data.html_url,
    publishedAt: data.published_at,
    installer: {
      name: asset.name,
      url: asset.browser_download_url,
      sizeBytes: asset.size,
      sha256,
    },
  };
}

let cached: Promise<Release> | undefined;

/**
 * Lê a última release do CoreBi no momento do build.
 * Uma release nova do app dispara um novo deploy (deploy hook da Vercel), então o site nunca fica para trás.
 */
export function getLatestRelease(): Promise<Release> {
  cached ??= (async () => {
    const { owner, name } = site.repo;
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    const token = process.env["GITHUB_TOKEN"];
    if (token) headers["Authorization"] = `Bearer ${token}`;
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${name}/releases/latest`, {
        headers,
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`GitHub respondeu ${res.status}`);
      return parse((await res.json()) as GitHubRelease) ?? fallback;
    } catch (error) {
      console.warn(`[release] usando a versão de reserva ${fallback.version}:`, error);
      return fallback;
    }
  })();
  return cached;
}
