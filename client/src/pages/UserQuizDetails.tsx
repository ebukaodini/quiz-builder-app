import styled from "styled-components"
import { Button, CheckboxInput, PageWrapper } from "../components"
import Logo from '../assets/textlogo.svg'
import { Question, Quiz, useAuthStore, useModalStore, useQuizStore } from "../store"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { formatDate, once } from "../utils"

const ImgLogo = styled.img`
  height: 40px !important;
  width: fit-content;
`
const Hero = styled.div`
  height: 10vh;
  width: 100%;
`

export const UserQuizDetails: React.FC<{}> = () => {

  const { userQuizzes, deleteQuiz } = useQuizStore()
  const { authenticated } = useAuthStore()
  const { push, goBack } = useHistory()
  const { permalink } = useParams<{ permalink: string }>()
  const { toast, loading, confirm } = useModalStore()
  const [quiz, setQuiz] = useState<Quiz>()
  const [currentQuestion, setCurrentQuestion] = useState<Question>()
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 10
  })

  useEffect(() => {
    return once(() => {
      if (authenticated === false) push('/auth/login')
    })
  }, [authenticated, push])

  useEffect(() => {
    loading(true, 'Loading quiz...')
    return once(() => {
      const quiz = userQuizzes.find(quiz => quiz.permalink === permalink)
      loading(false)
      if (quiz === undefined) {
        goBack()
        toast('Quiz not found', 'danger')
        return
      }
      setQuiz(quiz)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goBack, permalink, toast])

  useEffect(() => {
    setCurrentQuestion(quiz?.questions[(pagination.current - 1)])
  }, [pagination, quiz?.questions])

  const handleNextQuestion = () => {
    setPagination({ ...pagination, current: pagination.current + 1 })
  }
  const handlePreviousQuestion = () => {
    setPagination({ ...pagination, current: pagination.current - 1 })
  }
  const handleDelete = () => {
    confirm('Are you sure you want to delete this quiz?', 'danger', async () => {
      try {
        loading(true, 'Deleting quiz...')
        const resp = await deleteQuiz(quiz?.id!)
        loading(false)

        if (resp.status === true) {
          toast(resp.message)
          goBack()
        } else {
          toast(resp.message, 'danger', false)
        }
      } catch (error: any) {
        loading(false)
        toast(error.message, 'danger')
      }
    })
  }

  return (
    <div>
      <PageWrapper noContainer={true}>

        <Hero className="w-100 bg-light border-bottom mb-3">

          <div className="w-100 h-100 container d-flex justify-content-between">

            <div className="d-flex flex-column justify-content-center al ign-items-center">
              <ImgLogo src={Logo} alt="Quiz App" title="Quiz App" />
              <h6 className="ms-5 m-0">My Quizzes - Details</h6>
            </div>

            <div className="d-flex gap-2 my-auto">
              <Button onClick={goBack}
                className="btn-sm btn-muted border-0 text-primary py-2 px-3" title='Go back'>Back</Button>
              <Button onClick={handleDelete}
                className="btn-sm btn-danger text-light py-2 px-3" title='Delete quiz'>Delete quiz</Button>
            </div>

          </div>

        </Hero>

        <div className="container w-100 mb-5">

          <div className="d-flex mb-5 justify-content-between align-items-center">
            <div className="d-flex flex-column gap-1">
              <h1 className="m-0">{quiz?.title}</h1>
              <span>{formatDate(quiz?.created!)}</span>
            </div>
            <span>Question {pagination.current}</span>
          </div>

          <div className="mb-5 w-100 d-flex flex-column gap-1">
            <span className="fs-4">{currentQuestion?.question}</span>
            <span className="fs-7 text-danger"><b>NOTE:</b> This is a {currentQuestion?.type} choice question.</span>
          </div>

          <div>
            {
              currentQuestion?.answers.map((answer, index) =>
                <div key={index} className="mb-2 d-flex align-items-center py-0 px-2 gap-4">
                  <CheckboxInput className="form-check" readOnly={true} checked={answer.isAnswer} />
                  <span className="fs-5">{answer.option}</span>
                </div>
              )
            }
          </div>

        </div>

      </PageWrapper>

      <div className="w-100 position-fixed start-0 end-0 bottom-0 mt-5">
        <div className="container w-100 bg-white py-2 px-3 shadow-sm d-flex justify-content-between align-items-center">
          <span className="text-secondary">Question {pagination.current} of {quiz?.questions.length!}</span>

          <div className="d-flex gap-2">
            <Button disabled={pagination.current <= 1}
              title='Previous' onClick={handlePreviousQuestion} className="btn-sm btn-outline-secondary border-secondary py-2 px-3"
            >Previous</Button>


            <Button disabled={pagination.current === quiz?.questions.length}
              className="btn-sm btn-outline-secondary border-secondary py-2 px-3"
              title='Next' onClick={handleNextQuestion}
            >Next</Button>
          </div>
        </div>
      </div>
    </div >


  )
}
