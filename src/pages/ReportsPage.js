import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './ReportsPage.module.css';
import { fetchWithAuth } from '../utils/api'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReportsPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salesData, setSalesData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const fetchSalesForRange = async () => {
        setLoading(true);
        setError(null);

        if (!startDate || !endDate) {
            setError('Please select a start and end date.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetchWithAuth(`http://localhost:8080/api/orders/sales/range?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSalesData(data);
            setLoading(false);
        } catch (e) {
            setError(e);
            setLoading(false);
        }
    };

    const chartData = {
        labels: salesData ? salesData.map(item => item.date) : [],
        datasets: [
            {
                label: 'Total Sales',
                data: salesData ? salesData.map(item => item.totalSales) : [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Sales Over Date Range',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Sales ($)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
        },
    };

    return (
        <div className={styles.reportsPageContainer}>
            <h2>Sales Report</h2>

            <div className={styles.dateRangeSelector}>
                <label htmlFor="startDate">Start Date:</label>
                <input type="date" id="startDate" value={startDate} onChange={handleStartDateChange} />

                <label htmlFor="endDate">End Date:</label>
                <input type="date" id="endDate" value={endDate} onChange={handleEndDateChange} />

                <button onClick={fetchSalesForRange}>Generate Report</button>
            </div>

            {loading && <div>Loading sales data...</div>}
            {error && <div className={styles.error}>{error}</div>}

            {salesData && salesData.length > 0 && (
                <div className={styles.chartContainer}>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}

            {salesData && salesData.length === 0 && !loading && !error && (
                <div>No sales data found for the selected date range.</div>
            )}
        </div>
    );
}

export default ReportsPage;