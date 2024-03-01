import { apiRequest } from './Api'
import { apiRoutes } from '../constants/apiConstants'
import { LoginUserFields } from '../hooks/react-hook-form/useLogin'
import { UserType } from '../models/auth'
import { RegisterUserFields } from '../hooks/react-hook-form/useRegister'
import axios from 'axios'
import Cookies from 'js-cookie'

const getJwtTokenFromCookie = () => {
  const jwtToken = Cookies.get('token')
  if (!jwtToken) {
    throw new Error('JWT token not found or expired')
  }
  return jwtToken
}

export const fetchMe = async () => {
  const jwtToken = getJwtTokenFromCookie()
  const response = await axios.get(apiRoutes.FETCH_ME, {
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

export const updateUser = async (userData: { first_name: string; last_name: string; email: string; }, userId: string) => {
  const jwtToken = getJwtTokenFromCookie()
  const url = `${process.env.REACT_APP_API_URL}/users/${userId}`

  try {
    const response = await axios.put(url, userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error('Failed to update user. Please try again.')
  }
}


export const login = async (data: LoginUserFields) =>
  apiRequest<LoginUserFields, UserType>('post', apiRoutes.LOGIN, data)


export const register = async (data: RegisterUserFields) =>
  apiRequest<RegisterUserFields, void>('post', apiRoutes.SIGNUP, data)


export const uploadAvatar = async (formData: FormData, id: string) =>
  apiRequest<FormData, void>(
    'post',
    `${apiRoutes.UPLOAD_AVATAR_IMAGE}/${id}`,
    formData,
  )


export const signout = async () =>
  apiRequest<undefined, void>('post', apiRoutes.SIGNOUT)


export const refreshTokens = async () =>
  apiRequest<undefined, UserType>('get', apiRoutes.REFRESH_TOKENS)
