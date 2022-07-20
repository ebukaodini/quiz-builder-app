import styled from "styled-components"

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
`

type props = {
  children: JSX.Element | JSX.Element[]
  className?: string
}

export const PageWrapper: React.FC<props> = ({ children, className }) => {
  return (
    <Wrapper className={`container bg-white text-dark vh-100 ${className}`}>
      {children}
    </Wrapper>
  )
}