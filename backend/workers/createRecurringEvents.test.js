const { runTask } = require('./createRecurringEventsV3');
const MockDate = require('mockdate');

jest.mock('./createRecurringEventsV3', () => ({
  runTask: jest.fn(),
}));

describe('Daylight Savings Time Transition Test', () => {
  /**
   * Tests the behavior during the Daylight Saving Time transition,
   * ensuring the system handles the hour shift correctly.
   */
  test('Handles the DST transition day correctly - event already exists', async () => {
    MockDate.set('2025-03-09T01:00:00Z'); // March 9, 1:00 AM UTC

    const mockEvents = [
      { name: 'Existing Event', date: '2025-03-09T10:00:00Z' }, // March 9, 10:00 AM UTC
    ];
    const mockRecurringEvents = [
      { name: 'Recurring Event', date: '2025-03-09T10:00:00Z' }, // March 9, 10:00 AM UTC
    ];

    runTask.mockImplementationOnce(() => {
      if (mockEvents.some((event) => event.date === mockRecurringEvents[0].date)) {
        return [];
      }
      return mockRecurringEvents;
    });

    const result = await runTask();

    const expectedOutput = [];
    console.log('Expected Output:', expectedOutput);
    console.log('Generated Output:', result);

    expect(runTask).toHaveBeenCalled();
    expect(result).toEqual(expectedOutput);

    MockDate.reset();
  });

  test('Handles the DST transition day correctly - new event created', async () => {
    MockDate.set('2025-03-09T01:00:00Z'); // March 9, 1:00 AM UTC

    const mockEvents = [];
    const mockRecurringEvents = [
      { name: 'Recurring Event', date: '2025-03-09T10:00:00Z' }, // March 9, 10:00 AM UTC
    ];

    runTask.mockImplementationOnce(() => {
      if (mockEvents.some((event) => event.date === mockRecurringEvents[0].date)) {
        return [];
      }
      return mockRecurringEvents;
    });

    const result = await runTask();

    const expectedOutput = mockRecurringEvents;
    console.log('Expected Output:', expectedOutput);
    console.log('Generated Output:', result);

    expect(runTask).toHaveBeenCalled();
    expect(result).toEqual(expectedOutput);

    MockDate.reset();
  });
});
