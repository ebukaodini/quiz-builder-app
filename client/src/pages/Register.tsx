import styled from "styled-components"
import { Button, ErrorList, Input, LinkText, PageWrapper, Spinner } from "../components"
import Logo from '../assets/textlogo.svg'
import { useState } from "react"
import { useAuthStore, RegisterCredentials, useModalStore } from "../store"
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

export const Register: React.FC<{}> = () => {
  const { createAccount } = useAuthStore()
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    cpassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({})
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
      const resp = await createAccount(credentials)
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
              <h2 className="m-0">Create an account</h2>
              <p className="m-0">Create an account to add quizzes.</p>
            </div>

            <div className="mb-3">
              <label className="mb-1" htmlFor="firstname">First name</label>
              <Input disabled={isSubmitting} required
                onChange={(e) => handleChange('firstname', e.target.value)}
                type="text" className="form-control py-2 px-3 text-dark"
                id="firstname" placeholder="Jane" />
              {errors?.firstname && <ErrorList errors={errors.firstname} />}
            </div>

            <div className="mb-3">
              <label className="mb-1" htmlFor="lastname">Last name</label>
              <Input disabled={isSubmitting} required
                onChange={(e) => handleChange('lastname', e.target.value)}
                type="text" className="form-control py-2 px-3 text-dark"
                id="lastname" placeholder="Doe" />
              {errors?.lastname && <ErrorList errors={errors.lastname} />}
            </div>

            <div className="mb-3">
              <label className="mb-1" htmlFor="email">Email address</label>
              <Input disabled={isSubmitting} required
                onChange={(e) => handleChange('email', e.target.value)}
                type="email" className="form-control py-2 px-3 text-dark"
                id="email" placeholder="janedoe@example.com" />
              {errors?.email && <ErrorList errors={errors.email} />}
            </div>

            <div className="mb-3">
              <label className="mb-1" htmlFor="password">Password</label>
              <div className="position-relative">
                <Input disabled={isSubmitting} required
                  onChange={(e) => handleChange('password', e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  className="form-control py-2 px-3 text-dark"
                  id="password" placeholder="********" />
                <button aria-label='toggle password' type="button"
                  onClick={toggleShowPassword} title='Toggle password'
                  className="bg-transparent text-grey border-0 position-absolute top-50 end-0 translate-middle p-0 pb-1">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors?.password && <ErrorList errors={errors.password} />}
            </div>

            <div className="mb-5">
              <label className="mb-1" htmlFor="password">Confirm Password</label>
              <div className="position-relative">
                <Input disabled={isSubmitting} required
                  onChange={(e) => handleChange('cpassword', e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  className="form-control py-2 px-3 text-dark"
                  id="password" placeholder="********" />
                <button aria-label='toggle password' type="button"
                  onClick={toggleShowPassword} title='Toggle password'
                  className="bg-transparent text-grey border-0 position-absolute top-50 end-0 translate-middle p-0 pb-1">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors?.cpassword && <ErrorList errors={errors.cpassword} />}
            </div>

            <div className="text-center w-lg-60 mx-auto">
              <Button title='create account' disabled={isSubmitting} type="submit" className="btn-lg btn-primary w-100 mb-2">
                {isSubmitting ? <Spinner label="Creating account..." /> : 'Submit'}
              </Button>
              <span>Already have an account? <LinkText title='Go to Login' to='/auth/login'>Login.</LinkText></span>
            </div>

          </Form>

        </FormWrapper>

      </PageWrapper>
    </div>
  )
}
