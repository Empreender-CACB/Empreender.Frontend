function isValidEmail(email: any): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return email !== null && emailRegex.test(email)
}

export default isValidEmail
