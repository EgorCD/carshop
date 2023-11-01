import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import Carlist from "./components/Carlist"

function App() {
  return (
    <Container maxWidth="xl">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6"></Typography>
        </Toolbar>
      </AppBar>
      <Carlist />
    </Container>
  )
}

export default App
