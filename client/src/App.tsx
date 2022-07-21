import React, { Suspense, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom'
import { ConfirmModal, LoadingModal, ToastWrapper } from './components';
import { Unknown, Login, Register, Quizzes, CreateQuiz, UserQuizzes, UserQuizDetails, AttemptQuiz, } from './pages';
import { useQuizStore } from './store';
import { once } from './utils';

function App() {

  const { getQuizzes } = useQuizStore()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded === false) {
      return once(
        () => getQuizzes().then(_ => {
          setLoaded(true)
        })
      )
    }
  }, [getQuizzes, loaded])

  return (
    <>
      <ToastWrapper />
      <LoadingModal />
      <ConfirmModal />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {/* Quiz */}
          <Route exact path='/' component={Quizzes} />
          <Route exact path='/q/:permalink' component={AttemptQuiz} />
          <Route exact path='/create' component={CreateQuiz} />
          <Route exact path='/list' component={UserQuizzes} />
          <Route exact path='/list/:permalink' component={UserQuizDetails} />
          
          {/* Onboarding routes */}
          <Route exact path='/auth/register' component={Register} />
          <Route exact path='/auth/login' component={Login} />
          
          {/* Unknown Page */}
          <Route component={Unknown} />
        </Switch>
      </Suspense>
    </>
  );
}

export default App;
