const { generateEventData } = require('./lib/generateEventData');

/**
 * Utility to fetch data from an API endpoint.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {string} URL - The base URL for API requests.
 * @param {string} headerToSend - Custom request header.
 * @returns {Promise<Array>} - Resolves to the fetched data or an empty array on failure.
 */
const fetchData = async (endpoint, URL, headerToSend, fetch) => {
  try {
    const res = await fetch(`${URL}${endpoint}`, {
      headers: { 'x-customrequired-header': headerToSend },
    });
    if (!res.ok) throw new Error(`Failed to fetch: ${endpoint}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

/**
 * Checks if two dates are on the same day in UTC.
 * @param {Date} eventDate - Event date.
 * @param {Date} todayDate - Today's data.
 * @returns {boolean} - True if both dates are on the same UTC day.
 */
const isSameUTCDate = (eventDate, todayDate) => {
  return (
    eventDate.getUTCFullYear() === todayDate.getUTCFullYear() &&
    eventDate.getUTCMonth() === todayDate.getUTCMonth() &&
    eventDate.getUTCDate() === todayDate.getUTCDate()
  );
};

/**
 * Checks if an event with the given name already exists for today's date.
 * @param {string} recurringEventName - The name of the recurring event to check.
 * @param {Date} today - Today's date in UTC.
 * @returns {boolean} - True if the event exists, false otherwise.
 */
const doesEventExist = (recurringEventName, today, events) =>
  events.some((event) => {
    const eventDate = new Date(event.date);
    return isSameUTCDate(eventDate, today) && event.name === recurringEventName;
  });

/**
 * Creates a new event by making a POST request to the events API.
 * @param {Object} event - The event data to create.
 * @returns {Promise<Object|null>} - The created event data or null on failure.
 */
const createEvent = async (event, URL, headerToSend, fetch) => {
  if (!event) return null;

  try {
    const res = await fetch(`${URL}/api/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-customrequired-header': headerToSend,
      },
      body: JSON.stringify(event),
    });
    if (!res.ok) throw new Error('Failed to create event');
    return await res.json();
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
};

/**
 * Filters recurring events happening today and creates new events if they do not already exist.
 * Accounts for DST offsets.
 */
const filterAndCreateEvents = async (events, recurringEvents, URL, headerToSend, fetch) => {
  const today = new Date();
  const todayUTCDay = today.getUTCDay();

  const eventsToCreate = recurringEvents.filter((recurringEvent) => {
    const localEventDate = adjustToLocalTime(new Date(recurringEvent.date));
    return (
      localEventDate.getUTCDay() === todayUTCDay &&
      !doesEventExist(recurringEvent.name, today, events)
    );
  });

  for (const event of eventsToCreate) {
    const eventToCreate = generateEventData(event);
    const createdEvent = await createEvent(eventToCreate, URL, headerToSend, fetch);
    if (createdEvent) console.log('Created event:', createdEvent);
  }
};

/**
 * Adjusts an event date to local time, accounting for DST offsets.
 * @param {Date} eventDate - The event date to adjust.
 * @returns {Date} - The adjusted event date.
 */
// const adjustToLocalTime = (eventDate) => {
//   const localEventDate = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000);
//   return localEventDate;
// };
const adjustToLocalTime = (eventDate) => {
  const tempDate = new Date(eventDate);
  const offsetAtThatTime = tempDate.getTimezoneOffset();
  const localEventDate = new Date(eventDate.getTime() - offsetAtThatTime * 60000);
  return localEventDate;
};

/**
 * Executes the full task of fetching events, filtering recurring events, and creating new events.
 */
const runTask = async (fetch, URL, headerToSend) => {
  console.log("Creating today's events...");
  const [events, recurringEvents] = await Promise.all([
    fetchData('/api/events/', URL, headerToSend, fetch),
    fetchData('/api/recurringevents/', URL, headerToSend, fetch),
  ]);
  console.log('events,', events);
  console.log('recurringEvents,', recurringEvents);
  await filterAndCreateEvents(events, recurringEvents, URL, headerToSend, fetch);
  console.log("Today's events have been created.");
};

/**
 * Schedules the runTask function to execute every 30 minutes.
 */
const scheduleTask = (cron, fetch, URL, headerToSend) => {
  return cron.schedule('*/30 * * * *', () => {
    runTask(fetch, URL, headerToSend).catch((error) => console.error('Error running task:', error));
  });
};

/**
 * Wrapper function to initialize the worker with dependencies in app.js
 */
const createRecurringEvents = (cron, fetch) => {
  const URL =
    process.env.NODE_ENV === 'prod'
      ? 'https://www.vrms.io'
      : `http://localhost:${process.env.BACKEND_PORT}`;
  const headerToSend = process.env.CUSTOM_REQUEST_HEADER;

  return scheduleTask(cron, fetch, URL, headerToSend);
};

module.exports = {
  fetchData,
  isSameUTCDate,
  doesEventExist,
  createEvent,
  filterAndCreateEvents,
  runTask,
  scheduleTask,
};
