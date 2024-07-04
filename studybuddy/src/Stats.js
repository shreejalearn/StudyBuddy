import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js/auto';
import Navbar from './Navbar';

Chart.register(ArcElement);

const StatsComponent = () => {
  const [topSections, setTopSections] = useState([]);
  const [topCollections, setTopCollections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionResponse = await axios.get('http://localhost:5000/top-sections', {
          params: {
            username: localStorage.getItem('userName')
          }
        });

        const collectionResponse = await axios.get('http://localhost:5000/top-collections', {
          params: {
            username: localStorage.getItem('userName')
          }
        });
        const topSectionsLimited = sectionResponse.data.top_sections.slice(0, 5);
        // Limit top collections to the first 5 items
        const topCollectionsLimited = collectionResponse.data.top_collections.slice(0, 5);
  
        setTopSections(topSectionsLimited);
        setTopCollections(topCollectionsLimited);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to convert milliseconds to minutes
  const convertToMinutes = (milliseconds) => {
    return Math.round(milliseconds / (1000 * 60));
  };

  // Prepare data for Pie Chart (Sections)
  const sectionChartData = {
    labels: topSections.map(section => section.section_name),
    datasets: [{
      data: topSections.map(section => convertToMinutes(section.total_time)),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#8BC34A',
        '#9C27B0',
        '#FF9800',
        '#009688'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#8BC34A',
        '#9C27B0',
        '#FF9800',
        '#009688'
      ]
    }]
  };

  // Prepare data for Pie Chart (Collections)
  const collChartData = {
    labels: topCollections.map(collection => collection.collection_name),
    datasets: [{
      data: topCollections.map(collection => convertToMinutes(collection.total_time)),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#8BC34A',
        '#9C27B0',
        '#FF9800',
        '#009688'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#8BC34A',
        '#9C27B0',
        '#FF9800',
        '#009688'
      ]
    }]
  };

  return (
    <div>
      <Navbar></Navbar>

      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '3.5rem', color: 'gray' }}>Top Collections</h2>

    <div style={{ maxWidth: '250px', margin: 'auto' }}>
      <Pie data={collChartData} />
    
    </div>
    <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '3.5rem', color: 'gray' }}>Top Sections</h2>

      <div style={{ maxWidth: '250px', margin: 'auto' }}>
        <Pie data={sectionChartData} />
      </div>

    </div>
  );
};

export default StatsComponent;