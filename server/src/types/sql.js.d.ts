declare module 'sql.js' {
  interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer) => Database;
  }

  interface Database {
    run(sql: string, params?: any[]): void;
    exec(sql: string): void;
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
    getRowsModified(): number;
  }

  interface Statement {
    bind(params?: any[]): boolean;
    step(): boolean;
    get(params?: any[]): any;
    getAsObject(params?: any[]): any;
    getAsArray(params?: any[]): any[];
    free(): boolean;
    run(params?: any[]): boolean;
    reset(): boolean;
  }

  export default function initSqlJs(options?: { locateFile?: (file: string) => string }): Promise<SqlJsStatic>;
  export { Database, Statement };
}
