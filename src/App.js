import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the default calendar styles
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  text-align: center;
  margin: 0 auto;
  width: 500px;
  background: linear-gradient(180deg, #000000, #434343);
  color: white;
  padding: 20px;
  border-radius: 10px;
`;

const StyledCalendar = styled(Calendar)`
  margin: 0 auto;
  max-width: 600px;
  .react-calendar {
    background: grey;
    color: white;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  color: white;
`;

const AddEventButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: white;
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e0e0e0;
  }
`;

const FilterSelect = styled.select`
  margin-top: 20px; /* Added margin to separate it from the Add Event button */
  padding: 5px;
  width: 200px;
  background-color: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 5px;
`;

const EventList = styled.div`
  margin-top: 20px;
`;

const EventItem = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 5px;
  background-color: #444;
  color: white;
  border-radius: 5px;

  &:hover {
    background-color: #555;
  }
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0056b3;
  }
`;

const EventButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0056b3;
  }
`;

const CustomModal = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #000435;
  padding: 20px;
  border: 1px solid #ccc;
  z-index: 1000;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalBackdrop = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const DetailsModal = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: grey;
  padding: 20px;
  border: 1px solid #ccc;
  z-index: 1000;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;


const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #dc3545;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Error = styled.div`
  color: red;
  margin-bottom: 10px;
`;

// App Component
const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [formEvent, setFormEvent] = useState({ title: '', category: '', date: new Date() });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('All');
  const [eventDetails, setEventDetails] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const eventsPerPage = 5;

  // Load events from localStorage when the app starts
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  // Save events to localStorage whenever the events state changes
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Check if a date is in the past
  const isPastDate = (date) => {
    const today = new Date();
    return date < today;
  };

  // Open Modal
  const openModal = (event = null) => {
    if (event) {
      setFormEvent({ title: event.title, category: event.category, date: new Date(event.date) });
      setEditingId(event.id);
    } else {
      setFormEvent({ title: '', category: '', date: selectedDate });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setFormEvent({ title: '', category: '', date: new Date() });
    setEditingId(null);
    setValidationErrors({});
  };

  // Add or Edit Event
  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = {};
    if (!formEvent.title) errors.title = "Title is required.";
    if (!formEvent.category) errors.category = "Category is required.";
    if (!formEvent.date) errors.date = "Date is required.";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return; // Prevent form submission
    }

    if (editingId !== null) {
      setEvents(events.map(event =>
        event.id === editingId ? { ...event, title: formEvent.title, category: formEvent.category, date: formEvent.date } : event
      ));
      setEditingId(null);
    } else {
      setEvents([...events, { id: Date.now(), title: formEvent.title, category: formEvent.category, date: formEvent.date }]);
    }

    closeModal();
  };

  // Delete Event
  const handleDelete = (id) => {
    setEvents(events.filter(event => event.id !== id));
    closeModal();
  };

  // Show Event Details
  const showEventDetails = (event) => {
    setEventDetails(event);
  };

  // Hide Event Details
  const closeEventDetails = () => {
    setEventDetails(null);
  };

  // Filter Events
  const filteredEvents = filterCategory === 'All'
    ? events
    : events.filter(event => event.category === filterCategory);

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Title>Calendar</Title>

      {/* Calendar View */}
      <StyledCalendar
        onChange={(date) => {
          setSelectedDate(date);
          if (!modalOpen) {
            openModal();
          }
        }}
        value={selectedDate}
        tileDisabled={({ date }) => isPastDate(date)}
        activeStartDate={new Date()}
      />

      {/* Add Event Button */}
      <AddEventButton onClick={() => openModal()}>Add Event</AddEventButton>

      {/* Filter by Category */}
      <FilterSelect
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
      >
        <option value="All">Filter</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Others">Others</option>
      </FilterSelect>

      {/* Display Events */}
      <EventList>
        {currentEvents.map(event => (
          <EventItem key={event.id} onClick={() => showEventDetails(event)}>
            <div>{event.title}</div>
            <EventButtons>
              <Button onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }}>Delete</Button>
              <Button onClick={(e) => { e.stopPropagation(); openModal(event); }}>Edit</Button>
            </EventButtons>
          </EventItem>
        ))}
      </EventList>

      {/* Pagination */}
      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationButton
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </PaginationButton>
        ))}
      </Pagination>

      {/* Modal for Add/Edit Event */}
      <ModalBackdrop $isOpen={modalOpen} onClick={closeModal} />
      <CustomModal $isOpen={modalOpen}>
        <h2>{editingId ? 'Edit Event' : 'Add Event'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={formEvent.title}
              onChange={(e) => setFormEvent({ ...formEvent, title: e.target.value })}
            />
            {validationErrors.title && <Error>{validationErrors.title}</Error>}
          </label>
          <label>
            Category:
            <select
              value={formEvent.category}
              onChange={(e) => setFormEvent({ ...formEvent, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Others">Others</option>
            </select>
            {validationErrors.category && <Error>{validationErrors.category}</Error>}
          </label>
          <label>
            Date:
            <input
              type="date"
              value={formEvent.date.toISOString().substring(0, 10)}
              onChange={(e) => setFormEvent({ ...formEvent, date: new Date(e.target.value) })}
            />
            {validationErrors.date && <Error>{validationErrors.date}</Error>}
          </label>
          <button type="submit">{editingId ? 'Edit' : 'Add'}</button>
        </form>
      </CustomModal>

      {/* Modal for Event Details */}
      <ModalBackdrop $isOpen={!!eventDetails} onClick={closeEventDetails} />
      <DetailsModal $isOpen={!!eventDetails}>
        <CloseButton onClick={closeEventDetails}>×</CloseButton>
        {eventDetails && (
          <>
            <h2>Event Details</h2>
            <p>Event: {eventDetails.title}</p>
            <p>Category: {eventDetails.category}</p>
            <p>Date: {eventDetails.date.toDateString()}</p>
          </>
        )}
      </DetailsModal>
    </Container>
  );
};

export default App;
