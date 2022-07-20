import create, { State } from "zustand";
import { persist } from "zustand/middleware";
import { appID, authToken, request } from "../utils";

export interface Quiz {
  id: string
  firstname: string
  lastname: string
  email: string
  password: string
  created: string
}

export type QuizCredentials = {
  firstname: string
  lastname: string
  email: string
  password: string
  cpassword: string
}

interface QuizState extends State {
  quizzes: Quiz[]
  userQuizzes: Quiz[]
  currentQuiz?: Quiz
}

interface QuizMethods extends State {
  restoreDefault: () => void
  publishQuiz: (
    credentials: QuizCredentials
  ) => Promise<any>
  setQuiz: (
    quiz: Quiz
  ) => void
  getQuizzes: () => Promise<any>
  getUserQuizzes: () => Promise<any>
  getQuiz: (
    link: string
  ) => Promise<any>
}

export const useQuizStore = create<QuizState & QuizMethods>(
  persist(
    (set, get) => ({
      quizzes: [],
      userQuizzes: [],
      currentQuiz: undefined,
      restoreDefault: () => {
        console.log('restore auth to default...')
        set({
          quizzes: [],
          userQuizzes: [],
          currentQuiz: undefined,
        })
      },
      setQuiz: (quiz) => {
        set({
          currentQuiz: quiz
        })
      },
      publishQuiz: async (credentials) => {
        return await request('/quiz', 'POST', JSON.stringify(credentials), {
          ...authToken()
        })
          .then(async resp => {
            if (resp.status === true) {
              set({
                currentQuiz: resp.data.quiz
              })
            }
            return resp
          })
      },
      getQuizzes: async () => {
        return await request('/quiz', 'GET', undefined)
          .then(async resp => {
            if (resp.status === true) {
              set({
                quizzes: resp.data.quizzes
              })
            }
            return resp
          })
      },
      getUserQuizzes: async () => {
        return await request('/quiz/list', 'GET', undefined, {
          ...authToken()
        })
          .then(async resp => {
            if (resp.status === true) {
              set({
                userQuizzes: resp.data.quizzes
              })
            }
            return resp
          })
      },
      getQuiz: async (link) => {
        return await request('/quiz/' + link, 'GET', undefined)
          .then(async resp => {
            if (resp.status === true) {
              set({
                currentQuiz: resp.data.quiz
              })
            }
            return resp
          })
      },
    }), {
    name: appID + '.quiz'
  })
)
