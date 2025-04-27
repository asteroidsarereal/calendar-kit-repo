# Calendar App Bug Reproduction Demo

This repository contains a minimal reproducible example of calendar rendering bugs in a React Native Expo application. It demonstrates specific issues with the calendar component that need to be fixed.

## Project Overview

This project is a mobile calendar application built with:

- [Expo](https://expo.dev/) (v52)
- [React Native](https://reactnative.dev/) (v0.76.9)
- [@fowusu/calendar-kit](https://www.npmjs.com/package/@fowusu/calendar-kit) for calendar functionality
- [Expo router](https://docs.expo.dev/versions/latest/sdk/router/) for tab-based navigation

The application displays a calendar that shows people who are on leave for particular dates. Leave periods are visually indicated on the calendar with special markers, allowing users to quickly see which team members are away on specific days.

## Setup Instructions

### Prerequisites

- Node.js (18.x or higher recommended)
- npm or yarn
- iOS Simulator or Android Emulator (for mobile testing)
- Expo Go app (optional, for testing on physical devices)

### Installation

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd calendar
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:

   ```bash
   yarn run ios
   # or
   yarn run android
   ```

## Steps to Reproduce the Bug 1

1. Launch the application
2. Navigate to the calendar tab
3. Scroll between months in quick succession
4. Observe the rendering issues with date cells

## Steps to Reproduce the Bug 2

1. Scroll between months (particularly from May to June or December to January)
2. Use the calendar button by the header left to navigate to the current month
3. Observe that only the month header changes and the calendar month can only be changed by swiping

## Technical Details

The main components involved in the bug are:

- `components/Day.tsx` - Handles individual day rendering
- `components/calendar-day-cell.tsx` - Manages the calendar cell UI
- `components/reset-today-button.tsx` - Manages the reset to today UI
- `app/(tabs)/explore.tsx` - Contains the main calendar view

## Additional Notes

This is a minimal reproduction - the codebase has been simplified to focus specifically on demonstrating the bugs without unnecessary complexity.

## License

This project is provided as-is for bug reproduction purposes.
