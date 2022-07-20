import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App';

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
  const emailInputElement = screen.getByRole('textbox', {
    name: /email/i
  })

  userEvent.type(emailInputElement, 'selena@gmail.com')
  expect(emailInputElement.value).toBe('selena@gmail.com')
})

test('should be able to type a password', () => {
  render(<App />)
  const passwordInputElement = screen.getByLabelText('Password')

  userEvent.type(passwordInputElement, 'secret password')
  expect(passwordInputElement.value).toBe('secret password')
})

test('should be able to type confirm password', () => {
  render(<App />)
  const passwordInputElement = screen.getByLabelText(/confirm password/i)

  userEvent.type(passwordInputElement, 'secret password')
  expect(passwordInputElement.value).toBe('secret password')
})

test('should show email error message on invalid email', () => {
  render(<App />)

  const emailErrorElement = screen.queryByText(/the email you input is invalid/i)
  const emailInputElement = screen.getByRole('textbox', {
    name: /email/i
  })
  const submitBtnElement = screen.getByRole('button', {
    name: /submit/i,
  })

  expect(emailErrorElement).not.toBeInTheDocument()

  userEvent.type(emailInputElement, 'selenagmail.com')
  userEvent.click(submitBtnElement)

  const emailErrorElementAgain = screen.queryByText(/the email you input is invalid/i)
  expect(emailErrorElementAgain).toBeInTheDocument();
})

test('should show password error if the password is less than 5 characters', () => {
  render(<App />)

  const emailInputElement = screen.getByRole('textbox', {
    name: /email/i
  })

  const passwordErrorElement = screen.queryByText(/the password you entered should contain 5 or more characters/i)
  const submitBtnElement = screen.getByRole('button', {
    name: /submit/i,
  })
  const passwordInputElement = screen.getByLabelText('Password')

  userEvent.type(emailInputElement, 'selena@gmail.com')

  expect(passwordErrorElement).not.toBeInTheDocument();

  userEvent.type(passwordInputElement, '123')

  userEvent.click(submitBtnElement)

  const passwordErrorElementAgain = screen.queryByText(/the password you entered should contain 5 or more characters/i)

  expect(passwordErrorElementAgain).toBeInTheDocument();

})

test('should show confirm password error if passwords dont match', () => {
  render(<App />)

  const emailInputElement = screen.getByRole('textbox', {
    name: /email/i
  })

  const passwordErrorElement = screen.queryByText(/the passwords don't match. try again/i)
  const submitBtnElement = screen.getByRole('button', {
    name: /submit/i,
  })

  const passwordInputElement = screen.getByLabelText('Password')
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i)

  expect(passwordErrorElement).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'selena@gmail.com')
  userEvent.type(passwordInputElement, '123456')
  userEvent.type(confirmPasswordInputElement, '123')

  userEvent.click(submitBtnElement)

  const passwordErrorElementAgain = screen.queryByText(/the passwords don't match. try again./i)

  expect(passwordErrorElementAgain).toBeInTheDocument();

})

test('should show no error message if every input is valid', () => {
  render(<App />)

  const emailInputElement = screen.getByRole('textbox', {
    name: /email/i
  })
  const passwordInputElement = screen.getByLabelText('Password')
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i)
  const submitBtnElement = screen.getByRole('button', {
    name: /submit/i,
  })

  userEvent.type(emailInputElement, 'selena@gmail.com')
  userEvent.type(passwordInputElement, '123456')
  userEvent.type(confirmPasswordInputElement, '123456')

  userEvent.click(submitBtnElement)

  const emailErrorElement = screen.queryByText(/the email you input is invalid/i)
  const passwordErrorElementAgain = screen.queryByText(/the password you entered should contain 5 or more characters/i)
  const confirmPasswordErrorElementAgain = screen.queryByText(/the passwords don't match. try again./i)

  expect(emailErrorElement).not.toBeInTheDocument()
  expect(passwordErrorElementAgain).not.toBeInTheDocument();
  expect(confirmPasswordErrorElementAgain).not.toBeInTheDocument();

})