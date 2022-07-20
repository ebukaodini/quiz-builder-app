import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom'
import { ConfirmModal, LoadingModal, ToastWrapper } from './components';
import { Unknown, Login, Register, Quizzes, } from './pages';

function App() {
  return (
    <>
      <ToastWrapper />
      <LoadingModal />
      <ConfirmModal />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {/* Onboarding routes */}
          <Route exact path='/' component={Quizzes} />
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
