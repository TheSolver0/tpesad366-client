// LineChart.jsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Enregistrement des composants requis pour le graphique en ligne
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Données du graphique
const data = {
  labels: ['Electronique', 'Menager', 'ElectroMenager'],
  datasets: [
    {
      label: 'Nombre de ventes',
      data: [130, 50, 60],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.5, // courbe lissée
      fill: true,
    },
  ],
};

// Options du graphique
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Évolution des Ventes par catégories de produits',
    },
  },
  scales: {
    y: {
         beginAtZero: true,
    //   stacked: true,
    },
  },
};

const LineChart = () => {
  return <Line data={data} options={options} />;
};

export default LineChart;
