declare module 'styled-components' {
  export interface DefaultTheme extends ITheme { }
}

export interface ITheme extends Record<any, string> { }

export const Theme: ITheme = {
  primary: '#a348e3',
  secondary: '#5362ab',
  light: '#f4e9fc',
  dark: '#2f3864',
  grey: '#bdc0cf',
  success: '#039855',
  warning: '#f79009',
  danger: '#ec5453'
}
