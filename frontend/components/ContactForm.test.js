import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm/>);
    const header = screen.queryByText(/Contact Form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/Contact Form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, '123');
    const errMessages = await screen.findAllByTestId('error');
    expect(errMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);
    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);
    await waitFor(()=> {
        const errMessages = screen.queryAllByTestId('error');
        expect(errMessages).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);
    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, 'taylor');
    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, 'picard');
    const button = screen.getByRole('button');
    userEvent.click(button);
    const errMessages = await screen.getAllByTestId('error');
    expect(errMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, 'taylor@gmail');
    const errMessage = await screen.findByText(/email must be a valid email address/i);
    expect(errMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);
    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);
    const errMessage = await screen.findByText(/lastName is a required field/i);
    expect(errMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);
    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(firstNameInput, 'Taylor');
    userEvent.type(lastNameInput, 'Picard');
    userEvent.type(emailInput, 'Taylor@gmail.com');
    const button = screen.getByRole('button');
    userEvent.click(button);
    await waitFor(()=> {
        const firstNameDisplay = screen.queryByText('Taylor');
        const lasttNameDisplay = screen.queryByText('Picard');
        const emailDisplay = screen.queryByText('Taylor@gmail.com');
        const messageDisplay = screen.queryByTestId('messageDisplay');
        expect(firstNameDisplay).toBeInTheDocument();
        expect(lasttNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);
    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const emailInput = screen.getByLabelText(/email*/i);
    const messageInput = screen.getByLabelText(/message/i);
    userEvent.type(firstNameInput, 'Taylor');
    userEvent.type(lastNameInput, 'Picard');
    userEvent.type(emailInput, 'Taylor@gmail.com');
    userEvent.type(messageInput, 'Some Message');
    const button = screen.getByRole('button');
    userEvent.click(button);
    await waitFor(()=> {
        const firstNameDisplay = screen.queryByText('Taylor');
        const lasttNameDisplay = screen.queryByText('Picard');
        const emailDisplay = screen.queryByText('Taylor@gmail.com');
        const messageDisplay = screen.queryByText('Some Message');
        expect(firstNameDisplay).toBeInTheDocument();
        expect(lasttNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })
});
