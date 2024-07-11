import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import './styles/annotations.css';
import axios from 'axios';

const Annotations = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedText, setHighlightedText] = useState('');
  const [newAnnotation, setNewAnnotation] = useState('');
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const noteContentRef = useRef(null);
  const [hoveredAnnotation, setHoveredAnnotation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const chapterId = localStorage.getItem('currentSection');
  const collectionId = localStorage.getItem('currentCollection');
  const [highlightedRange, setHighlightedRange] = useState({ start: 0, end: 0 });



  useEffect(() => {
    const fetchNotes = async () => {
      const response = await axios.get('http://localhost:5000/get_notes_ann', {
        params: {
          collection_id: collectionId,
          section_id: chapterId,
        },
      });
      const fetchedNotes = response.data.notes.map((note) => {
        return {
          id: note.id,
          title: note.title,
          notes: note.notes,
        };
      });
      
      setNotes(fetchedNotes);
    };
    fetchNotes();
  }, [chapterId, collectionId]);

  useEffect(() => {
    if (selectedNote) {
      const fetchAnnotations = async () => {
        const response = await axios.get('http://localhost:5000/get_annotations', {
          params: {
            section_id: chapterId,
            note_id: selectedNote.id,
          },
        });
        const fetchedAnnotations = response.data.annotations.map((annotation) => ({
          id: annotation.id,
          text: annotation.annotation,
          range: {
            start: annotation.start_ind,
            end: annotation.end_ind,
          },
        }));
        setAnnotations(fetchedAnnotations);
      };
      fetchAnnotations();
    }
  }, [selectedNote, chapterId]);

  const handleNoteSelect = async (note) => {
    setSelectedNote(note);
    setAnnotations([]);
    const suggestedAnnotations = await fetchSuggestedAnnotations(note.id);
    console.log(suggestedAnnotations);
  };

  const fetchSuggestedAnnotations = async (noteId) => {
    const response = await axios.get('http://localhost:5000/suggest_annotations', {
      params: {
        collection_id: collectionId,
        section_id: chapterId,
        note_id: noteId
      },
    });
    return response.data.suggested_annotations;
  };
  const handleTextHighlight = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString().trim();
      if (selectedText) {
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(noteContentRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const start = preSelectionRange.toString().length;
        const end = start + selectedText.length;

        setHighlightedText(selectedText);
        setHighlightedRange({ start, end });
        setIsModalOpen(true);
      }
    }
  };

  const handleAnnotationSave = async () => {
    try {
      const response = await axios.post('http://localhost:5000/upload_annotation', {
        collection_id: collectionId,
        section_id: chapterId,
        note_id: selectedNote.id,
        annotation: newAnnotation,
        start: highlightedRange.start,
        end: highlightedRange.end,
      });

      const annotationId = response.data.annotation_id; // Assuming your API returns the new annotation ID
      setAnnotations([
        ...annotations,
        { id: annotationId, text: highlightedText, note: newAnnotation, range: highlightedRange },
      ]);
      setIsModalOpen(false);
      setHighlightedText('');
      setNewAnnotation('');
    } catch (error) {
      console.error('Error uploading annotation:', error);
    }
  };

  const modalClose = () => {
    setIsModalOpen(false);
    setCurrentAnnotation(null);
    setIsEditing(false);
  };

  const handleAnnotationView = (annotation) => {
    setCurrentAnnotation(annotation);
    setNewAnnotation(annotation.text);
    setIsModalOpen(true);
    setIsEditing(false); // Ensure editing mode is off when viewing
  };

  const handleAnnotationEdit = async () => {
    try {
      await axios.put('http://localhost:5000/edit_annotation', {
        collection_id: collectionId,
        section_id: chapterId,
        note_id: selectedNote.id,
        annotation_id: currentAnnotation.id,
        new_annotation: newAnnotation,
      });

      const updatedAnnotations = annotations.map((annotation) =>
        annotation.id === currentAnnotation.id
          ? { ...annotation, text: newAnnotation }
          : annotation
      );
      setAnnotations(updatedAnnotations);
      setIsModalOpen(false);
      setCurrentAnnotation(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing annotation:', error);
    }
  };

  const handleAnnotationDelete = async () => {
    try {
      await axios.delete('http://localhost:5000/delete_annotation', {
        params: {
          collection_id: collectionId,
          section_id: chapterId,
          note_id: selectedNote.id,
          annotation_id: currentAnnotation.id,
        },
      });

      const filteredAnnotations = annotations.filter(
        (annotation) => annotation.id !== currentAnnotation.id
      );
      setAnnotations(filteredAnnotations);
      setIsModalOpen(false);
      setCurrentAnnotation(null);
    } catch (error) {
      console.error('Error deleting annotation:', error);
    }
  };

  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (noteContentRef.current) {
      noteContentRef.current.addEventListener('mouseup', handleTextHighlight);
    }

    return () => {
      if (noteContentRef.current) {
        noteContentRef.current.removeEventListener('mouseup', handleTextHighlight);
      }
    };
  }, [handleTextHighlight]);

  return (
    <div className="annotations-container">
      <h2>Annotations</h2>

      <select onChange={(e) => handleNoteSelect(notes.find((note) => note.id === e.target.value))}>
        <option value="">Select a note</option>
        {notes.map((note) => (
          <option key={note.id} value={note.id}>
            {note.title}
          </option>
        ))}
      </select>

      {selectedNote && (
        <div>
          <h3>Note Content</h3>

          <div ref={noteContentRef} className="note-content">
            {selectedNote.notes.split('').map((char, index) => {
              const annotation = annotations.find((ann) => {
                return ann && index >= ann.range.start && index < ann.range.end;
              });
              const isHovered = hoveredAnnotation === annotation;
              const isHighlighted =
                highlightedRange &&
                index >= highlightedRange.start &&
                index < highlightedRange.end;
              return (
                <span
                  key={index}
                  className={`annotation-highlight ${annotation ? 'has-annotation' : ''} ${
                    isHighlighted ? 'highlighted' : ''
                  }`}
                  style={{
                    backgroundColor: isHovered ? '#c6d419' : annotation ? '#f7f7a1' : 'transparent',
                    cursor: annotation ? 'pointer' : 'auto',
                  }}
                  onMouseEnter={() => annotation && setHoveredAnnotation(annotation)}
                  onMouseLeave={() => setHoveredAnnotation(null)}
                  onClick={() => annotation && handleAnnotationView(annotation)}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={modalClose}
        className="modal"
        overlayClassName="overlay"
        shouldCloseOnOverlayClick={true}
        style={{
          content: {
            position: 'fixed',
            zIndex: 1,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
            maxWidth: '80%',
            width: '400px',
            maxHeight: '80%',
            overflow: 'auto',
          },
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          },
        }}
      >
        {currentAnnotation ? (
          <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
            <div style={{ marginBottom: '10px', flexGrow: 1, overflow: 'auto' }}>
              <h3 style={{ marginTop: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                Annotation
              </h3>
              {isEditing ? (
                <textarea
                  value={newAnnotation}
                  onChange={(e) => setNewAnnotation(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100px',
                    fontSize: '16px',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    resize: 'none',
                  }}
                />
              ) : (
                <p style={{ fontSize: '16px', color: '#555', wordBreak: 'break-word' }}>
                  {currentAnnotation.text}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {isEditing ? (
                <button
                  onClick={handleAnnotationEdit}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={handleEditButtonClick}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleAnnotationDelete}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
            <div style={{ marginBottom: '10px', flexGrow: 1, overflow: 'auto' }}>
              <h3 style={{ marginTop: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                Add Annotation
              </h3>
              <p style={{ fontSize: '16px', color: '#555', wordBreak: 'break-word' }}>
                Highlighted text: {highlightedText}
              </p>
              <textarea
                value={newAnnotation}
                onChange={(e) => setNewAnnotation(e.target.value)}
                placeholder="Enter your annotation"
                style={{
                  width: '100%',
                  height: '100px',
                  fontSize: '16px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  resize: 'none',
                }}
              />
            </div>
            <button
              onClick={handleAnnotationSave}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Save
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Annotations;
