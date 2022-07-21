import styled from "styled-components"

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
`

type props = {
  children: JSX.Element | JSX.Element[]
  noContainer?: boolean
  className?: string
}

export const PageWrapper: React.FC<props> = ({ children, noContainer, className }) => {

  return (
    <Wrapper className={`${noContainer === false && 'container'} bg-white text-dark h-100 ${className}`}>
      {children}
    </Wrapper>
  )
}