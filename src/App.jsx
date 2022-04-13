import ResumeForm from "./pages/ResumeForm"
import { ToastList, useToast } from "./components/utils/Toast";
import { createContext } from "react";

export const ToastContext = createContext();
function App() {
  const [toastList, addToast, deleteToast] = useToast([]);
  return (
    <>
      <ToastList toastList={toastList} onDeleteToast={deleteToast} />
      <ToastContext.Provider value={{ addToast }}>
        <ResumeForm />
      </ToastContext.Provider>
    </>
  )
}

export default App
