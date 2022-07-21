import create, { State } from "zustand";
import { persist } from "zustand/middleware";
import { appID, authToken, request } from "../utils";
import { User } from "./auth";

export interface Question {
  order: number,
  type: 'single' | 'multiple',
  question: string,
  answers: {
    option: string,
    isAnswer: boolean,
    isSelected?: boolean
  }[]
}

export interface Quiz {
  id: string
  title: string
  user?: Partial<User>
  permalink: string
  attempt: number
  questions: Question[]
  created: string
}

export type QuizCredentials = {
  title: string
  questions: Question[]
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
  attemptQuiz: (
    link: string
  ) => Promise<any>
  deleteQuiz: (
    id: string
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
              await get().getQuizzes()
              await get().getUserQuizzes()
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
                quizzes: resp.data.list
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
                userQuizzes: resp.data.list
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
      attemptQuiz: async (link) => {
        return await request('/quiz/' + link, 'PATCH', undefined)
          .then(async resp => {
            if (resp.status === true) {
              await get().getQuizzes()
            }
            return resp
          })
      },
      deleteQuiz: async (id) => {
        return await request('/quiz/' + id, 'DELETE', undefined, {
          ...authToken()
        })
          .then(async resp => {
            if (resp.status === true) {
              await get().getQuizzes()
              await get().getUserQuizzes()
            }
            return resp
          })
      },
    }), {
    name: appID + '.quiz'
  })
)
