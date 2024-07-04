import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

const Upload = ({ onUploadSuccess }) => {
  const [rawText, setRawText] = useState('');
  const [response, setResponse] = useState('');

  const handleTextChange = (event) => {
    setRawText(event.target.value);
  };

  const handleSubmitText = async () => {
    try {
      const formData = new FormData();
      formData.append('raw_text', rawText);
      formData.append('collection_id', localStorage.getItem('currentCollection'));
      formData.append('section_id', localStorage.getItem('currentSection'));

      const response = await axios.post('http://localhost:5000/process_text', formData);
      setResponse(response.data.response);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading text:', error);
    }
  };

  return (
    <div style={styles.uploadContainer}>
      <textarea
        rows="4"
        cols="50"
        value={rawText}
        onChange={handleTextChange}
        placeholder="Enter your text here..."
        style={styles.textarea}
      />
      <button onClick={handleSubmitText} style={styles.button}>Upload Text</button>
      {response && <p style={styles.response}>{response}</p>}
    </div>
  );
};

const UploadVideo = ({ onUploadSuccess }) => {
  const [video, setVideo] = useState('');
  const [response, setResponse] = useState('');

  const handleTextChange = (event) => {
    setVideo(event.target.value);
  };

  const handleSubmitText = async () => {
    try {
      const formData = new FormData();
      formData.append('url', video);
      formData.append('collection_id', localStorage.getItem('currentCollection'));
      formData.append('section_id', localStorage.getItem('currentSection'));

      const response = await axios.post('http://localhost:5000/get_transcript', formData);
      setResponse(response.data.response);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading text:', error);
    }
  };

  return (
    <div style={styles.uploadContainer}>
      <input
        type="text"
        value={video}
        onChange={handleTextChange}
        placeholder="Enter URL here..."
        style={styles.input}
      />
      <button onClick={handleSubmitText} style={styles.button}>Upload Url</button>
      {response && <p style={styles.response}>{response}</p>}
    </div>
  );
};

const UploadLink = ({ onUploadSuccess }) => {
  const [link, setLink] = useState('');
  const [response, setResponse] = useState('');

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  const handleUploadLink = async () => {
    try {
      const formData = new FormData();
      formData.append('link', link);
      formData.append('collection_id', localStorage.getItem('currentCollection'));
      formData.append('section_id', localStorage.getItem('currentSection'));

      const response = await axios.post('http://localhost:5000/process_link', formData);
      setResponse(response.data.response);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading link:', error);
    }
  };

  return (
    <div style={styles.uploadContainer}>
      <input
        type="text"
        value={link}
        onChange={handleLinkChange}
        placeholder="Enter website link here..."
        style={styles.input}
      />
      <button onClick={handleUploadLink} style={styles.button}>Upload Link</button>
      {response && <p style={styles.response}>{response}</p>}
    </div>
  );
};

const UploadImage = ({ onUploadSuccess }) => {
  const [image, setImage] = useState('');
  const [response, setResponse] = useState('');

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('collection_id', localStorage.getItem('currentCollection'));
      formData.append('section_id', localStorage.getItem('currentSection'));

      const response = await axios.post('http://localhost:5000/recognize', formData);
      setResponse(response.data.response);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div style={styles.uploadContainer}>
      <input type="file" onChange={handleImageChange} style={styles.input} />
      <button onClick={handleUploadImage} style={styles.button}>Upload Image</button>
      {response && <p style={styles.response}>{response}</p>}
    </div>
  );
};

const UploadPDF = ({ onUploadSuccess }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [response, setResponse] = useState('');

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSubmitPDF = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file to upload");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('pdf_file', pdfFile);
      formData.append('collection_id', localStorage.getItem('currentCollection'));
      formData.append('section_id', localStorage.getItem('currentSection'));

      const response = await axios.post('http://localhost:5000/process_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponse(response.data.response);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  return (
    <div style={styles.uploadContainer}>
      <input type="file" accept="application/pdf" onChange={handleFileChange} style={styles.input} />
      <button onClick={handleSubmitPDF} style={styles.button}>Upload PDF</button>
      {response && <p style={styles.response}>{response}</p>}
    </div>
  );
};

const ChapterPage = () => {
  const navigate = useNavigate();
  const chapterId = localStorage.getItem('currentSection');
  const collName = localStorage.getItem('collectionName');
  const chapterName = localStorage.getItem('currentSectionName');
  const collectionId = localStorage.getItem('currentCollection');
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [recognizedText, setRecognizedText] = useState('');
  const [recognizedVid, setRecognizedVid] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const [responseSaved, setResponseSaved] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedSourceNotes, setSelectedSourceNotes] = useState('');
  const [flashcardSaved, setFlashcardSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [worksheets, setWorksheets] = useState([]);
  const [uploadedWorksheet, setUploadedWorksheet] = useState(null);
  const [uploadWorksheetModalOpen, setUploadWorksheetModalOpen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [componentInitialized, setComponentInitialized] = useState(false);

  
  useEffect(() => {
    let startTime = null;
    let endTime = null;
    // const timeout = setTimeout(() => {
    //   setComponentInitialized(true);
    // }, 2000);
    const fetchNotes = async () => {
      try {
        console.log(collectionId);
          console.log(chapterId);
        const response = await axios.get('http://localhost:5000/get_notes', {
          
          params: {
            collection_id: collectionId,
            section_id: chapterId,
          },
        });
        setNotes(response.data.notes);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const updateAccessTime = async () => {
      try {
        await axios.post('http://localhost:5000/update_access_time', {
          collection_id: collectionId,
          section_id: chapterId,
        });
      } catch (error) {
        console.error('Error updating access time:', error);
      }
    };
  
    const handleBeforeUnload = () => {
      endTime = new Date().getTime();
      if (startTime && endTime) {
        const timeSpent = endTime - startTime;
        setTotalTimeSpent(timeSpent); // Update state for display or debugging purposes
        try {
          axios.post('http://localhost:5000/time_spent', {
            collection_id: collectionId,
            section_id: chapterId,
            total_time_spent: timeSpent,
          });
        } catch (error) {
          console.error('Error updating time spent:', error);
        }
      }
    };
  
    const handleUnload = () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      endTime = new Date().getTime();
      if (startTime && endTime) {
        const timeSpent = endTime - startTime;
        try {
          axios.post('http://localhost:5000/time_spent', {
            collection_id: collectionId,
            section_id: chapterId,
            total_time_spent: timeSpent,
          });
        } catch (error) {
          console.error('Error updating time spent:', error);
        }
      }
    };
    fetchNotes();
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
  
    startTime = new Date().getTime();
    updateAccessTime();
  
    return () => {
      handleBeforeUnload();
      // clearTimeout(timeout);
    };
    
  }, [chapterId, collectionId]);
  
  const handleSourceChange = (source) => {
    setSelectedSource((prevState) =>
      prevState.includes(source) ? prevState.filter((s) => s !== source) : [...prevState, source]
    );
  };
  const handleUploadWorksheet = async () => {
    try {
      const formData = new FormData();
      formData.append('worksheet', uploadedWorksheet);
      formData.append('collection_id',collectionId);
      formData.append('section_id', chapterId);

      const response = await axios.post('http://localhost:5000/upload_worksheet', formData);
      console.log(response);
      setResponse(response.data.response);
      closeWorksheetModal();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  const openUploadModal = () => {
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
  };
  const openWorksheetModal = () => {
    setUploadWorksheetModalOpen(true);
  };

  const closeWorksheetModal = () => {
    setUploadWorksheetModalOpen(false);
  };

  const handleUpload = async (event) => {
    const formData = new FormData();
    if (uploadType === 'image') {
      formData.append('image', event.target.files[0]);
    } else if (uploadType === 'video') {
      formData.append('url', event.target.value);
    } else if (uploadType === 'text') {
      formData.append('raw_text', event.target.value);
    } else if (uploadType === 'link') {
      formData.append('link', event.target.value);
    } else if (uploadType === 'pdf') {
      formData.append('pdf_file', event.target.files[0]);
    }
    formData.append('collection_id', collectionId);
    formData.append('section_id', chapterId);

    try {
      let response;
      if (uploadType === 'image') {
        response = await axios.post('http://localhost:5000/recognize', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else if (uploadType === 'video') {
        response = await axios.post('http://localhost:5000/get_transcript', formData);
      } else if (uploadType === 'text') {
        response = await axios.post('http://localhost:5000/process_text', formData);
      } else if (uploadType === 'link') {
        response = await axios.post('http://localhost:5000/process_link', formData);
      } else if (uploadType === 'pdf') {
        response = await axios.post('http://localhost:5000/process_pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      const updatedNotesResponse = await axios.get('http://localhost:5000/get_notes', {
        params: {
          collection_id: collectionId,
          section_id: chapterId,
        },
      });
      
      setNotes(updatedNotesResponse.data.notes);
      closeUploadModal();
    } catch (error) {
      console.error(`Error uploading ${uploadType}:`, error);
    }
  };

  const handleUploadType = (type) => {
    setUploadType(type);
  };

  const formatBingResponse = (response) => {
    const paragraphs = response.split('\n');
    
    const formattedParagraphs = paragraphs.map((paragraph, index) => {
      const boldRegex = /\*\*(.*?)\*\*/g;
      let formattedParagraph = paragraph.replace(boldRegex, '<strong>$1</strong>');
  
      formattedParagraph = formattedParagraph.replace(/\[(.*?)\]\((.*?)\)/g, '\n<a href="$2">$1</a>');
  
      return <p key={index} dangerouslySetInnerHTML={{ __html: formattedParagraph }} />;
    });
  
    return formattedParagraphs;
  };
  

  const handleSubmitQuestion = async () => {
    try {
      setLoading(true);
      // const res = await axios.post('http://localhost:5000/answer_question', {
      //   username: localStorage.getItem('username'),
      //   class: localStorage.getItem('currentCollection'),
      //   data: prompt,
      // });
      // const data = {
      //   collection_id: collectionId,
      //   section_id: chapterId,
      //   question: prompt
      // };

      // const config = {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // };

      const res = await axios.post('http://localhost:5000/conduct_conversation', 
        {
          collection_name: localStorage.getItem('collection_name'),
          // qa_chain: localStorage.getItem('qaChain'), // Retrieve QA chain from localStorage or state
          question: prompt,
        }, 
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
      );
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResponse = async () => {
    try {
      await axios.post('http://localhost:5000/save_response', {
        response: response,
        collection_id: collectionId,
        section_id: chapterId,
      });
      setResponseSaved(true);
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const toggleVisibility = async () => {
    const newVisibility = isPublic ? 'private' : 'public';
    setIsPublic(!isPublic);

    try {
      const response = await axios.post('http://localhost:5000/section_visibility', {
        collection_id: collectionId,
        section_id: chapterId,
        visibility: newVisibility,
      });
      console.log('Visibility updated:', response.data);
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  const addToFlashcards = async () => {
    try {
      const r = await axios.post('http://localhost:5000/add_res_to_flashcards', {
        question: prompt, // Use the user's question as the flashcard question
        answer: response, // Use the AI's response as the flashcard answer
        collection_id: collectionId,
        section_id: chapterId,
      });
      setFlashcardSaved(true);

      console.log('Flashcard added:', r.data);
    } catch (error) {
      console.error('Error adding to flashcards:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete('http://localhost:5000/delete_note', {
        params: {
          collection_id: collectionId,
          section_id: chapterId,
          note_id: noteId,
        },
      });
      const updatedNotesResponse = await axios.get('http://localhost:5000/get_notes', {
        params: {
          collection_id: collectionId,
          section_id: chapterId,
        },
      });
      setNotes(updatedNotesResponse.data.notes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  const handleWorksheetChange = (event) => {
    setUploadedWorksheet(event.target.files[0]);
  };

  const handleInitialize = async  () => {
    const response = await axios.post('http://localhost:5000/initialize_llmchain',  
      {
        collection_id: collectionId,
        section_id: chapterId
      }, 
      {
          headers: {
              'Content-Type': 'application/json'
          }
      }
    );
      
    
    if (response.data.success) {
      const { collection_name } = response.data;
      // Handle the initialized collection name and qa_chain as needed
      console.log(`Initialized collection: ${collection_name}`);
      localStorage.setItem('collection_name',collection_name);
      setComponentInitialized(true);
    } else {
      console.error('Initialization failed:', response.data.error);
    }
  };
  const handleDeleteWorksheet = async (noteId) => {
    try {
      await axios.delete('http://localhost:5000/delete_worksheet', {
        params: {
          collection_id: collectionId,
          section_id: chapterId,
          worksheet_id: noteId,
        },
      });
      const updatedNotesResponse = await axios.get('http://localhost:5000/get_worksheets', {
        params: {
          collection_id: collectionId,
          section_id: chapterId,
        },
      });
      setWorksheets(updatedNotesResponse.data.worksheets);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div>
      <Navbar/>
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.header}>
          {collName} - {chapterName}
        </h2>
        <div style={styles.uploadSourceBtn}>
          <button onClick={openUploadModal} style={styles.button}>Upload Source</button>
        </div>
        <div style={styles.notes}>
          <h3 style={styles.header}>Notes</h3>
          {notes.map((note) => (
            <div key={note.id} style={styles.note}>
              <p>{note.tldr}</p>
              <button onClick={() => setSelectedSourceNotes(note.notes)} style={styles.button}>View Source</button>
              <FontAwesomeIcon icon={faTrash} style={styles.deleteIcon} onClick={() => handleDeleteNote(note.id)} />
            </div>
          ))}
          <div style={styles.uploadSourceBtn}>
            <button onClick={openWorksheetModal} style={styles.button}>Upload Worksheet</button>
          </div>
          <h3 style={styles.header}>Worksheets</h3>
          {worksheets.map((worksheet) => (
            <div key={worksheet.id} style={styles.notes}>
              <p>{worksheet.tldr}</p>
              <button onClick={() => setSelectedSourceNotes(worksheet.worksheet)} style={styles.button}>View Worksheet</button>
              <FontAwesomeIcon icon={faTrash} style={styles.deleteIcon} onClick={() => handleDeleteWorksheet(worksheet.id)} />
            </div>
          ))}
          <div style={styles.toggleContainer}>
            <span  style={isPublic ? { ...styles.toggleActive, ...styles.button } : { ...styles.toggleInactive, ...styles.button }} onClick={toggleVisibility}>Public</span>
            <span style={!isPublic ? { ...styles.toggleActive, ...styles.button } : { ...styles.toggleInactive, ...styles.button }} onClick={toggleVisibility}>Private</span>
          </div>
        </div>
      </div>
      
      <div style={styles.mainContent}>
        <div style={styles.tabs}>
          <button style={styles.categoryBtn} onClick={() => navigate('/savedresponses')}>Saved Responses</button>
          <button style={styles.categoryBtn} onClick={() => navigate('/flashcards')}>Flashcards</button>
          <button style={styles.categoryBtn} onClick={() => navigate('/videos')}>Video</button>
          <button style={styles.categoryBtn} onClick={() => navigate('/practicetest')}>Practice Test</button>
          <button style={styles.categoryBtn} onClick={() => navigate('/retentiontest')}>Retention Test</button>
        </div>
        <div style={styles.content}>
          <div style={styles.aiCommunication}>
            <div style={styles.askQuestion}>
              <h3 style={{color: '#839196'}}>Ask A Question</h3>
              {!componentInitialized && (
                <div>
                  <p>Click the button below to initialize the chat based on your current notes:</p>
                  <button onClick={handleInitialize}>Initialize Component</button>
                </div>
              )}
              {componentInitialized && (
                <div>
              <textarea
                rows="4"
                cols="50"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                style={styles.textarea}
              />

              <button
                  onClick={handleSubmitQuestion}
                  disabled={loading || responseSaved} // Disable when loading or response saved
                  style={{
                    ...styles.button,
                    ...(loading && { backgroundColor: '#ccc', cursor: 'not-allowed' }), // Change button style when loading
                  }}
                > {loading ? 'Generating...' : 'Submit'} {/* Conditionally render button text */}
              </button>



              {response && (
                <div>
                  <h2>Response:</h2>
                  <p>{formatBingResponse(response)}</p>
                  <button
                    onClick={handleSaveResponse}
                    disabled={responseSaved}
                    style={{
                      ...styles.button,
                      ...(responseSaved && { backgroundColor: '#ccc', cursor: 'not-allowed' }),
                    }}
                  >
                    {responseSaved ? 'Saved!' : 'Save Response'}
                  </button>

                  <button
                    onClick={addToFlashcards}
                    disabled={flashcardSaved}
                    style={{
                      ...styles.button,
                      ...(flashcardSaved && { backgroundColor: '#ccc', cursor: 'not-allowed' }),
                    }}
                  >
                    {flashcardSaved ? 'Saved!' : 'Add to Flashcards'}
                  </button>
                </div>
              )}
            </div>
            )}

          </div>
          </div>
        </div>
      </div>
      {selectedSourceNotes && (
        <div style={styles.modal} onClick={() => setSelectedSourceNotes('')}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ textAlign: 'center', color: 'gray', fontSize: '2rem', marginBottom: '3%' }}>Full Contents</h2>
            <p>{selectedSourceNotes}</p>
          </div>
        </div>
      )}
      {uploadModalOpen && (
        <div style={styles.modal} onClick={closeUploadModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Upload Source</h2>
            <div style={styles.uploadOptions}>
              <button onClick={() => handleUploadType('image')} style={styles.button}>Upload Image</button>
              <button onClick={() => handleUploadType('video')} style={styles.button}>Upload Video</button>
              <button onClick={() => handleUploadType('text')} style={styles.button}>Upload Text</button>
              <button onClick={() => handleUploadType('link')} style={styles.button}>Upload Link</button>
              <button onClick={() => handleUploadType('pdf')} style={styles.button}>Upload PDF</button>
            </div>
            {uploadType && (
              <div style={styles.uploadForm}>
                {uploadType === 'text' ? (
                  <Upload onUploadSuccess={closeUploadModal} />
                ) : uploadType === 'link' ? (
                  <UploadLink onUploadSuccess={closeUploadModal} />
                ) : uploadType === 'pdf' ? (
                  <UploadPDF onUploadSuccess={closeUploadModal} />
                ) :uploadType === 'image' ? (
                  <UploadImage onUploadSuccess={closeUploadModal} />
                ) : uploadType === 'video' ? (
                  <UploadVideo onUploadSuccess={closeUploadModal} />
                ) : null}
              </div>
            )}
            <div style={styles.sourceUploading}></div>
          </div>
        </div>
      )}
      {uploadWorksheetModalOpen && (
        <div style={styles.modal} onClick={closeWorksheetModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Upload Worksheet</h2>
            <div style={styles.uploadContainer}>
              <input type="file" onChange={handleWorksheetChange} style={styles.input} />
              <button onClick={handleUploadWorksheet} style={styles.button}>Upload</button>
              {response && <p style={styles.response}>{response}</p>}
            </div>
            <div style={styles.sourceUploading}></div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  sidebar: {
    width: '20%',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRight: '1px solid #ccc',
    height: '100%',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#909191',
    height: '100%',
  },
  uploadSourceBtn: {
    marginBottom: '20px',
  },
  notes: {
    marginTop: '20px',
  },
  note: {
    marginBottom: '10px',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
  },
  tabs: {
    display: 'flex',
    backgroundColor: '#dadde0', // Changed to a more muted teal
    borderRadius: '4px',
    padding: '10px 0',
    marginBottom: '20px',
  },
  categoryBtn: {
    padding: '10px 20px',
    cursor: 'pointer',
    color: 'white', // Changed to white for better contrast
    textDecoration: 'none',
    backgroundColor: '#bacbd4', // Changed to a darker gray
    border: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    marginLeft: '20px',
  },
  content: {
    flex: 1,
  },
  aiCommunication: {
    marginBottom: '20px',
  },
  askQuestion: {
    marginBottom: '20px',
  },
  textarea: {
    width: '90%',
    height: '300px',
    padding: '10px',
    marginBottom: '10px',
  },
  button: {
    marginLeft: '3px',
    padding: '10px 20px',
    cursor: 'pointer'
  },
  response: {
    marginTop: '10px',
  },
  toggleContainer: {
    display: 'flex',
    marginTop: '20px',
  },
  toggleActive: {
    cursor: 'pointer',
    padding: '10px 20px',
    backgroundColor: '#92C7CF',
    color: '',
  },
  toggleInactive: {
    cursor: 'pointer',
    padding: '10px 20px',
    backgroundColor: '#cfcdca',
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    width: '500px',
    textAlign: 'center',
    overflow: 'auto',
    width: '80%',
    maxWidth: '80%',
    maxHeight: '80%',
  },
  close: {
    top: '10px',
    right: '50%',
    fontSize: '24px',
    cursor: 'pointer',
  },
  uploadOptions: {
    marginBottom: '20px',
  },
  uploadForm: {
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    width: '80%',
  },
  sourceUploading: {
    marginTop: '20px',
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  deleteIcon: {
    cursor: 'pointer',
    marginLeft: '10px',
    color: '#EE4E4E',
  },
};

export default ChapterPage;
