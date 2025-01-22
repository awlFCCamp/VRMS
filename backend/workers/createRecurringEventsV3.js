const { generateEventData } = require('./lib/generateEventData');

module.exports = (cron, fetch) => {
  /**
   * Check to see if any recurring events are happening today,
   * and if so, check to see if an event has already been created
   * for it. If not, create one.
   */

  const EVENTS = [];
  const RECURRING_EVENTS = [];
  const URL =
    process.env.NODE_ENV === 'prod'
      ? 'https://www.vrms.io'
      : `http://localhost:${process.env.BACKEND_PORT}`;

  const headerToSend = process.env.CUSTOM_REQUEST_HEADER;

  /**
   * Utility to fetch data from an API endpoint.
   * @param {string} endpoint - The API endpoint to fetch data from.
   * @returns {Promise<Array>} - Resolves to the fetched data or an empty array on failure.
   */
  const fetchData = async (endpoint) => {
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
   * Fetches all events and recurring events and updates global variables.
   * Output: Updates EVENTS and RECURRING_EVENTS variables.
   */
  const fetchAllData = async () => {
    [EVENTS, RECURRING_EVENTS] = await Promise.all([
      fetchData('/api/events/'),
      fetchData('/api/recurringevents/'),
    ]);
  };

  /**
   * Checks if two dates are on the same day in UTC.
   * @param {Date} eventDate - Event date.
   * @param {Date} todayDate - Today's data.
   * @returns {boolean} - True if both dates are on the same UTC day.
   */
  const isSameUTCDate = (eventDate, todayDate) =>
    eventDate.getUTCFullYear() === todayDate.getUTCFullYear() &&
    eventDate.getUTCMonth() === todayDate.getUTCMonth() &&
    eventDate.getUTCDate() === todayDate.getUTCDate();

  /**
   * Checks if an event with the given name already exists for today's date.
   * @param {string} eventName - The name of the event to check.
   * @param {Date} today - Today's date in UTC.
   * @returns {boolean} - True if the event exists, false otherwise.
   */
  const doesEventExist = (eventName, today) => {
    return EVENTS.some((event) => {
      const eventDate = new Date(event.date);
      return isSameUTCDate(eventDate, today) && event.name === eventName;
    });
  };

  /**
   * Creates a new event by making a POST request to the events API.
   * @param {Object} event - The event data to create.
   * @returns {Promise<Object|null>} - The created event data or null on failure.
   */
  const createEvent = async (event) => {
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
   * Input: None
   * Output: Creates new events by calling the `createEvent` method.
   */
  const filterAndCreateEvents = async () => {
    const today = new Date(); // UTC date
    const todayDay = today.getUTCDay();

    const eventsToCreate = RECURRING_EVENTS.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getUTCDay() === todayDay && !doesEventExist(event.name, today);
    });

    for (const event of eventsToCreate) {
      const eventToCreate = generateEventData(event);
      const createdEvent = await createEvent(eventToCreate);
      if (createdEvent) console.log('Created event:', createdEvent);
    }
  };

  /**
   * Executes the full task of fetching events, filtering recurring events, and creating new events.
   * Output: Logs progress and completion of event creation task.
   */
  const runTask = async () => {
    console.log("Creating today's events...");
    await fetchAllData();
    await filterAndCreateEvents();
    console.log("Today's events have been created.");
  };

  /**
   * Schedules the runTask function to execute every 30 minutes.
   * Input: None
   * Output: Returns a cron job instance.
   */
  const scheduledTask = cron.schedule('*/30 * * * *', () => {
    runTask().catch((error) => console.error('Error running task:', error));
  });

  return scheduledTask;
};
