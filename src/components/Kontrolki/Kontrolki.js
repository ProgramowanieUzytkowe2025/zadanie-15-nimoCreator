import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './Kontrolki.css';

export default function Kontrolki() {
    const { toggleSearch, isSearching, iterations, bestPathLength } = useAppContext();

    return (
        <div className="kontrolki">
            <h2>Kontrolki</h2>
            <div className="buttons">
                <div className="row">
                    <button onClick={toggleSearch} className="search-button">
                        {isSearching ? 'Przerwa' : 'Szukaj Rozwiązania'}
                    </button>
                    <span className="iterations">Iteracje: {iterations}</span>
                </div>
                <div className="row">
                    <span>Najbardziej optymalna znaleziona ścieżka: {bestPathLength !== null ? bestPathLength.toFixed(2) : '—'}</span>
                </div>
            </div>
        </div>
    );
}
