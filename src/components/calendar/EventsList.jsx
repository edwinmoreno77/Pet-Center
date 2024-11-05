import PropTypes from "prop-types";

export const EventsList = ({
  events,
  selectedDayKey,
  handleEditEvent,
  handleDeleteEvent,
}) => {
  return (
    <ul className="mb-2">
      {events[selectedDayKey] && events[selectedDayKey].length > 0 ? (
        events[selectedDayKey].map((event) => (
          <li
            key={event.id}
            className="p-2 mb-2 bg-gray-100 rounded shadow-sm flex justify-between items-center text-black"
          >
            <span className="text-gray-600 text-sm md:text-base font-serif">
              {event.description}
            </span>
            <div>
              <button
                onClick={() => handleEditEvent(event.id)}
                className="mr-2 p-1 transition duration-200 ease-in-out hover:scale-125 rounded-full text-white shadow-sm shadow-gray-400 hover:bg-lime-500"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="p-1 transition duration-200 ease-in-out hover:scale-125 rounded-full text-white shadow-sm shadow-gray-400 hover:bg-red-700"
              >
                🗑️
              </button>
            </div>
          </li>
        ))
      ) : (
        <li className="text-gray-500">No hay eventos para este día.</li>
      )}
    </ul>
  );
};

EventsList.propTypes = {
  events: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        description: PropTypes.string.isRequired,
      })
    )
  ).isRequired,
  selectedDayKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  handleEditEvent: PropTypes.func.isRequired,
  handleDeleteEvent: PropTypes.func.isRequired,
};
