export interface UsesSettings {
  readonly settings: Settings;
}

export class Settings {
  version = "0.0.0";
  debug = false;
  windowSettings: WindowSettings;
  spawnerSettings: SpawnerSettings;

  constructor(debug: boolean, windowSettings: WindowSettings, spawnerSettings: SpawnerSettings) {
    this.debug = debug;
    this.windowSettings = windowSettings;
    this.spawnerSettings = spawnerSettings;
  }
}

export class WindowSettings {
  width = 512;
  height = 512;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class SpawnerSettings {
  imagePool: Array<string> = [];
}

export function toString(settings: Settings) {
  // console.log(JSON.stringify(settings));
  return JSON.stringify(settings);
}

export function fromString(string: string): Settings {
  const newSettings: Settings = JSON.parse(string);
  return newSettings;
}

export function applyFromString(settings: Settings, string: string) {
  const newSettings: Settings = JSON.parse(string);
  Object.assign(settings, newSettings);

  // console.log(settings);
}