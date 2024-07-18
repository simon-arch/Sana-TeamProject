function App() {
    fetch('https://localhost:7102').then(response =>
    response.text().then(data => console.log(data)));

    return (
        <>
        </>
    )
}
export default App
