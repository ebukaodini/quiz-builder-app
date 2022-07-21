import styled from "styled-components"
import { Button, CheckboxInput, PageWrapper } from "../components"
import Logo from '../assets/textlogo.svg'
import { Question, Quiz, useAuthStore, useModalStore, useQuizStore } from "../store"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { formatDate, once } from "../utils"
import { Check } from "react-feather"

const ImgLogo = styled.img`
  height: 40px !important;
  width: fit-content;
`
const Hero = styled.div`
  height: 10vh;
  width: 100%;
`

export const AttemptQuiz: React.FC<{}> = () => {

  const { quizzes } = useQuizStore()
  const { authenticated } = useAuthStore()
  const { replace, goBack } = useHistory()
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
      if (authenticated === false) replace('/auth/login')
    })
  }, [authenticated, replace])

  useEffect(() => {
    loading(true, 'Loading quiz...')
    return once(() => {
      const quiz = quizzes.find(quiz => quiz.permalink === permalink)
      loading(false)
      if (quiz === undefined) {
        replace('/')
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
  const handleancel = () => {
    confirm('Are you sure you want to cancel this quiz?', 'danger', async () => {
      goBack()
    })
  }
  const handleSubmitQuiz = () => {
    confirm('Are you sure you want to submit this quiz?', 'success', async () => {
      toast('Submitted!')
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
              <Button onClick={handleancel}
                className="btn-sm btn-danger text-light py-2 px-3" title='Cancel quiz'>Cancel quiz</Button>
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
                  <CheckboxInput className="form-check" readOnly={true} />
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


            {
              pagination.current === quiz?.questions.length ?
                <Button
                  className="btn-sm btn-success text-light py-2 px-3 d-flex gap-2 align-items-center"
                  title='Submit' onClick={handleSubmitQuiz}
                >
                  Submit
                  <Check size={16} />
                  </Button> :
                <Button disabled={pagination.current === quiz?.questions.length}
                  className="btn-sm btn-outline-secondary border-secondary py-2 px-3"
                  title='Next' onClick={handleNextQuestion}
                >Next</Button>
            }
          </div>
        </div>
      </div>
    </div >


  )
}
