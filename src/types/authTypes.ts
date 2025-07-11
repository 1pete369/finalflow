export type signupDataType = {
  fullName: string
  email: string
  password: string
}

export type loginDataType = {
  email: string
  password: string
}

export type authUserDataType = {
  fullName: string
  profilePic: string
  email: string
  _id: string
  createdAt: Date
  updatedAt: Date
}
