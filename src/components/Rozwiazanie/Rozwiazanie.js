import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './Rozwiazanie.css';

export default function Rozwiazanie() {
    const { punkty, path } = useAppContext();

    const getPointByIndex = (index) => punkty?.[index];

    const renderSteps = () => {
        if (!path || path.length === 0 || !punkty || punkty.length === 0) {
            return <p>Brak danych ścieżki.</p>;
        }

        const firstPoint = getPointByIndex(path[0]);
        if (!firstPoint) {
            return <p>Brak poprawnych punktów ścieżki.</p>;
        }

        const elements = [];

        elements.push(
            <div className="point" key={`point-${path[0]}`}>
                <span className="name">{firstPoint.nazwa}</span>
                <span className="material-symbols-rounded dot">circle</span>
                <span className="coords">({firstPoint.x}, {firstPoint.y})</span>
            </div>
        );

        for (let i = 1; i < path.length; i++) {
            const prevPoint = getPointByIndex(path[i - 1]);
            const currentPoint = getPointByIndex(path[i]);
            if (!prevPoint || !currentPoint) continue;

            const dx = currentPoint.x - prevPoint.x;
            const dy = currentPoint.y - prevPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            elements.push(
                <div className="arrow" key={`arrow-${path[i - 1]}-${path[i]}`}>
                    <span className="arrowHead">
                        <span className="material-symbols-rounded">arrow_forward_ios</span>
                    </span>
                    <span className="distance">{distance.toFixed(2)}</span>
                </div>
            );

            elements.push(
                <div className="point" key={`point-${path[i]}`}>
                    <span className="name">{currentPoint.nazwa}</span>
                    <span className="material-symbols-rounded dot">circle</span>
                    <span className="coords">({currentPoint.x}, {currentPoint.y})</span>
                </div>
            );
        }

        return elements;
    };

    return (
        <div className="rozwiazanie">
            <h2>Rozwiązanie</h2>
            <div className="solutionSteps">
                {renderSteps()}
            </div>
        </div>
    );
}
