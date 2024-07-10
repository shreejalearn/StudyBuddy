// MainApp.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import FillerAuth from './FillerAuth';
import Annotations from './Annotations';
import Fill from './Fill';
import SavedResponses from './SavedResponses';
import PublicSections from './PublicSectionsPage';
import Videos from './Videos';
import VideoPlayer from './VideoPlayer';

import AskQuestion from './AskQuestion';
import Home from './Home';
import CollectionsPage from './CollectionsPage';
import Sections from './Sections';
import Chapter from './Chapter';
import PracticeTest from './PracticeTest';
import HomePage from './HomePage';

import Flashcard from './Flashcard';
import RetentionTest from './RetentionTest';

import Login from './Login';
import Signup from './Signup';
import PrivateRoute from './PrivateRoute';
import Stats from './Stats';

import { AuthProvider } from './AuthContext';
import reportWebVitals from './reportWebVitals';

function MainApp() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<FillerAuth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/askquestion" element={<AskQuestion />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/fill" element={<Fill />} />
            <Route path="/upload" element={<App />} />
            <Route path="/publicsections" element={<PublicSections />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/mygallery" element={<CollectionsPage />} />
            <Route path="/annotations" element={<Annotations />} />
            <Route path="/sections" element={<Sections />} />
            <Route path="/retentiontest" element={<RetentionTest />} />
            <Route path="/chapter" element={<Chapter />} />
            <Route path="/question" element={<AskQuestion />} />
            <Route path="/home" element={<Home />} />
            <Route path="/practicetest" element={<PracticeTest />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/savedresponses" element={<SavedResponses />} />
            <Route path="/flashcards" element={<Flashcard />} />
            <Route path="/videoplayer/:videoPath" element={<VideoPlayer />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
