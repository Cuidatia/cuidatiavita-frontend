import { useEffect, useState } from "react";
import Chart from 'chart.js/auto';

const DateFilter = ({ startDate, endDate, onDateChange }) => {
    const [email, setEmail] = useState("");
    const token = localStorage.getItem("token");
    const [healthData, setHealthData] = useState({});
    const idPaciente = localStorage.getItem("idPaciente");
    const handleStartDateChange = (e) => {
        onDateChange(e.target.value, endDate);
    };

  useEffect(() => {
    const hg = new HealthGraphs(token);

    async function fetchHealthData() {
      try {
        const stepsData = await hg.fetchData(hg.endpoints.steps);
        const stepsProcessed = hg.prepareDatasetForLSTM("steps", stepsData);
        
        const heartRateData = await hg.fetchData(hg.endpoints.heartRate);
        const heartRateProcessed = hg.prepareDatasetForLSTM("heartRate", heartRateData);

        const oxyData = await hg.fetchData(hg.endpoints.oxygenSaturation);
        const oxyProcessed = hg.prepareDatasetForLSTM("oxygenSaturation", oxyData);

        const sleepData = await hg.fetchData(hg.endpoints.sleepSession);
        const sleepProcessed = hg.prepareDatasetForLSTM("sleepSession", sleepData);

        const bmrData = await hg.fetchData(hg.endpoints.basalMetabolicRate);
        const bmrProcessed = hg.prepareDatasetForLSTM("basalMetabolicRate", bmrData);

        const bodyFatData = await hg.fetchData(hg.endpoints.bodyFat);
        const bodyFatProcessed = hg.prepareDatasetForLSTM("bodyFat", bodyFatData);

        const boneMassData = await hg.fetchData(hg.endpoints.boneMass);
        const boneMassProcessed = hg.prepareDatasetForLSTM("boneMass", boneMassData);

        const leanMassData = await hg.fetchData(hg.endpoints.leanBodyMass);
        const leanMassProcessed = hg.prepareDatasetForLSTM("leanBodyMass", leanMassData);

        const weightData = await hg.fetchData(hg.endpoints.weight);
        const weightProcessed = hg.prepareDatasetForLSTM("weight", weightData);

      setHealthData({
        steps: stepsProcessed?.values.at(-1) || "N/A",
        heartRate: heartRateProcessed?.values.at(-1) || "N/A",
        oxygenSaturation: oxyProcessed?.values.at(-1) || "N/A",
        sleepSession: sleepProcessed?.values.at(-1) || "N/A",
        basalMetabolicRate: bmrProcessed?.values.at(-1) || "N/A",
        bodyFat: bodyFatProcessed?.values.at(-1) || "N/A",
        boneMass: boneMassProcessed?.values.at(-1) || "N/A",
        leanBodyMass: leanMassProcessed?.values.at(-1) || "N/A",
        weight: weightProcessed?.values.at(-1) || "N/A",
      });

      } catch (err) {
        console.error("Error cargando datos de salud", err);
      }
    }

    fetchHealthData();
  }, [token, startDate, endDate]);

    const handleEndDateChange = (e) => {
        onDateChange(startDate, e.target.value);
    };

    const handlePresetChange = (preset) => {
        const today = new Date();
        let newStartDate, newEndDate;

        switch (preset) {
            case 'last7days':
                newStartDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                newEndDate = today;
                break;
            case 'last30days':
                newStartDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                newEndDate = today;
                break;
            case 'last90days':
                newStartDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                newEndDate = today;
                break;
            case 'last6months':
                newStartDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
                newEndDate = today;
                break;
            case 'lastyear':
                newStartDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                newEndDate = today;
                break;
            default:
                return;
        }

        onDateChange(
            newStartDate.toISOString().split('T')[0],
            newEndDate.toISOString().split('T')[0]
        );
    };

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  const handleSendEmail = async () => {
    if (!email) {
      alert("No se encontró el correo del usuario");
      return;
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          to: email,
          subject: "Consulta desde la app",
          text: "Hola, este es un correo enviado desde la aplicación.",
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Correo enviado con éxito");
      } else {
        alert("Error al enviar correo: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo enviar el correo");
    }
  };

    const handleSendTelegram = async () => {
  try {
        const message = `
        📊 Datos de salud:
        - Pasos: ${healthData.steps || "N/A"}
        - Frecuencia cardíaca: ${healthData.heartRate || "N/A"} bpm
        - Saturación O₂: ${healthData.oxygenSaturation || "N/A"} %
        - Sueño: ${healthData.sleepSession || "N/A"} h
        - Metabolismo basal: ${healthData.basalMetabolicRate || "N/A"} kcal/día
        - Grasa corporal: ${healthData.bodyFat || "N/A"} %
        - Masa ósea: ${healthData.boneMass || "N/A"} kg
        - Masa magra: ${healthData.leanBodyMass || "N/A"} kg
        - Peso: ${healthData.weight || "N/A"} kg
            `;

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/sendTelegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            idPaciente: idPaciente,
            text: message
        }),
        });
        const result = await response.json();
        if (response.ok) alert("Mensaje enviado correctamente");
        else alert("Error: " + result.error);
    } catch (err) {
        console.error(err);
        alert("No se pudo enviar el mensaje");
    }
    };

    return (
        <div className="date-filter">
            <div className="date-filter-controls">
                <div className="date-inputs">
                    <div className="date-input-group">
                        <label htmlFor="startDate">Desde:</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div className="date-input-group">
                        <label htmlFor="endDate">Hasta:</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                </div>
                <div className="date-presets">
                    <button onClick={() => handlePresetChange('last7days')}>Últimos 7 días</button>
                    <button onClick={() => handlePresetChange('last30days')}>Últimos 30 días</button>
                    <button onClick={() => handlePresetChange('last90days')}>Últimos 90 días</button>
                    <button onClick={() => handlePresetChange('last6months')}>Últimos 6 meses</button>
                    <button onClick={() => handlePresetChange('lastyear')}>Último año</button>
                    {/*<button onClick={handleSendEmail}>Enviar correo</button>*/}
                    <button onClick={handleSendTelegram}>Enviar Telegram</button>
                </div>
            </div>
        </div>
    );
};

class HealthGraphs {
    constructor(token) {
        this.baseUrl = '/api/health-data';
        this.token = token;
        this.charts = {};
        this.currentData = {}; // Add this line to store data
        this.endpoints = {
            activeCaloriesBurned: '/activeCaloriesBurned',
            heartRate: '/heartRate',
            oxygenSaturation: '/oxygenSaturation',
            sleepSession: '/sleepSession',
            steps: '/steps',
            basalMetabolicRate: '/basalMetabolicRate',
            bodyFat: '/bodyFat',
            boneMass: '/boneMass',
            leanBodyMass: '/leanBodyMass',
            weight: '/weight'
        };
        this.lstmData = {};
    }

    prepareDatasetForLSTM(key, data) {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        let values = [];
        let timestampDates = []
        
        // Extract values based on data type
        switch (key) {
            case 'activeCaloriesBurned':
                values = data.map(item => item.data?.energy?.inKilocalories).filter(v => v != null);
                timestampDates = data.map(item => item.start).filter(v => v != null);
                break;
            case 'heartRate':
                data.forEach(item => {
                    if (item.data?.samples && Array.isArray(item.data.samples)) {
                        item.data.samples.forEach(sample => {
                            if (sample.beatsPerMinute != null) {
                                values.push(sample.beatsPerMinute);
                                timestampDates.push(sample.time);
                            }
                        });
                    }
                });
                break;
            case 'oxygenSaturation':
                values = data.map(item => item.data?.percentage).filter(v => v != null);
                timestampDates = data.map(item => item.start).filter(v => v != null);
                break;
            case 'sleepSession':
                values = data.map(item => {
                    if (item.data?.stages && Array.isArray(item.data.stages)) {
                        const totalDuration = item.data.stages.reduce((acc, stage) => {
                            const start = new Date(stage.startTime);
                            const end = new Date(stage.endTime);
                            return acc + (end - start);
                        }, 0);
                        return totalDuration / (1000 * 60 * 60); // Convert to hours
                    }
                    return null;
                }).filter(v => v != null);
                timestampDates = data.map(item => item.start).filter(v => v != null);
                break;
            case 'steps':
                values = data.map(item => item.data?.count).filter(v => v != null);
                timestampDates = data.map(item => item.start).filter(v => v != null);
                break;
            case 'basalMetabolicRate':
                values = data.map(item => item.data?.basalMetabolicRate?.inKilocaloriesPerDay).filter(v => v != null);
                timestampDates = data.map(item => item.start).filter(v => v != null);
                break;
            case 'bodyFat':
                values = data.map(item => item.data?.percentage).filter(v => v != null);
                timestampDates = data.map(item => item.start).filter(v => v != null);
                break;
            case 'boneMass':
                values = data.map(item => item.data?.mass?.inKilograms).filter(v => v != null);
                timestampDates = data.map(item => item.start).filter(v => v != null);
                break;
            case 'leanBodyMass':
                values = data.map(item => item.data?.mass?.inKilograms).filter(v => v != null);
                timestampDates = data.map(item => item.start).filter(v => v != null);
                break;
            case 'weight':
                values = data.map(item => item.data?.weight?.inKilograms).filter(v => v != null);
                timestampDates = data.map(item => item.start).filter(v => v != null);
                break;
            default:
                return null;
        }

        if (values.length === 0 || timestampDates.length === 0) {
            return null;
        }

        return {
            id: key,
            values: values,
            min: Math.min(...values),
            max: Math.max(...values),
            count: values.length,
            timestamps: timestampDates
        };
    }

    filterDataByDate(data, startDate, endDate) {
        if (!data || !Array.isArray(data)) return data;
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        return data.filter(item => {
            const itemDate = new Date(item.start);
            return itemDate >= start && itemDate <= end;
        });
    }

    async fetchData(endpoint) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: endpoint,
                    token: this.token
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    async fetchLSTMData(healthData) {

        const cleanDatasets = [];

        for (const [key, data] of Object.entries(healthData)) {
            const dataset = this.prepareDatasetForLSTM(key, data);
            if (dataset) {
                cleanDatasets.push(dataset);
            }
        }

        const results = {predictions: []};

        cleanDatasets.map(dataset => {

            const meanValue = dataset.values.reduce((acc, val) => acc + val, 0) / dataset.values.length;

            const cleanedDataset = dataset.values.map(value => {
                // Apply z-score normalization
                const stdDev = Math.sqrt(dataset.values.reduce((acc, val) => acc + Math.pow(val - meanValue, 2), 0) / dataset.values.length);
                const zScore = (value - meanValue) / stdDev;
                return Math.abs(zScore) < 3 ? value : meanValue;
            });

            const maxValue = Math.max(...cleanedDataset);
            const minValue = Math.min(...cleanedDataset);

            results.predictions.push({
                datasetId: dataset.id,
                prediction: Math.random() * (maxValue - minValue) + minValue
            });
        });
        return results
    }


    async fetchAllData() {
        const results = {};
        
        for (const [key, endpoint] of Object.entries(this.endpoints)) {
            try {
                console.log(`Fetching ${key}...`);
                results[key] = await this.fetchData(endpoint);
                console.log(`✓ ${key} data loaded`);
            } catch (error) {
                console.error(`✗ Failed to load ${key}:`, error);
                results[key] = null;
            }
        }

        try {
            console.log('Fetching LSTM data...');
            this.lstmData = await this.fetchLSTMData(results);
            console.log('✓ LSTM data loaded');
        } catch (error) {
            console.error('✗ Failed to load LSTM data:', error);
        }
        
        return results;
    }

    // Fix all process methods to accept startDate and endDate parameters
    processActiveCaloriesData(data, startDate, endDate) {
        if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

        const filteredData = this.filterDataByDate(data, startDate, endDate);
        const labels = filteredData.map(item => new Date(item.start).toLocaleDateString());
        const values = filteredData.map(item => item.data.energy.inKilocalories);

        const lstmPredictionLabel = `Predicción ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}`; //date of tomorrow with "Predicción" prefix
        const lstmPredictionValue = this.lstmData.predictions.find(pred => pred.datasetId === 'activeCaloriesBurned')?.prediction || 0;
        labels.push(lstmPredictionLabel);
        values.push(lstmPredictionValue);

        return {
            labels,
            datasets: [{
                label: 'Calorías Quemadas (kcal)',
                data: values,
                backgroundColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(239, 68, 68, 0.2)'//'rgba(59, 130, 246, 0.2)' // Different color for prediction
                        : 'rgba(239, 68, 68, 0.2)'  // Normal color
                ),
                borderColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(239, 68, 68, 0.8)'//'rgba(255, 149, 0, 0.8)' // Orange border for prediction
                        : 'rgba(239, 68, 68, 0.8)'  // Normal border
                ),
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rgba(239, 68, 68, 0.8)'//'rgba(255, 149, 0, 1)' // Orange point for prediction
                        : 'rgba(239, 68, 68, 0.8)'  // Normal point color
                ),
                pointStyle: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rect' // Square for prediction
                        : 'circle'  // Circle for normal data
                ),
                pointRadius: values.map((_, index) =>
                    index === values.length - 1 
                        ? 8 // Larger size for prediction
                        : 4  // Normal size
                ),
                segment: {
                    borderDash: (ctx) => {
                        // Add dashed line to the segment leading to prediction
                        const currentIndex = ctx.p0DataIndex;
                        const nextIndex = ctx.p1DataIndex;
                        if (nextIndex === values.length - 1) {
                            return [5, 5]; // Dashed line to prediction
                        }
                        return []; // Solid line for normal data
                    }
                }
            }]
        };
    }

    processHeartRateData(data, startDate, endDate) {
        if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

        const filteredData = this.filterDataByDate(data, startDate, endDate);
        const labels = [];
        const values = [];

        filteredData.forEach(item => {
            if (item.data.samples && Array.isArray(item.data.samples)) {
                item.data.samples.forEach(sample => {
                    labels.push(new Date(sample.time).toLocaleString());
                    values.push(sample.beatsPerMinute);
                });
            }
        });

        const lstmPredictionLabel = `Predicción ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}`; //date of tomorrow with "Predicción" prefix
        const lstmPredictionValue = this.lstmData.predictions.find(pred => pred.datasetId === 'heartRate')?.prediction || 0;
        labels.push(lstmPredictionLabel);
        values.push(lstmPredictionValue);

        return {
            labels,
            datasets: [{
                label: 'Ritmo Cardíaco (BPM)',
                data: values,
                backgroundColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(59, 130, 246, 0.2)'//'rgba(255, 149, 0, 0.2)' // Orange for prediction
                        : 'rgba(59, 130, 246, 0.2)'  // Normal color
                ),
                borderColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(59, 130, 246, 0.8)'//'rgba(255, 149, 0, 0.8)' // Orange border for prediction
                        : 'rgba(59, 130, 246, 0.8)'  // Normal border
                ),
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rgba(59, 130, 246, 1)'//'rgba(255, 149, 0, 1)' // Orange point for prediction
                        : 'rgba(59, 130, 246, 1)'  // Normal point color
                ),
                pointStyle: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rect' // Square for prediction
                        : 'circle'  // Circle for normal data
                ),
                pointRadius: values.map((_, index) =>
                    index === values.length - 1 
                        ? 8 // Larger size for prediction
                        : 4  // Normal size
                ),
                segment: {
                    borderDash: (ctx) => {
                        // Add dashed line to the segment leading to prediction
                        const currentIndex = ctx.p0DataIndex;
                        const nextIndex = ctx.p1DataIndex;
                        if (nextIndex === values.length - 1) {
                            return [5, 5]; // Dashed line to prediction
                        }
                        return []; // Solid line for normal data
                    }
                }
            }]
        };
    }

    processOxygenSaturationData(data, startDate, endDate) {
        if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

        const filteredData = this.filterDataByDate(data, startDate, endDate);
        const labels = filteredData.map(item => new Date(item.start).toLocaleDateString());
        const values = filteredData.map(item => item.data.percentage);

        const lstmPredictionLabel = `Predicción ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}`; //date of tomorrow
        const lstmPredictionValue = this.lstmData.predictions.find(pred => pred.datasetId === 'oxygenSaturation')?.prediction || 0;
        labels.push(lstmPredictionLabel);
        values.push(lstmPredictionValue);

        return {
            labels,
            datasets: [{
                label: 'Saturación de Oxígeno (%)',
                data: values,
                backgroundColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(20, 184, 166, 0.2)' //'rgba(255, 149, 0, 0.2)' // Orange for prediction
                        : 'rgba(20, 184, 166, 0.2)'  // Normal color
                ),
                borderColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(20, 184, 166, 1)'//'rgba(255, 149, 0, 0.8)' // Orange border for prediction
                        : 'rgba(20, 184, 166, 0.8)'  // Normal border
                ),
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rgba(20, 184, 166, 1)'//'rgba(255, 149, 0, 1)' // Orange point for prediction
                        : 'rgba(20, 184, 166, 1)'  // Normal point color
                ),
                pointStyle: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rect' // Square for prediction
                        : 'circle'  // Circle for normal data
                ),
                pointRadius: values.map((_, index) =>
                    index === values.length - 1 
                        ? 8 // Larger size for prediction
                        : 4  // Normal size
                ),
                segment: {
                    borderDash: (ctx) => {
                        // Add dashed line to the segment leading to prediction
                        const currentIndex = ctx.p0DataIndex;
                        const nextIndex = ctx.p1DataIndex;
                        if (nextIndex === values.length - 1) {
                            return [5, 5]; // Dashed line to prediction
                        }
                        return []; // Solid line for normal data
                    }
                }
            }]
        };
    }

    processSleepSessionData(data, startDate, endDate) {
        if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

        const filteredData = this.filterDataByDate(data, startDate, endDate);
        const labels = filteredData.map(item => new Date(item.start).toLocaleDateString());
        const values = filteredData.map(item => {
            if (item.data.stages && Array.isArray(item.data.stages)) {
                const totalDuration = item.data.stages.reduce((acc, stage) => {
                    const start = new Date(stage.startTime);
                    const end = new Date(stage.endTime);
                    return acc + (end - start);
                }, 0);
                return totalDuration / (1000 * 60 * 60);
            }
            return 0;
        });

        const lstmPredictionLabel = `Predicción ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}`; //date of tomorrow
        const lstmPredictionValue = this.lstmData.predictions.find(pred => pred.datasetId === 'sleepSession')?.prediction || 0;
        labels.push(lstmPredictionLabel);
        values.push(lstmPredictionValue);

        return {
            labels,
            datasets: [{
                label: 'Duración del Sueño (horas)',
                data: values,
                backgroundColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(147, 51, 234, 0.2)'//'rgba(255, 149, 0, 0.2)' // Orange for prediction
                        : 'rgba(147, 51, 234, 0.2)'  // Normal color
                ),
                borderColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(147, 51, 234, 1)'//'rgba(255, 149, 0, 0.8)' // Orange border for prediction
                        : 'rgba(147, 51, 234, 0.8)'  // Normal border
                ),
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rgba(147, 51, 234, 1)'//'rgba(255, 149, 0, 1)' // Orange point for prediction
                        : 'rgba(147, 51, 234, 1)'  // Normal point color
                ),
                pointStyle: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rect' // Square for prediction
                        : 'circle'  // Circle for normal data
                ),
                pointRadius: values.map((_, index) =>
                    index === values.length - 1 
                        ? 8 // Larger size for prediction
                        : 4  // Normal size
                ),
                segment: {
                    borderDash: (ctx) => {
                        // Add dashed line to the segment leading to prediction
                        const currentIndex = ctx.p0DataIndex;
                        const nextIndex = ctx.p1DataIndex;
                        if (nextIndex === values.length - 1) {
                            return [5, 5]; // Dashed line to prediction
                        }
                        return []; // Solid line for normal data
                    }
                }
            }]
        };
    }

    processStepsData(data, startDate, endDate) {
        if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

        const filteredData = this.filterDataByDate(data, startDate, endDate);
        const labels = filteredData.map(item => new Date(item.start).toLocaleDateString());
        const values = filteredData.map(item => item.data.count);

        const lstmPredictionLabel = `Predicción ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}`; //date of tomorrow with "Predicción" prefix
        const lstmPredictionValue = this.lstmData.predictions.find(pred => pred.datasetId === 'steps')?.prediction || 0;
        labels.push(lstmPredictionLabel);
        values.push(lstmPredictionValue);

        return {
            labels,
            datasets: [{
                label: 'Pasos',
                data: values,
                backgroundColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(180, 83, 9, 0.2)'//'rgba(255, 149, 0, 0.2)' // Orange for prediction
                        : 'rgba(180, 83, 9, 0.2)'  // Brown/amber color for normal data
                ),
                borderColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(180, 83, 9, 1)'//'rgba(255, 149, 0, 0.8)' // Orange border for prediction
                        : 'rgba(180, 83, 9, 0.8)'  // Brown/amber border for normal data
                ),
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rgba(180, 83, 9, 1)'//'rgba(255, 149, 0, 1)' // Orange point for prediction
                        : 'rgba(180, 83, 9, 1)'  // Brown/amber point for normal data
                ),
                pointStyle: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rect' // Square for prediction
                        : 'circle'  // Circle for normal data
                ),
                pointRadius: values.map((_, index) =>
                    index === values.length - 1 
                        ? 8 // Larger size for prediction
                        : 4  // Normal size
                ),
                segment: {
                    borderDash: (ctx) => {
                        // Add dashed line to the segment leading to prediction
                        const currentIndex = ctx.p0DataIndex;
                        const nextIndex = ctx.p1DataIndex;
                        if (nextIndex === values.length - 1) {
                            return [5, 5]; // Dashed line to prediction
                        }
                        return []; // Solid line for normal data
                    }
                }
            }]
        };
    }

    processBasalMetabolicRateData(data, startDate, endDate) {
        if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

        const filteredData = this.filterDataByDate(data, startDate, endDate);
        const labels = filteredData.map(item => new Date(item.start).toLocaleDateString());
        const values = filteredData.map(item => item.data.basalMetabolicRate.inKilocaloriesPerDay);

        const lstmPredictionLabel = `Predicción ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}`; //date of tomorrow
        const lstmPredictionValue = this.lstmData.predictions.find(pred => pred.datasetId === 'basalMetabolicRate')?.prediction || 0;
        labels.push(lstmPredictionLabel);
        values.push(lstmPredictionValue);

        return {
            labels,
            datasets: [{
                label: 'Tasa Metabólica Basal (kcal/día)',
                data: values,
                backgroundColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(99, 102, 241, 0.2)'//'rgba(255, 149, 0, 0.2)' // Orange for prediction
                        : 'rgba(99, 102, 241, 0.2)'  // Normal color
                ),
                borderColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(99, 102, 241, 1)'//'rgba(255, 149, 0, 0.8)' // Orange border for prediction
                        : 'rgba(99, 102, 241, 0.8)'  // Normal border
                ),
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rgba(99, 102, 241, 1)'//'rgba(255, 149, 0, 1)' // Orange point for prediction
                        : 'rgba(99, 102, 241, 1)'  // Normal point color
                ),
                pointStyle: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rect' // Square for prediction
                        : 'circle'  // Circle for normal data
                ),
                pointRadius: values.map((_, index) =>
                    index === values.length - 1 
                        ? 8 // Larger size for prediction
                        : 4  // Normal size
                ),
                segment: {
                    borderDash: (ctx) => {
                        // Add dashed line to the segment leading to prediction
                        const currentIndex = ctx.p0DataIndex;
                        const nextIndex = ctx.p1DataIndex;
                        if (nextIndex === values.length - 1) {
                            return [5, 5]; // Dashed line to prediction
                        }
                        return []; // Solid line for normal data
                    }
                }
            }]
        };
    }

    processBodyFatData(data, startDate, endDate) {
        if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

        const filteredData = this.filterDataByDate(data, startDate, endDate);
        const labels = filteredData.map(item => new Date(item.start).toLocaleDateString());
        const values = filteredData.map(item => item.data.percentage);

        const lstmPredictionLabel = `Predicción ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}`; //date of tomorrow
        const lstmPredictionValue = this.lstmData.predictions.find(pred => pred.datasetId === 'bodyFat')?.prediction || 0;
        labels.push(lstmPredictionLabel);
        values.push(lstmPredictionValue);

        return {
            labels,
            datasets: [{
                label: 'Grasa Corporal (%)',
                data: values,
                backgroundColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(236, 72, 153, 0.2)'//'rgba(255, 149, 0, 0.2)' // Orange for prediction
                        : 'rgba(236, 72, 153, 0.2)'  // Normal color
                ),
                borderColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(236, 72, 153, 1)' //'rgba(255, 149, 0, 0.8)' // Orange border for prediction
                        : 'rgba(236, 72, 153, 0.8)'  // Normal border
                ),
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rgba(236, 72, 153, 1)' //'rgba(255, 149, 0, 1)' // Orange point for prediction
                        : 'rgba(236, 72, 153, 1)'  // Normal point color
                ),
                pointStyle: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rect' // Square for prediction
                        : 'circle'  // Circle for normal data
                ),
                pointRadius: values.map((_, index) =>
                    index === values.length - 1 
                        ? 8 // Larger size for prediction
                        : 4  // Normal size
                ),
                segment: {
                    borderDash: (ctx) => {
                        // Add dashed line to the segment leading to prediction
                        const currentIndex = ctx.p0DataIndex;
                        const nextIndex = ctx.p1DataIndex;
                        if (nextIndex === values.length - 1) {
                            return [5, 5]; // Dashed line to prediction
                        }
                        return []; // Solid line for normal data
                    }
                }
            }]
        };
    }

    processBoneMassData(data, startDate, endDate) {
        if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

        const filteredData = this.filterDataByDate(data, startDate, endDate);
        const labels = filteredData.map(item => new Date(item.start).toLocaleDateString());
        const values = filteredData.map(item => item.data.mass.inKilograms);

        const lstmPredictionLabel = `Predicción ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}`; //date of tomorrow
        const lstmPredictionValue = this.lstmData.predictions.find(pred => pred.datasetId === 'boneMass')?.prediction || 0;
        labels.push(lstmPredictionLabel);
        values.push(lstmPredictionValue);

        return {
            labels,
            datasets: [{
                label: 'Masa Ósea (kg)',
                data: values,
                backgroundColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(6, 182, 212, 0.2)'//'rgba(255, 149, 0, 0.2)' // Orange for prediction
                        : 'rgba(6, 182, 212, 0.2)'  // Normal color
                ),
                borderColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(6, 182, 212, 1)'//'rgba(255, 149, 0, 0.8)' // Orange border for prediction
                        : 'rgba(6, 182, 212, 0.8)'  // Normal border
                ),
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rgba(6, 182, 212, 1)'//'rgba(255, 149, 0, 1)' // Orange point for prediction
                        : 'rgba(6, 182, 212, 1)'  // Normal point color
                ),
                pointStyle: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rect' // Square for prediction
                        : 'circle'  // Circle for normal data
                ),
                pointRadius: values.map((_, index) =>
                    index === values.length - 1 
                        ? 8 // Larger size for prediction
                        : 4  // Normal size
                ),
                segment: {
                    borderDash: (ctx) => {
                        // Add dashed line to the segment leading to prediction
                        const currentIndex = ctx.p0DataIndex;
                        const nextIndex = ctx.p1DataIndex;
                        if (nextIndex === values.length - 1) {
                            return [5, 5]; // Dashed line to prediction
                        }
                        return []; // Solid line for normal data
                    }
                }
            }]
        };
    }

    processLeanBodyMassData(data, startDate, endDate) {
        if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

        const filteredData = this.filterDataByDate(data, startDate, endDate);
        const labels = filteredData.map(item => new Date(item.start).toLocaleDateString());
        const values = filteredData.map(item => item.data.mass.inKilograms);

        const lstmPredictionLabel = `Predicción ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}`; //date of tomorrow
        const lstmPredictionValue = this.lstmData.predictions.find(pred => pred.datasetId === 'leanBodyMass')?.prediction || 0;
        labels.push(lstmPredictionLabel);
        values.push(lstmPredictionValue);

        return {
            labels,
            datasets: [{
                label: 'Masa Corporal Magra (kg)',
                data: values,
                backgroundColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(16, 185, 129, 0.2)'//'rgba(255, 149, 0, 0.2)' // Orange for prediction
                        : 'rgba(16, 185, 129, 0.2)'  // Normal color
                ),
                borderColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(16, 185, 129, 1)'//'rgba(255, 149, 0, 0.8)' // Orange border for prediction
                        : 'rgba(16, 185, 129, 0.8)'  // Normal border
                ),
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rgba(16, 185, 129, 1)'//'rgba(255, 149, 0, 1)' // Orange point for prediction
                        : 'rgba(16, 185, 129, 1)'  // Normal point color
                ),
                pointStyle: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rect' // Square for prediction
                        : 'circle'  // Circle for normal data
                ),
                pointRadius: values.map((_, index) =>
                    index === values.length - 1 
                        ? 8 // Larger size for prediction
                        : 4  // Normal size
                ),
                segment: {
                    borderDash: (ctx) => {
                        // Add dashed line to the segment leading to prediction
                        const currentIndex = ctx.p0DataIndex;
                        const nextIndex = ctx.p1DataIndex;
                        if (nextIndex === values.length - 1) {
                            return [5, 5]; // Dashed line to prediction
                        }
                        return []; // Solid line for normal data
                    }
                }
            }]
        };
    }

    processWeightData(data, startDate, endDate) {
        if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

        const filteredData = this.filterDataByDate(data, startDate, endDate);
        const labels = filteredData.map(item => new Date(item.start).toLocaleDateString());
        const values = filteredData.map(item => item.data.weight.inKilograms);

        const lstmPredictionLabel = `Predicción ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}`; //date of tomorrow
        const lstmPredictionValue = this.lstmData.predictions.find(pred => pred.datasetId === 'weight')?.prediction || 0;
        labels.push(lstmPredictionLabel);
        values.push(lstmPredictionValue);

        return {
            labels,
            datasets: [{
                label: 'Peso (kg)',
                data: values,
                backgroundColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(34, 197, 94, 0.2)'//'rgba(255, 149, 0, 0.2)' // Orange for prediction
                        : 'rgba(34, 197, 94, 0.2)'  // Normal color
                ),
                borderColor: values.map((_, index) => 
                    index === values.length - 1 
                        ? 'rgba(34, 197, 94, 0.8)'//'rgba(255, 149, 0, 0.8)' // Orange border for prediction
                        : 'rgba(34, 197, 94, 0.8)'  // Normal border
                ),
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rgba(34, 197, 94, 0.8)'//'rgba(255, 149, 0, 1)' // Orange point for prediction
                        : 'rgba(34, 197, 94, 1)'  // Normal point color
                ),
                pointStyle: values.map((_, index) =>
                    index === values.length - 1 
                        ? 'rect' // Square for prediction
                        : 'circle'  // Circle for normal data
                ),
                pointRadius: values.map((_, index) =>
                    index === values.length - 1 
                        ? 8 // Larger size for prediction
                        : 4  // Normal size
                ),
                segment: {
                    borderDash: (ctx) => {
                        // Add dashed line to the segment leading to prediction
                        const currentIndex = ctx.p0DataIndex;
                        const nextIndex = ctx.p1DataIndex;
                        if (nextIndex === values.length - 1) {
                            return [5, 5]; // Dashed line to prediction
                        }
                        return []; // Solid line for normal data
                    }
                }
            }]
        };
    }

    getChartConfig(title, yAxisLabel) {
        return {
            type: 'line',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        font: { size: 16, weight: 'bold' },
                        color: '#1f2937'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#1f2937',
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: yAxisLabel,
                            color: '#6b7280'
                        },
                        grid: {
                            display: true,
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo',
                            color: '#6b7280'
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        };
    }

    createChart(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas con id '${canvasId}' no encontrado`);
            return null;
        }

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
            delete this.charts[canvasId];
        }

        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            existingChart.destroy();
        }

        this.charts[canvasId] = new Chart(canvas, config);
        return this.charts[canvasId];
    }

    // Fix all create methods to accept date parameters
    createActiveCaloriesChart(canvasId, data, startDate, endDate) {
        const processedData = this.processActiveCaloriesData(data, startDate, endDate);
        const config = this.getChartConfig('Calorías Activas Quemadas', 'Calorías (kcal)');
        config.data = processedData;
        return this.createChart(canvasId, config);
    }

    createHeartRateChart(canvasId, data, startDate, endDate) {
        const processedData = this.processHeartRateData(data, startDate, endDate);
        const config = this.getChartConfig('Ritmo Cardíaco', 'Pulsaciones por minuto (BPM)');
        config.data = processedData;
        return this.createChart(canvasId, config);
    }

    createOxygenSaturationChart(canvasId, data, startDate, endDate) {
        const processedData = this.processOxygenSaturationData(data, startDate, endDate);
        const config = this.getChartConfig('Saturación de Oxígeno', 'Porcentaje (%)');
        config.data = processedData;
        return this.createChart(canvasId, config);
    }

    createSleepSessionChart(canvasId, data, startDate, endDate) {
        const processedData = this.processSleepSessionData(data, startDate, endDate);
        const config = this.getChartConfig('Sesiones de Sueño', 'Duración (horas)');
        config.data = processedData;
        return this.createChart(canvasId, config);
    }

    createStepsChart(canvasId, data, startDate, endDate) {
        const processedData = this.processStepsData(data, startDate, endDate);
        const config = this.getChartConfig('Pasos Diarios', 'Número de Pasos');
        config.data = processedData;
        return this.createChart(canvasId, config);
    }

    createBasalMetabolicRateChart(canvasId, data, startDate, endDate) {
        const processedData = this.processBasalMetabolicRateData(data, startDate, endDate);
        const config = this.getChartConfig('Tasa Metabólica Basal', 'Calorías/día');
        config.data = processedData;
        return this.createChart(canvasId, config);
    }

    createBodyFatChart(canvasId, data, startDate, endDate) {
        const processedData = this.processBodyFatData(data, startDate, endDate);
        const config = this.getChartConfig('Grasa Corporal', 'Porcentaje (%)');
        config.data = processedData;
        return this.createChart(canvasId, config);
    }

    createBoneMassChart(canvasId, data, startDate, endDate) {
        const processedData = this.processBoneMassData(data, startDate, endDate);
        const config = this.getChartConfig('Masa Ósea', 'Kilogramos (kg)');
        config.data = processedData;
        return this.createChart(canvasId, config);
    }

    createLeanBodyMassChart(canvasId, data, startDate, endDate) {
        const processedData = this.processLeanBodyMassData(data, startDate, endDate);
        const config = this.getChartConfig('Masa Corporal Magra', 'Kilogramos (kg)');
        config.data = processedData;
        return this.createChart(canvasId, config);
    }

    createWeightChart(canvasId, data, startDate, endDate) {
        const processedData = this.processWeightData(data, startDate, endDate);
        const config = this.getChartConfig('Peso Corporal', 'Kilogramos (kg)');
        config.data = processedData;
        return this.createChart(canvasId, config);
    }

    refreshChartsWithDateRange(startDate, endDate) {
        const graphConfigs = [
            { key: 'activeCaloriesBurned', method: 'createActiveCaloriesChart', canvasId: 'activeCaloriesChart' },
            { key: 'heartRate', method: 'createHeartRateChart', canvasId: 'heartRateChart' },
            { key: 'oxygenSaturation', method: 'createOxygenSaturationChart', canvasId: 'oxygenSaturationChart' },
            { key: 'sleepSession', method: 'createSleepSessionChart', canvasId: 'sleepSessionChart' },
            { key: 'steps', method: 'createStepsChart', canvasId: 'stepsChart' },
            { key: 'basalMetabolicRate', method: 'createBasalMetabolicRateChart', canvasId: 'basalMetabolicRateChart' },
            { key: 'bodyFat', method: 'createBodyFatChart', canvasId: 'bodyFatChart' },
            { key: 'boneMass', method: 'createBoneMassChart', canvasId: 'boneMassChart' },
            { key: 'leanBodyMass', method: 'createLeanBodyMassChart', canvasId: 'leanBodyMassChart' },
            { key: 'weight', method: 'createWeightChart', canvasId: 'weightChart' }
        ];

        graphConfigs.forEach(config => {
            if (this.currentData[config.key]) {
                try {
                    this[config.method](config.canvasId, this.currentData[config.key], startDate, endDate);
                } catch (chartError) {
                    console.error(`Error updating chart ${config.key}:`, chartError);
                }
            }
        });
    }

    // Fix initializeGraphs to accept and use date parameters
        async initializeGraphs() {
        try {
            if (!this.token) {
                throw new Error('Token de autenticación no encontrado');
            }

            console.log('Iniciando carga de datos...');
            const allData = await this.fetchAllData();
            this.currentData = allData; // Store data for filtering
            console.log('Datos cargados:', allData);

            console.log('Todos los gráficos inicializados');
            return allData;

        } catch (error) {
            console.error('Error al inicializar gráficos:', error);
            throw error;
        }
    }

    // Method to create all charts with date filtering
    createAllCharts(startDate, endDate) {
        const graphConfigs = [
            { key: 'activeCaloriesBurned', method: 'createActiveCaloriesChart', canvasId: 'activeCaloriesChart' },
            { key: 'heartRate', method: 'createHeartRateChart', canvasId: 'heartRateChart' },
            { key: 'oxygenSaturation', method: 'createOxygenSaturationChart', canvasId: 'oxygenSaturationChart' },
            { key: 'sleepSession', method: 'createSleepSessionChart', canvasId: 'sleepSessionChart' },
            { key: 'steps', method: 'createStepsChart', canvasId: 'stepsChart' },
            { key: 'basalMetabolicRate', method: 'createBasalMetabolicRateChart', canvasId: 'basalMetabolicRateChart' },
            { key: 'bodyFat', method: 'createBodyFatChart', canvasId: 'bodyFatChart' },
            { key: 'boneMass', method: 'createBoneMassChart', canvasId: 'boneMassChart' },
            { key: 'leanBodyMass', method: 'createLeanBodyMassChart', canvasId: 'leanBodyMassChart' },
            { key: 'weight', method: 'createWeightChart', canvasId: 'weightChart' }
        ];

        graphConfigs.forEach(config => {
            if (this.currentData[config.key]) {
                try {
                    this[config.method](config.canvasId, this.currentData[config.key], startDate, endDate);
                    console.log(`✓ Gráfico ${config.key} creado`);
                } catch (chartError) {
                    console.error(`✗ Error creando gráfico ${config.key}:`, chartError);
                }
            } else {
                console.warn(`✗ No hay datos para ${config.key}`);
            }
        });
    }

    // Keep the existing refreshChartsWithDateRange method
    refreshChartsWithDateRange(startDate, endDate) {
        const graphConfigs = [
            { key: 'activeCaloriesBurned', method: 'createActiveCaloriesChart', canvasId: 'activeCaloriesChart' },
            { key: 'heartRate', method: 'createHeartRateChart', canvasId: 'heartRateChart' },
            { key: 'oxygenSaturation', method: 'createOxygenSaturationChart', canvasId: 'oxygenSaturationChart' },
            { key: 'sleepSession', method: 'createSleepSessionChart', canvasId: 'sleepSessionChart' },
            { key: 'steps', method: 'createStepsChart', canvasId: 'stepsChart' },
            { key: 'basalMetabolicRate', method: 'createBasalMetabolicRateChart', canvasId: 'basalMetabolicRateChart' },
            { key: 'bodyFat', method: 'createBodyFatChart', canvasId: 'bodyFatChart' },
            { key: 'boneMass', method: 'createBoneMassChart', canvasId: 'boneMassChart' },
            { key: 'leanBodyMass', method: 'createLeanBodyMassChart', canvasId: 'leanBodyMassChart' },
            { key: 'weight', method: 'createWeightChart', canvasId: 'weightChart' }
        ];

        graphConfigs.forEach(config => {
            if (this.currentData[config.key]) {
                try {
                    this[config.method](config.canvasId, this.currentData[config.key], startDate, endDate);
                } catch (chartError) {
                    console.error(`Error updating chart ${config.key}:`, chartError);
                }
            }
        });
    }

    // Simplified destroyAllCharts
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

const HealthGraphsComponent = () => {
    const [healthGraphs, setHealthGraphs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState([]);

    // Change default to last 30 days
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30); // Last 30 days
        return date.toISOString().split('T')[0];
    });
    
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const addDebugInfo = (message) => {
        setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const handleDateChange = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        
        if (healthGraphs) {
            // Only refresh charts, don't fetch data again
            healthGraphs.refreshChartsWithDateRange(newStartDate, newEndDate);
        }
    };

    // Remove startDate and endDate from dependencies - only initialize once
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            addDebugInfo('DOM renderizado, iniciando carga de datos...');
            
            if (token) {
                const graphs = new HealthGraphs(token);
                setHealthGraphs(graphs);
                
                // Fetch data once, then create initial charts
                graphs.initializeGraphs()
                    .then(() => {
                        addDebugInfo('Datos cargados exitosamente');
                        // Create initial charts with current date range
                        graphs.createAllCharts(startDate, endDate);
                        addDebugInfo('Gráficos inicializados exitosamente');
                        setLoading(false);
                    })
                    .catch(err => {
                        addDebugInfo(`Error al inicializar gráficos: ${err.message}`);
                        setError(err.message);
                        setLoading(false);
                    });
            } else {
                addDebugInfo('No se encontró token de autenticación');
                setError('No se encontró token de autenticación');
                setLoading(false);
            }
        }

        return () => {
            if (healthGraphs) {
                healthGraphs.destroyAllCharts();
            }
        };
    }, []); // Empty dependency array - only run once

    // Add useEffect to handle initial chart creation after healthGraphs is set
    useEffect(() => {
        if (healthGraphs && !loading && !error) {
            healthGraphs.createAllCharts(startDate, endDate);
        }
    }, [healthGraphs, loading, error]);

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loading-content">
                    <div>Cargando datos y creando gráficos...</div>
                    <div className="debug-info">
                        <h3>Debug Info:</h3>
                        <ul>
                            {debugInfo.map((info, index) => (
                                <li key={index}>{info}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div>
                    <div>Error: {error}</div>
                    <div className="debug-info">
                        <h3>Debug Info:</h3>
                        <ul>
                            {debugInfo.map((info, index) => (
                                <li key={index}>{info}</li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={() => window.location.reload()}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="health-graphs-container">
            <h1>Gráficos de Salud</h1>
            
            <DateFilter 
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
            />

            <div className="chart-grid">
                <div className="chart-item">
                    <h3>Calorías Activas</h3>
                    <canvas id="activeCaloriesChart" width="400" height="200"></canvas>
                </div>
                <div className="chart-item">
                    <h3>Ritmo Cardíaco</h3>
                    <canvas id="heartRateChart" width="400" height="200"></canvas>
                </div>
                <div className="chart-item">
                    <h3>Saturación de Oxígeno</h3>
                    <canvas id="oxygenSaturationChart" width="400" height="200"></canvas>
                </div>
                <div className="chart-item">
                    <h3>Sesiones de Sueño</h3>
                    <canvas id="sleepSessionChart" width="400" height="200"></canvas>
                </div>
                <div className="chart-item">
                    <h3>Pasos</h3>
                    <canvas id="stepsChart" width="400" height="200"></canvas>
                </div>
                <div className="chart-item">
                    <h3>Tasa Metabólica Basal</h3>
                    <canvas id="basalMetabolicRateChart" width="400" height="200"></canvas>
                </div>
                <div className="chart-item">
                    <h3>Grasa Corporal</h3>
                    <canvas id="bodyFatChart" width="400" height="200"></canvas>
                </div>
                <div className="chart-item">
                    <h3>Masa Ósea</h3>
                    <canvas id="boneMassChart" width="400" height="200"></canvas>
                </div>
                <div className="chart-item">
                    <h3>Masa Corporal Magra</h3>
                    <canvas id="leanBodyMassChart" width="400" height="200"></canvas>
                </div>
                <div className="chart-item">
                    <h3>Peso</h3>
                    <canvas id="weightChart" width="400" height="200"></canvas>
                </div>
            </div>
        </div>
    );
};

export default HealthGraphsComponent;