import styled from "styled-components"
import { Button, Input, LinkText, PageWrapper, Spinner } from "../components"
import Logo from '../assets/textlogo.svg'
import { useState } from "react"
import { useAuthStore, LoginCredentials, useModalStore } from "../store"
import { Eye, EyeOff } from "react-feather"
import { useHistory } from "react-router-dom"

const FormWrapper = styled.div`
  @media (min-width: 768px) {
    width: 45%;
    margin: auto;
  }
`
const LogoWrapper = styled.div`
  height: 30px;
  width: fit-content;
`
const Form = styled.form``

export const Login: React.FC<{}> = () => {
  const { login } = useAuthStore()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { push } = useHistory()
  const { toast } = useModalStore()

  const toggleShowPassword = () => setShowPassword(!showPassword)
  const handleChange = (input: string, value: string) => {
    setCredentials({ ...credentials, [input]: value })
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setIsSubmitting(true)
      const resp = await login(credentials)
      setIsSubmitting(false)
      if (resp.status === true) {
        toast(resp.message)
        push('/')
      } else {
        toast(resp.message, 'danger')
        setErrors(errors)
      }
    } catch (error: any) {
      setIsSubmitting(false)
      toast(error.message, 'danger')
    }
  }

  return (
    <div>
      <PageWrapper className="vh-100">

        <FormWrapper className="h-100 d-flex align-items-center justify-content-center">

          <Form onSubmit={handleSubmit} className="w-lg-70 bg-white px-4 pt-4 pb-5">

            <LogoWrapper className="w-100 d-flex justify-content-center mb-2">
              <img src={Logo} alt="Quiz App" title="Quiz App" />
            </LogoWrapper>

            <div className="mb-5 text-center">
              <h2 className="m-0">Log in to your account</h2>
              <p className="m-0">Enter your credentials to see your quiz.</p>
            </div>

            <div className="mb-3">
              <label className="mb-1" htmlFor="email">Email address</label>
              <Input disabled={isSubmitting} required onChange={(e) => handleChange('email', e.target.value)} type="email" className="form-control py-2 px-3 text-dark" id="email" placeholder="jane.doe@example.com" />
            </div>

            <div className="mb-5">
              <label className="mb-1" htmlFor="password">Password</label>

              <div className="position-relative">
                <Input disabled={isSubmitting} required onChange={(e) => handleChange('password', e.target.value)} type={showPassword ? 'text' : 'password'} className="form-control py-2 px-3 text-dark" id="password" placeholder="********" />
                <button aria-label='toggle password' type="button" onClick={toggleShowPassword} title='Toggle password' className="bg-transparent border-0 position-absolute top-50 end-0 translate-middle p-0 pb-1">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

            </div>

            <div className="text-center w-100">
              <Button title='Login' disabled={isSubmitting} type="submit" className="btn-lg btn-primary w-100 mb-2">
                {isSubmitting ? <Spinner label="Logging in..." /> : 'Login'}
              </Button>
              <span>Don't have an account? <LinkText title='Go to Register' to='/auth/register'>Create an account.</LinkText></span>
            </div>

          </Form>

        </FormWrapper>

      </PageWrapper>
    </div>
  )
}
