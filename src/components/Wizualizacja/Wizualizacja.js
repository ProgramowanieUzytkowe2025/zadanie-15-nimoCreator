import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './Wizualizacja.css';

export default function Wizualizacja() {
    const { punkty, path } = useAppContext();
    const canvasRef = useRef(null);
    const [showSolution, setShowSolution] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || punkty.length === 0) return;

        // #region ZMIENNE

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const xs = punkty.map(p => p.x);
        const ys = punkty.map(p => p.y);

        const xMin = Math.min(...xs);
        const xMax = Math.max(...xs);
        const yMin = Math.min(...ys);
        const yMax = Math.max(...ys);

        const xRange = xMax - xMin || 1;
        const yRange = yMax - yMin || 1;

        const minX = xMin - 0.1 * xRange;
        const maxX = xMax + 0.1 * xRange;
        const minY = yMin - 0.1 * yRange;
        const maxY = yMax + 0.1 * yRange;

        const margin = 20;
        const scaleX = (width - 2 * margin) / (maxX - minX);
        const scaleY = (height - 2 * margin) / (maxY - minY);

        const toCanvasX = (x) => margin + (x - minX) * scaleX;
        const toCanvasY = (y) => height - margin - (y - minY) * scaleY;

        // #endregion ZMIENNE

        // #region CANVAS

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.font = '12px Lato';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#666';

        const stepX = Math.pow(10, Math.floor(Math.log10(Math.abs(maxX - minX))-1));
        const stepY = Math.pow(10, Math.floor(Math.log10(Math.abs(maxY - minY))-1));

        // #endregion CANVAS

        // #region PIONOWE
        for (let x = Math.ceil(minX / stepX) * stepX; x <= maxX; x += stepX) {
            const canvasX = toCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(canvasX, 0);
            ctx.lineTo(canvasX, height);
            ctx.stroke();
            
            ctx.textAlign = 'left';
            ctx.fillText(x.toString(), canvasX + 5, height - 5);
        }
        // #endregion PIONOWE

        // #region POZIOME
        for (let y = Math.ceil(minY / stepY) * stepY; y <= maxY; y += stepY) {
            const canvasY = toCanvasY(y);
            ctx.beginPath();
            ctx.moveTo(0, canvasY);
            ctx.lineTo(width, canvasY);
            ctx.stroke();

            ctx.fillText(y.toString(), 15, canvasY + 15);
        }
        // #endregion POZIOME

        // #region OSIE
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        // Oś X
        ctx.beginPath();
        ctx.moveTo(0, toCanvasY(0));
        ctx.lineTo(width, toCanvasY(0));
        ctx.stroke();

        // Oś Y
        ctx.beginPath();
        ctx.moveTo(toCanvasX(0), 0);
        ctx.lineTo(toCanvasX(0), height);
        ctx.stroke();
        // #endregion OSIE

        // #region ŚCIEŻKA
        if (showSolution && path && path.length > 1) {
            ctx.strokeStyle = '#00aaff88';
            ctx.lineWidth = 2;
            ctx.beginPath();

            const firstPoint = punkty[path[0]];
            if (firstPoint) {
                // Segmenty
                ctx.moveTo(toCanvasX(firstPoint.x), toCanvasY(firstPoint.y));

                for (let i = 1; i < path.length; i++) {
                    const punkt = punkty[path[i]];
                    const prevPoint = punkty[path[i - 1]];
                    if (punkt && prevPoint) {
                        ctx.lineTo(toCanvasX(punkt.x), toCanvasY(punkt.y));
                    }
                }
                ctx.stroke();

                // Odległości labels
                ctx.fillStyle = '#00aaff';
                ctx.font = 'bold 12px Lato';
                ctx.textAlign = 'center';
                
                for (let i = 1; i < path.length; i++) {
                    const punkt = punkty[path[i]];
                    const prevPoint = punkty[path[i - 1]];
                    if (punkt && prevPoint) {
                        const dx = punkt.x - prevPoint.x;
                        const dy = punkt.y - prevPoint.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        const midX = (punkt.x + prevPoint.x) / 2;
                        const midY = (punkt.y + prevPoint.y) / 2;
                        
                        ctx.fillText(distance.toFixed(2), toCanvasX(midX), toCanvasY(midY) - 10);
                    }
                }
                ctx.textAlign = 'left';
            }
        }
        // #endregion ŚCIEŻKA

        // #region PUNKTY
        punkty.forEach((punkt, index) => {
            const cx = toCanvasX(punkt.x);
            const cy = toCanvasY(punkt.y);

            ctx.fillStyle = '#00aaff';
            ctx.beginPath();
            ctx.arc(cx, cy, 2, 0, 2 * Math.PI);
            ctx.fill();

            // Nazwa punktu
            ctx.fillStyle = '#000';
            ctx.font = 'bold 14px Lato';
            ctx.textAlign = 'center';
            ctx.fillText(punkt.nazwa, cx, cy - 20);

            // Współrzędne
            ctx.font = '11px Lato';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText(`(${punkt.x}, ${punkt.y})`, cx, cy + 20);
            
            ctx.textAlign = 'left';
        });
        // #endregion PUNKTY 

    }, [punkty, path, showSolution]);

    return (
        <div className="wizualizacja">
            <h2>Wizualizacja</h2>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="wizualizacja-canvas"
            />
            <button onClick={() => setShowSolution(!showSolution)} className="solution-button">
                {showSolution ? 'Ukryj rozwiązanie' : 'Pokaż rozwiązanie'}
            </button>
        </div>
    );
}
