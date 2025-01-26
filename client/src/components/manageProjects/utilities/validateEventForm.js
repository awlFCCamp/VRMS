import { isWordInArrayInString } from './../../../utils/stringUtils.js';

const validateEventForm = (vals, projectToEdit) => {
  let newErrors = {};
  Object.keys(vals).forEach((key) => {
    switch (key) {
      case 'name':
        // Required
        if (!vals[key]) {
          newErrors = { ...newErrors, name: 'Event name is required' };
        } else if (
          isWordInArrayInString(['meeting', 'mtg'], vals[key].toLowerCase())
        ) {
          newErrors = {
            ...newErrors,
            name: "Event name cannot contain 'meeting' or 'mtg'",
          };
        } else if (
          isWordInArrayInString(
            [projectToEdit.name.toLowerCase()],
            vals[key].toLowerCase()
          )
        ) {
          if (projectToEdit.name.toLowerCase() === 'onboarding') {
            // Do nothing, word `onboarding` has been white-listed
          } else {
            newErrors = {
              ...newErrors,
              name: `Event name cannot contain the Project Name: '${projectToEdit.name}'`,
            };
          }
        }
        break;

      case 'videoConferenceLink':
        // Required
        if (!vals[key]) {
          newErrors = {
            ...newErrors,
            videoConferenceLink: 'Event link is required',
          };
        }
        if (!validateLink(vals[key])) {
          newErrors = {
            ...newErrors,
            videoConferenceLink: 'Invalid link',
          };
        }
        break;

      default:
        break;
    }
  });
  return Object.keys(newErrors).length ? newErrors : null;
};

export default validateEventForm;

function validateLink(url) {
  const ZoomMeetRegex =
    /^(?:https:\/\/)?(?:www\.)?(?:[a-z0-9-]+\.)?zoom\.us\/j\/[0-9]+(\?pwd=[a-zA-Z0-9]+)?$/;
  const GoogleMeetRegex =
    /^(?:https:\/\/)?(?:[a-z0-9-]+\.)?meet\.google\.com\/[a-zA-Z0-9-]+$/;
  return ZoomMeetRegex.test(url) || GoogleMeetRegex.test(url);
}
