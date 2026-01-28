import './App.css';
import { useAppContext } from './context/AppContext';
import Wizualizacja from './components/Wizualizacja/Wizualizacja';
import Rozwiazanie from './components/Rozwiazanie/Rozwiazanie';
import Kontrolki from './components/Kontrolki/Kontrolki';
import Wykres from './components/Wykres/Wykres';

export default function App() {
  const { loadFromFile } = useAppContext();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = loadFromFile(e.target.result);
      if (!result.success) {
        alert(result.error);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="main">
      <div className="file-upload">
        <label htmlFor="file-input" className="file-label">
          Wczytaj plik JSON
        </label>
        <input
          id="file-input"
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="file-input"
        />
      </div>
      <Wizualizacja/>
      <Rozwiazanie/>
      <Kontrolki/>
      <Wykres/>
    </div>
  );
}
