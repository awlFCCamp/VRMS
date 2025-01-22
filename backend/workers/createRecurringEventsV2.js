// V2 with UTC fix
const { generateEventData } = require('./lib/generateEventData');

module.exports = (cron, fetch) => {
  /**
   * Check to see if any recurring events are happening today,
   * and if so, check to see if an event has already been created
   * for it. If not, create one.
   */

  let EVENTS;
  let RECURRING_EVENTS;
  let TODAY_DATE;
  let TODAY;
  const URL =
    process.env.NODE_ENV === 'prod'
      ? 'https://www.vrms.io'
      : `http://localhost:${process.env.BACKEND_PORT}`;

  const headerToSend = process.env.CUSTOM_REQUEST_HEADER;

  /**
   * Fetches all events from the events API.
   * Input: None
   * Output: Updates global EVENTS variable with an array of event objects.
   */
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${URL}/api/events/`, {
        headers: {
          'x-customrequired-header': headerToSend,
        },
      });
      EVENTS = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Fetches all recurring events from the recurring events API.
   * Input: None
   * Output: Updates global RECURRING_EVENTS variable with an array of recurring event objects.
   */
  const fetchRecurringEvents = async () => {
    try {
      const res = await fetch(`${URL}/api/recurringevents/`, {
        headers: {
          'x-customrequired-header': headerToSend,
        },
      });
      RECURRING_EVENTS = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Filters recurring events happening today and creates new events if they do not already exist.
   * Input: None (Uses global variables for recurring events and today's date)
   * Output: Creates new events by calling the `createEvent` method.
   */
  async function filterAndCreateEvents() {
    TODAY_DATE = new Date();
    TODAY = TODAY_DATE.getDay();
    console.log('Date: ', TODAY_DATE, 'Day: ', TODAY);
    const recurringEvents = RECURRING_EVENTS;

    // Filter recurring events where the event date is today
    if (recurringEvents && recurringEvents.length > 0) {
      const filteredEvents = recurringEvents.filter((event) => {
        const eventDate = new Date(event.date);
        const eventDay = eventDate.getUTCDay(); // use UTC to address timezone issues
        const todayDay = TODAY_DATE.getUTCDay();
        return eventDay === todayDay;
      });
      /** For each recurring event, check to see if an event already
       * exists for it and do something if true/false. Can't use
       * forEach function with async/await.
       */
      for (let filteredEvent of filteredEvents) {
        const eventExists = await checkIfEventExists(filteredEvent.name);

        if (eventExists) {
          // Do nothing
          console.log('Not going to run ceateEvent');
        } else {
          // Create new event
          const eventToCreate = generateEventData(filteredEvent);
          const created = await createEvent(eventToCreate);
          console.log('Created event: ', created);
        }
      }
    }
  }

  /**
   * Checks if an event with the given name already exists for today's date.
   * Input: eventName (String) - The name of the event to check.
   * Output: Boolean - Returns true if the event exists, false otherwise.
   */
  async function checkIfEventExists(eventName) {
    const events = EVENTS;

    if (events && events.length > 0) {
      const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getUTCFullYear() === TODAY_DATE.getUTCFullYear() &&
          eventDate.getUTCMonth() === TODAY_DATE.getUTCMonth() &&
          eventDate.getUTCDate() === TODAY_DATE.getUTCDate() &&
          eventName === event.name
        );
      });
      console.log('Events already created: ', filteredEvents);
      return filteredEvents.length > 0 ? true : false;
    }
  }

  /**
   * Creates a new event by making a POST request to the events API.
   * Input: event (Object) - The event data to create.
   * Output: Object - The created event data returned from the API.
   */
  const createEvent = async (event) => {
    if (event) {
      const jsonEvent = JSON.stringify(event);
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-customrequired-header': headerToSend,
        },
        body: jsonEvent,
      };

      console.log('Running createEvent: ', jsonEvent);

      try {
        const response = await fetch(`${URL}/api/events/`, options);
        const resJson = await response.json();
        return resJson;
      } catch (error) {
        console.log(error);
      }
    }
  };

  /**
   * Executes the full task of fetching events, filtering recurring events, and creating new events.
   * Output: Logs progress and completion of event creation task.
   */
  async function runTask() {
    console.log("Creating today's events");

    await fetchEvents();
    await fetchRecurringEvents();
    await filterAndCreateEvents();

    console.log("Today's events are created");
  }

  const scheduledTask = cron.schedule('*/30 * * * *', () => {
    runTask();
  });
  return scheduledTask;
};
