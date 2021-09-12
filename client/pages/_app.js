import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const appComponent = ({ Component, pageProps, currentUser}) => {

  return <div className="container" >
            <Header currentUser = { currentUser}/>
            <Component {...pageProps}/>
         </div> 
};

appComponent.getInitialProps =  async (appContex) => {
 
  const client = buildClient(appContex.ctx);
  const { data } =  await client.get('/api/users/currentuser');

  let pageProps = {};
  if(appContex.Component.getInitialProps) {
    pageProps = await appContex.Component.getInitialProps(appContex.ctx);
  }

  return { pageProps, ...data }
};

export default appComponent;