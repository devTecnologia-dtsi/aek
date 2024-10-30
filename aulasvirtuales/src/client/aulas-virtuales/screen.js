import React, { useEffect, useState } from "react";
import { AekReactRouter, Container, request, RouterView } from "@ombiel/aek-lib";
const router = new AekReactRouter({ useHash: false, });

// components
import Tabs from "../components/Tabs";
import Eventos from "../components/Eventos";


export default Screen = () => {
  const [userData, setUserData] = useState(null)

  // obtiene la informacion del usuario por el token
  useEffect(() => {
    // make a request cmAuth
    request.action("get-user").end((err, response) => {
      setUserData(response.body)
    });
  }, [])

  return (
    <Container>
      <RouterView router={router}>
        <Tabs path={"/"} userData={userData} />
        <Eventos path={"/eventos/:id"} />
      </RouterView>
    </Container>
  );
}
