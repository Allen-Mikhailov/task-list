import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, app, db } from "./modules/firebase-auth.js";
import "./index.scss"
import "./theme.scss"

import store from "./modules/store.js"
import FirebaseStore from "./modules/firebase-store.js";

import Footer from "./components/Footer/Footer.js";
import SignInPage from "./pages/SignInPage/SignInPage.js";
import ListPage from "./pages/ListPage/ListPage.js";

// Pages: list, edit, settings, new-task
store.setState("current-page", "list")
store.setState("firebase-user-data", {
  "lists": {
    "test-list-folder": {
      "type": "folder",
      "lists": {
        "test-list": {
          "type": "list"
        }
      }
    } 
  }
})

function MainContent({ user }) {
  const [currentPage] = store.useState("current-page")
  
  return <>
    {/* <FirebaseStore coll="users" key={user.uid} storename={"firebase-user-data"}/> */}

    {currentPage == "list" && <ListPage/>}
    <Footer user={user} />
  </>
}

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      {(user == undefined) && <SignInPage />}
      {user && <MainContent user={user} />}
    </div>
  );
}

export default App;
