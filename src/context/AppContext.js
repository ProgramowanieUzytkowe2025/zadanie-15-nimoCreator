import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [punkty, setPunkty] = useState([
        { nazwa: 'A', x: -100, y: -20 },
        { nazwa: 'B', x: 30, y: 40 },
        { nazwa: 'C', x: 50, y: -10 },
        { nazwa: 'D', x: -70, y: 60 },
        { nazwa: 'Długa nazwa', x: 20, y: 80 }
    ]);
    const [path, setPath] = useState([0, 1, 2, 3, 4]);
    const [steps, setSteps] = useState([]);
    const [bestSteps, setBestSteps] = useState([]);
    const [iterations, setIterations] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [bestPathLength, setBestPathLength] = useState(null);
    const searchIntervalRef = React.useRef(null);

    const calculatePathLength = (pointsArray, pathIndices) => {
        let totalDistance = 0;
        for (let i = 1; i < pathIndices.length; i++) {
            const prevPoint = pointsArray[pathIndices[i - 1]];
            const currentPoint = pointsArray[pathIndices[i]];
            if (prevPoint && currentPoint) {
                const dx = currentPoint.x - prevPoint.x;
                const dy = currentPoint.y - prevPoint.y;
                totalDistance += Math.sqrt(dx * dx + dy * dy);
            }
        }
        return totalDistance;
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const startSearch = () => {
        if (isSearching) return;

        setIsSearching(true);

        searchIntervalRef.current = setInterval(() => {
            setIterations(prev => prev + 1);

            const indices = punkty.map((_, index) => index);
            
            const shuffledPath = shuffleArray(indices);
            
            const distance = calculatePathLength(punkty, shuffledPath);
            
            setSteps(prev => [...prev, distance]);
            
            setBestSteps(prev => {
                const currentBest = prev.length > 0 ? prev[prev.length - 1] : Infinity;
                const newBest = Math.min(currentBest, distance);
                return [...prev, newBest];
            });
            
            setBestPathLength(prev => {
                if (prev === null || distance < prev) {
                    setPath(shuffledPath);
                    return distance;
                }
                return prev;
            });
        }, 50);
    };

    const stopSearch = () => {
        if (searchIntervalRef.current) {
            clearInterval(searchIntervalRef.current);
            searchIntervalRef.current = null;
        }
        setIsSearching(false);
    };

    const toggleSearch = () => {
        if (isSearching) {
            stopSearch();
        } else {
            startSearch();
        }
    };

    const loadFromFile = (fileContent) => {
        try {
            const data = JSON.parse(fileContent);
            
            const points = data.map(point => ({
                nazwa: point.name || point.nazwa,
                x: point.x,
                y: point.y
            }));
            
            // Reset wszystkich danych
            stopSearch();
            setPunkty(points);
            setPath(points.map((_, index) => index));
            setIterations(0);
            setSteps([]);
            setBestSteps([]);
            setBestPathLength(null);
            
            return { success: true };
        } catch (error) {
            console.error('Błąd podczas parsowania pliku:', error);
            return { success: false, error: 'Nieprawidłowy format pliku JSON' };
        }
    };

    React.useEffect(() => {
        return () => {
            if (searchIntervalRef.current) {
                clearInterval(searchIntervalRef.current);
            }
        };
    }, []);

    const value = {
        punkty,
        setPunkty,
        path,
        setPath,
        steps,
        setSteps,
        bestSteps,
        setBestSteps,
        iterations,
        setIterations,
        isSearching,
        toggleSearch,
        startSearch,
        stopSearch,
        loadFromFile,
        bestPathLength,
        setBestPathLength
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
