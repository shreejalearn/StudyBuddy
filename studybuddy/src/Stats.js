import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js/auto';
import Navbar from './Navbar';

Chart.register(ArcElement);

const StatsComponent = () => {
  const [topSections, setTopSections] = useState([]);
  const [topCollections, setTopCollections] = useState([]);
  const [mostDifficult, setMostDifficult] = useState([]);

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

        const hardestResponse = await axios.get('http://localhost:5000/most_challenging', {
          params: {
            username: localStorage.getItem('userName')
          }
        });

        const topSectionsLimited = sectionResponse.data.top_sections.slice(0, 5);
        const topCollectionsLimited = collectionResponse.data.top_collections.slice(0, 5);

        setTopSections(topSectionsLimited);
        setTopCollections(topCollectionsLimited);
        setMostDifficult(hardestResponse.data.most_challenging_sections); // Ensure this is an array
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const convertToMinutes = (milliseconds) => {
    return Math.round(milliseconds / (1000 * 60));
  };

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

      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '3.5rem', color: 'gray' }}>Most Challenging Topics</h2>
      <div style={{ maxWidth: '80%', margin: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>#</th>
              <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Section Name</th>
              <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Average Score</th>
            </tr>
          </thead>
          <tbody>
            {mostDifficult.map((section, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{index + 1}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{section.section_name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{section.avg_score.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsComponent;
