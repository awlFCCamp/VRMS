const {
  fetchData,
  isSameUTCDate,
  doesEventExist,
  createEvent,
  filterAndCreateEvents,
  runTask,
  scheduleTask,
} = require('./createRecurringEventsV4');
const MockDate = require('mockdate');
const cron = require('node-cron');

jest.mock('./lib/generateEventData', () => ({
  generateEventData: jest.fn((event) => ({
    ...event,
    generated: true,
  })),
}));

jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');

describe('createRecurringEvents Module Tests', () => {
  const mockURL = 'http://localhost:3000';
  const mockHeader = 'mock-header';
  let mockEvents;
  let mockRecurringEvents;

  beforeEach(() => {
    MockDate.set('2023-11-02T00:00:00Z');

    mockEvents = [
      { name: 'Event 1', date: '2023-11-02T19:00:00Z' },
      { name: 'Event 2', date: '2023-11-02T07:00:00Z' },
    ];
    mockRecurringEvents = [
      { name: 'Event 1', date: '2023-11-02T19:00:00Z' },
      { name: 'Event 2', date: '2023-11-02T07:00:00Z' },
      { name: 'Event 3', date: '2023-11-03T07:00:00Z' }, // Does not match today
    ];

    jest.clearAllMocks();
  });
  fetch.mockClear();

  afterEach(() => {
    jest.clearAllMocks();
    MockDate.reset();
  });

  describe('fetchData', () => {
    it('should fetch data from the API endpoint', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockEvents),
      });

      const result = await fetchData('/api/events/', mockURL, mockHeader, fetch);

      expect(fetch).toHaveBeenCalledWith(`${mockURL}/api/events/`, {
        headers: { 'x-customrequired-header': mockHeader },
      });
      expect(result).toEqual(mockEvents);
    });

    it('should handle API fetch failures', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchData('/api/events/', mockURL, mockHeader, fetch);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('isSameUTCDate', () => {
    it('should return true for the same UTC day', () => {
      const date1 = new Date('2023-11-02T19:00:00Z');
      const date2 = new Date('2023-11-02T10:00:00Z');
      expect(isSameUTCDate(date1, date2)).toBe(true);
    });

    it('should return false for different UTC days', () => {
      const date1 = new Date('2023-11-02T19:00:00Z');
      const date2 = new Date('2023-11-03T10:00:00Z');
      expect(isSameUTCDate(date1, date2)).toBe(false);
    });
  });

  describe('doesEventExist', () => {
    it('should return true if an event exists on the same UTC day', () => {
      const today = new Date('2023-11-02T00:00:00Z');
      expect(doesEventExist('Event 1', today, mockEvents)).toBe(true);
    });

    it('should return false if no event exists on the same UTC day', () => {
      const today = new Date('2023-11-03T00:00:00Z');
      expect(doesEventExist('Event 1', today, mockEvents)).toBe(false);
    });
  });

  describe('filterAndCreateEvents', () => {
    it('should not create events already present for today', async () => {
      await filterAndCreateEvents(mockEvents, mockRecurringEvents, mockURL, mockHeader, fetch);

      const { generateEventData } = require('./lib/generateEventData');

      expect(generateEventData).not.toHaveBeenCalledWith(mockRecurringEvents[0]); // Recurring Event 1
      expect(generateEventData).not.toHaveBeenCalledWith(mockRecurringEvents[1]); // Recurring Event 2

      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle daylight saving time transitions correctly', async () => {
      // Mock the date to simulate being in PST on Nov 4, 2023, before DST ends
      MockDate.set('2023-11-04T23:59:00Z'); // Just before DST ends (PST)

      const dstMockRecurringEvents = [
        { name: 'DST Event', date: '2023-11-05T02:00:00Z' }, // 2 AM UTC (Nov 4, 6 PM PST)
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([{ id: 2, name: 'DST Event' }]),
      });

      await filterAndCreateEvents([], dstMockRecurringEvents, mockURL, mockHeader, fetch);

      const { generateEventData } = require('./lib/generateEventData');

      expect(generateEventData).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'DST Event' }),
      );

      expect(fetch).toHaveBeenCalledWith(
        `${mockURL}/api/events/`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-customrequired-header': mockHeader,
          },
          body: JSON.stringify({
            name: 'DST Event',
            date: '2023-11-05T02:00:00Z',
            generated: true,
          }),
        }),
      );

      MockDate.reset();
    });

    it('should correctly adjust timestamps created before a daylight savings transition', async () => {
      // Simulate a timestamp from March (before DST starts)
      MockDate.set('2024-03-10T07:00:00Z'); // This is before DST shift in the US

      const dstMockRecurringEvents = [
        { name: 'DST Event', date: '2024-03-10T19:00:00Z' }, // 7 PM GMT, should map to 7 PM PST (-8)
      ];

      // Reset mock date to current time after DST transition (November)
      MockDate.set('2024-11-10T07:00:00Z'); // After DST shift (PST -7)

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]), // No existing events
      });

      await filterAndCreateEvents([], dstMockRecurringEvents, mockURL, mockHeader, fetch);

      const { generateEventData } = require('./lib/generateEventData');

      expect(generateEventData).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'DST Event' }),
      );

      expect(fetch).toHaveBeenCalledWith(`${mockURL}/api/events/`, {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        //   'x-customrequired-header': mockHeader,
        // },
        body: JSON.stringify({
          name: 'DST Event',
          date: '2024-11-10T19:00:00Z', // Should match the correct hour in new DST period
          generated: true,
        }),
      }),
        MockDate.reset();
    });
  });

  describe('runTask', () => {
    it('should fetch data but not create events if all exist', async () => {
      // First API call response (events)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockEvents),
      });

      // Second API call response (recurring events)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockRecurringEvents),
      });

      await runTask(fetch, mockURL, mockHeader);

      console.log('Actual fetch calls:', fetch.mock.calls);
      // Expect only 2 fetch calls (no event creation needed)
      expect(fetch).toHaveBeenCalledTimes(2);

      expect(fetch).toHaveBeenCalledWith(
        `${mockURL}/api/recurringevents/`,
        expect.objectContaining({ headers: { 'x-customrequired-header': mockHeader } }),
      );

      // Ensure no call to createEvent
      expect(fetch).not.toHaveBeenCalledWith(
        `${mockURL}/api/events/`,
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  describe('createEvent', () => {
    it('should create a new event via POST request', async () => {
      const mockEvent = { name: 'Event 1', date: '2023-11-02T19:00:00Z' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 1, ...mockEvent }),
      });

      const result = await createEvent(mockEvent, mockURL, mockHeader, fetch);

      expect(fetch).toHaveBeenCalledWith(`${mockURL}/api/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-customrequired-header': mockHeader,
        },
        body: JSON.stringify(mockEvent),
      });
      expect(result).toEqual({ id: 1, ...mockEvent });
    });

    it('should return null if event creation fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await createEvent(null, mockURL, mockHeader, fetch);

      expect(result).toBeNull();
    });
  });

  describe('scheduleTask', () => {
    it('should schedule the runTask function', () => {
      const scheduleSpy = jest.spyOn(cron, 'schedule').mockImplementation((_, callback) => {
        callback();
      });

      scheduleTask(cron, fetch, mockURL, mockHeader);

      expect(scheduleSpy).toHaveBeenCalledWith('*/30 * * * *', expect.any(Function));

      scheduleSpy.mockRestore();
    });
  });
});
