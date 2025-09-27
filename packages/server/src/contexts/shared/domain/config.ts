export interface Config {
  port: number | string;
  supabaseKey: string;
  origins: string[];
  rpName: string;
  rpID: string;
  jwtSecret: string;
}
