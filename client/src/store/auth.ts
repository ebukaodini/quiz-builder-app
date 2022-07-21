import create, { State } from "zustand";
import { persist } from "zustand/middleware";
import { appID, request } from "../utils";
import { useQuizStore } from "./quiz";

export interface User {
  id: string
  firstname: string
  lastname: string
  email: string
  password: string
  created: string
}

export type RegisterCredentials = {
  firstname: string
  lastname: string
  email: string
  password: string
  cpassword: string
}

export type LoginCredentials = {
  email: string
  password: string
}

interface AuthState extends State {
  authenticated: boolean
  authToken: string
  user?: User
}

interface AuthMethods extends State {
  restoreDefault: () => void
  createAccount: (
    credentials: RegisterCredentials
  ) => Promise<any>
  login: (
    credentials: { email: string, password: string }
  ) => Promise<any>
  logout: () => void
}

export const useAuthStore = create<AuthState & AuthMethods>(
  persist(
    (set, get) => ({
      authenticated: false,
      authToken: '',
      user: undefined,
      restoreDefault: () => {
        console.log('restore auth to default...')
        set({
          authenticated: false,
          authToken: '',
          user: undefined
        })
      },
      createAccount: async (credentials) => {
        return await request('/auth/register', 'POST', JSON.stringify(credentials))
          .then(async resp => {
            if (resp.status === true) {
              set({
                user: resp.data.user,
                authToken: resp.data.authToken,
                authenticated: true
              })

              // get user quizzes
              await useQuizStore.getState().getUserQuizzes()

            }
            return resp
          })
      },
      login: async (credentials) => {
        return await request('/auth/login', 'POST', JSON.stringify(credentials))
          .then(async resp => {
            if (resp.status === true) {
              set({
                user: resp.data.user,
                authToken: resp.data.authToken,
                authenticated: true
              })

              // get user quizzes
              await useQuizStore.getState().getUserQuizzes()

            }
            return resp
          })
      },
      logout: () => {
        get().restoreDefault()
        useQuizStore.getState().restoreDefault()
      }
    }), {
    name: appID + '.auth'
  })
)
