import type { ImageMetadata } from "astro";
import chrome from "@/assets/apps/chrome.png";
import discord from "@/assets/apps/discord.png";
import epic from "@/assets/apps/epic.png";
import notepadpp from "@/assets/apps/notepadpp.png";
import obs from "@/assets/apps/obs.png";
import spotify from "@/assets/apps/spotify.png";
import steam from "@/assets/apps/steam.png";
import vlc from "@/assets/apps/vlc.png";
import vscode from "@/assets/apps/vscode.png";
import winrar from "@/assets/apps/winrar.png";

/** Apps da fila de exemplo, com os mesmos ícones oficiais que o CoreBi usa. */
export const queue: readonly { name: string; icon: ImageMetadata }[] = [
  { name: "Steam", icon: steam },
  { name: "Discord", icon: discord },
  { name: "Spotify", icon: spotify },
  { name: "Chrome", icon: chrome },
  { name: "VLC", icon: vlc },
  { name: "OBS Studio", icon: obs },
  { name: "Epic Games", icon: epic },
  { name: "WinRAR", icon: winrar },
  { name: "Notepad++", icon: notepadpp },
  { name: "VS Code", icon: vscode },
];

/** Linhas da colmeia (3, 4, 3). */
export const honeycomb = [3, 4, 3] as const;
