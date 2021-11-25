import { useContext, useEffect, useState } from 'react'
import AuthProvider from './helpers/AuthProvider'
import { checkToken, logout, selectAuthValue } from './store/auth'
import { useDispatch, useSelector } from 'react-redux'
import { SpinnerFullPage } from './components/spinner'
import Layout from './style/Layout'
import GlobalStyle from './style/Global'
import Routing from './route/Route'
import withTheme, { ThemeComponentType } from './helpers/session/withTheme'
import { RouteComponentProps } from 'react-router'

type AppPropType = RouteComponentProps & ThemeComponentType
const App: React.FC<AppPropType> = ({ colors }) => {
  const dispatch = useDispatch()
  const { pending, error } = useSelector(selectAuthValue)
  const [ isTokenPreserved, setTokenPreserved ] = useState<boolean>(false)

  useEffect(() => {
    if (AuthProvider.isAuthenticated()) {
      const token = AuthProvider.token
      const id = AuthProvider.id
      if (token && id) {
        setTokenPreserved(true)
        dispatch(checkToken({ id, token }))
      } else {
        dispatch(logout())
      }
    }
  }, [])

  return (
    <>
    <GlobalStyle theme={colors} />
    <Layout>
      {
        (isTokenPreserved && pending) 
        ? <SpinnerFullPage useLogo={true} /> 
        : (isTokenPreserved && error) 
          ? <div>An Error Occured</div> 
          : <Routing />
      }
    </Layout>
    </>
  )
}

export default withTheme(App)
