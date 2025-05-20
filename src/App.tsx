import Game from "./components/Game.tsx";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Game />
    </div>
  );
}

export default App;
