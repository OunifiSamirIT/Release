import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Card from "./pages/Card";
import Details from "./pages/Details";
///////////////
import Navbar from "./components/Navbar";
import Homeee from "./components/Home";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { Switch } from "react-router";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Logout from "./components/Logout";
import Protectedroute from "./ProtectedRoute";
import { Fragment, useEffect, useState } from "react";
import Build from "./components/Build";
import UploadFile from "./components/UploadFile";
import HomeeeRE from "./pages/Home";

function App() {
  const [auth, setauth] = useState(false);
  const [auth1, setauth1] = useState(true);
  const isLoggedIn = async () => {
    try {
      const res = await fetch("/auth", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        setauth(true);
        setauth1(false);
      }
      if (res.status === 401) {
        setauth(false);
        setauth1(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
      // <BrowserRouter>
      //   <Routes>
      //     <Route exact path="/aa" component={Navbar} auth={auth1} />
      //     <Route exact path="/" component={Homeee} />
          
          
          
      //     <Route path="/acceuil" element={<Home />} />
      //     <Route path="/card" element={<Card />} />
      //     <Route path="/uploadFile" element={<UploadFile auth={auth}/>} />
      //     <Route path="//logout" element={<Logout auth={auth}/>} />
      //     <Route path="/build" element={<Build auth={auth}/>} />
      //     <Route path="/dashboard" element={<Dashboard auth={auth}/>} />
      //     <Route path="/register" element={<Register auth={auth}/>} />
      //     <Route path="/register" element={<Register auth={auth}/>} />
      //     <Route path="/Contact" element={<Contact auth={auth}/>} />
      //     <Route path="/dashboard" element={<Dashboard auth={auth}/>} />
      //     <Route path="/service" element={<Services auth={auth}/>} />
      //     <Route path="/about" element={<About auth={auth}/>} />
      //     <Route path="/login" element={<Login auth={auth1}/>} />
      //     <Route path="/*" element={<Footer />} />
      //   </Routes>
      // </BrowserRouter>
      <Fragment>
        <BrowserRouter>
      <Navbar auth={auth1}/>
      <Switch>
        <Route exact path="/" component={Homeee} />
        <Route exact path="/about" component={About} />
        <Route exact path="/service" component={Services} />
        <Route exact path="/contact" component={Contact} />
        <Protectedroute exact path="/login" component={Login} auth={auth1}/>
        <Protectedroute exact path="/register" component={Register} auth={auth1}/>
        <Route exact path="/dashboard" component={Dashboard}/>
        <Protectedroute exact path="/dashboard" component={Dashboard} auth={auth}/>
        <Protectedroute exact path="/Release" component={HomeeeRE} auth={auth}/>
        <Protectedroute exact path="/logout" component={Logout} auth={auth}/>
        <Protectedroute exact path="/build" component={Build} auth={auth}/>
        <Protectedroute exact path="/uploadFile" component={UploadFile} auth={auth}/>
        <Protectedroute exact path="/:id" component={Details} auth={auth}/>
        {/* <Protectedroute exact path="/card" component={Card} /> */}

        <Route exact path="/card" component={Card} />
      </Switch>
      <Footer/></BrowserRouter>
      </Fragment>
  );
}

export default App;
