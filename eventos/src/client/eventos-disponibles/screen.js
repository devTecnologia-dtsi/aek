import React from "react";
import { Container, AekReactRouter, RouterView } from "@ombiel/aek-lib";
const router = new AekReactRouter({ useHash: false, });
// components
import Evento from "../components/Evento";
import Inscribirse from "../components/Inscribirse";

export default Screen = () => {

  return (
    <Container>
      <RouterView router={router}>
        <Evento path="/" />
        <Inscribirse path="/evento/inscribirse/:id/:documento/:correo" />
      </RouterView>
    </Container >
  );

}
