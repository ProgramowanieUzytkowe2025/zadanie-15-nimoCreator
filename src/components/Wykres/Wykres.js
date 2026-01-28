import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import './Wykres.css';

export default function Wykres() {
    const { steps, bestSteps } = useAppContext();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 50;

        // #region CANVAS

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        // #endregion CANVAS

        // #region ZMIENNE

        const minVal = 0;
        const allValues = [...steps, ...bestSteps];
        const maxVal = allValues.length === 0 ? 10 : Math.max(...allValues);
        const maxY = maxVal * 1.1;
        const range = maxY - minVal;

        const maxX = Math.max(10, (steps.length + 1));
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        // #endregion ZMIENNE

        // #region OSIE

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(padding, padding);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // #endregion OSIE

        // #region SIATKA I ETYKIETY

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';

        // Y-axis labels
        for (let i = 0; i <= 5; i++) {
            const val = minVal + (range / 5) * i;
            const y = height - padding - (i / 5) * chartHeight;

            ctx.beginPath();
            ctx.moveTo(padding - 5, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();

            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(val.toFixed(0), padding - 10, y);
        }

        // X-axis labels
        const stepLabel = Math.max(1, Math.ceil(maxX / 10));
        for (let i = 0; i <= maxX; i += stepLabel) {
            const x = padding + (i / maxX) * chartWidth;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(i.toString(), x, height - padding + 10);
        }

        // #endregion SIATKA I ETYKIETY

        // #region LINIA NAJLEPSZYCH (z tyłu)

        if (bestSteps.length > 0) {
            ctx.strokeStyle = '#00aa0088';
            ctx.lineWidth = 3;
            ctx.beginPath();

            for (let i = 0; i < bestSteps.length; i++) {
                const x = padding + ((i + 1) / maxX) * chartWidth;
                const y = height - padding - ((bestSteps[i] - minVal) / range) * chartHeight;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }

        // #endregion LINIA NAJLEPSZYCH

        // #region LINIA AKTUALNYCH (z przodu)

        if (steps.length > 0) {
            ctx.strokeStyle = '#00aaff';
            ctx.lineWidth = 2;
            ctx.beginPath();

            for (let i = 0; i < steps.length; i++) {
                const x = padding + ((i + 1) / maxX) * chartWidth;
                const y = height - padding - ((steps[i] - minVal) / range) * chartHeight;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }

        // #endregion LINIA AKTUALNYCH

        // #region PUNKTY

        ctx.fillStyle = '#00aaff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 11px Arial';
        ctx.textBaseline = 'bottom';

        for (let i = 0; i < steps.length; i++) {
            const x = padding + ((i + 1) / maxX) * chartWidth;
            const y = height - padding - ((steps[i] - minVal) / range) * chartHeight;

            // Punkt
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();

            // Wartość nad punktem
            ctx.fillStyle = '#333';
            ctx.fillText(steps[i].toFixed(0), x, y - 10);
            ctx.fillStyle = '#00aaff';
        }

        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        // #endregion PUNKTY

    }, [steps, bestSteps]);

    return (
        <div className="wykres">
            <h2>Wykres</h2>
            <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="wykres-canvas"
            />
        </div>
    );
}
