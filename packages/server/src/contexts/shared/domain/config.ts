export interface Config {
  port: number | string;
  supabaseKey: string;
  supabaseUrl: string;
  origins: string[];
  rpName: string;
  rpID: string;
  jwtSecret: string;
}
