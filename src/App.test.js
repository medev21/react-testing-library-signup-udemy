import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App';


const typeIntoForm = ({ email=null, password=null, confirmPassword=null}) => {
  const emailInputElement = screen.getByRole('textbox', {
    name: /email/i
  })
  const passwordInputElement = screen.getByLabelText('Password')
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i)
  if(email){
    userEvent.type(emailInputElement, email)
  }
  if(passwordInputElement){
    userEvent.type(passwordInputElement, password)
  }
  if(confirmPasswordInputElement){
    userEvent.type(confirmPasswordInputElement, confirmPassword)
  }

  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement
  }
}

const clickSubmitBtn = () => {
  const submitBtnElement = screen.getByRole('button', {
    name: /submit/i,
  })

  userEvent.click(submitBtnElement)
}

describe('App', () => {
  test("inputs should be intially empty", () => {
    render(<App />)
  
    const emailInputElement = screen.getByRole('textbox')
    const passwordInputElement = screen.getByLabelText('Password')
    const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i)
  
    expect(emailInputElement.value).toBe('')
    expect(passwordInputElement.value).toBe('')
    expect(confirmPasswordInputElement.value).toBe('')
  })
  
  test('should be able to type an email', () => {
    render(<App />)
  
    const { emailInputElement } = typeIntoForm({email: 'selena@gmail.com'})
    expect(emailInputElement.value).toBe('selena@gmail.com')
  })
  
  test('should be able to type a password', () => {
    render(<App />)
  
    const { passwordInputElement } = typeIntoForm({password: 'secret password'})
  
    expect(passwordInputElement.value).toBe('secret password')
  })
  
  test('should be able to type confirm password', () => {
    render(<App />)
    
    const { confirmPasswordInputElement } = typeIntoForm({confirmPassword: 'secret password'})
    expect(confirmPasswordInputElement.value).toBe('secret password')
  })
  
  describe('Error handling', () => {
    test('should show email error message on invalid email', () => {
      render(<App />)
    
      const emailErrorElement = screen.queryByText(/the email you input is invalid/i)
    
      expect(emailErrorElement).not.toBeInTheDocument()
    
      typeIntoForm({email: 'selenagmail.com'})
      clickSubmitBtn()
    
      const emailErrorElementAgain = screen.queryByText(/the email you input is invalid/i)
      expect(emailErrorElementAgain).toBeInTheDocument();
    })
    
    test('should show password error if the password is less than 5 characters', () => {
      render(<App />)
    
      const passwordErrorElement = screen.queryByText(/the password you entered should contain 5 or more characters/i)
    
      typeIntoForm({email: 'selena@gmail.com'})
    
      expect(passwordErrorElement).not.toBeInTheDocument();
    
      typeIntoForm({password: '123'})
      clickSubmitBtn();
    
      const passwordErrorElementAgain = screen.queryByText(/the password you entered should contain 5 or more characters/i)
    
      expect(passwordErrorElementAgain).toBeInTheDocument();
    
    })
    
    test('should show confirm password error if passwords dont match', () => {
      render(<App />)
    
    
      const passwordErrorElement = screen.queryByText(/the passwords don't match. try again/i)
    
      expect(passwordErrorElement).not.toBeInTheDocument();
    
      typeIntoForm({email: 'selena@gmail.com', password: '123456', confirmPassword: '123'})
      clickSubmitBtn();
    
      const passwordErrorElementAgain = screen.queryByText(/the passwords don't match. try again./i)
    
      expect(passwordErrorElementAgain).toBeInTheDocument();
    
    })
    
    test('should show no error message if every input is valid', () => {
      render(<App />)
    
      typeIntoForm({email: 'selena@gmail.com', password: '123456', confirmPassword: '123456'})
      clickSubmitBtn();
    
      const emailErrorElement = screen.queryByText(/the email you input is invalid/i)
      const passwordErrorElementAgain = screen.queryByText(/the password you entered should contain 5 or more characters/i)
      const confirmPasswordErrorElementAgain = screen.queryByText(/the passwords don't match. try again./i)
    
      expect(emailErrorElement).not.toBeInTheDocument()
      expect(passwordErrorElementAgain).not.toBeInTheDocument();
      expect(confirmPasswordErrorElementAgain).not.toBeInTheDocument();
    
    })
  })
})
