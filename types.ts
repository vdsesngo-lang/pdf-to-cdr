export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ConvertedFile {
  originalName: string;
  svgContent: string;
  timestamp: number;
}
