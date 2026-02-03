import ImageMonitor from "./components/image-monitor";
import InfoMonitor from "./components/info-monitor";

function App() {
  return (
    <div className="flex items-center justify-start h-screen overflow-hidden">
      <ImageMonitor />
      <InfoMonitor />
    </div>
  )
}

export default App