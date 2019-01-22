type KoaNext = () => Promise<any>

type TimestampColumn = { type: 'timestamptz'; default: 'now()' }
interface TimestampColumns {
  createdAt?: TimestampColumn
  updatedAt?: TimestampColumn
}

type LogLevelType = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'

declare const __DEV__: boolean
declare const __PRIVATE_KEY__: string
declare const __PUBLIC_KEY__: string
declare const __REFRESH_PRIVATE_KEY__: string
declare const __REFRESH_PUBLIC_KEY__: string

declare namespace NodeJS {
  interface Global {
    __DEV__: boolean
    __PRIVATE_KEY__: string
    __PUBLIC_KEY__: string
    __REFRESH_PRIVATE_KEY__: string
    __REFRESH_PUBLIC_KEY__: string
    fetch: any
  }
}

declare module 'http' {
  interface IncomingMessage {
    user: {
      id: string
      role: RoleName
    }
  }
}
