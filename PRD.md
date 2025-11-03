# Product Requirements Document
## Window Fitting Jobs - Clock In/Out System

---

## 1. Executive Summary

The **Window Fitting Jobs Clock In/Out System** is a time tracking application designed for window fitting contractors and crews to clock in and out of job sites. The application provides real-time session tracking, job location logging, and shift history for management and payroll purposes.

### Key Purpose
Enable window fitters to quickly and accurately track their working hours on glass fitting jobs, providing supervisors visibility into active sessions and completed shifts.

---

## 2. Product Overview

### 2.1 Target Users
- **Primary**: Window fitter technicians (field workers)
- **Secondary**: Job site supervisors and payroll administrators
- **Context**: On-site usage at glass fitting job locations

### 2.2 Core Value Proposition
- Quick clock in/out without complex navigation
- Real-time duration tracking of work sessions
- Location-based job assignment
- Shift history for payroll and compliance

---

## 3. Feature Specifications

### 3.1 Header Section
**Component**: Fixed header bar at top of page

**Content**:
- **Logo**: Sage Glass logo (sourced from: https://www.sageglass.com/themes/custom/sageglass/logo.svg)
- **Title**: "Window Fitting Jobs" (large, bold text in primary blue color #1a4d6d)
- **Subtitle**: "Clock In & Clock Out System" (smaller text in gray)
- **Styling**: White background with bottom border in paler green (#c8e6c9)
- **Behavior**: Sticky positioning (stays at top during scroll)

### 3.2 Time Display Section
**Component**: Centered large time display

**Features**:
- **Format**: 24-hour clock (HH:MM:SS)
- **Update Frequency**: Updates every second
- **Size**: Large, monospace font for readability
- **Color**: Primary blue (#1a4d6d)
- **Test Mode**: Can be overridden with manual test time entry

### 3.3 Main Layout Grid
**Structure**: Two-column responsive layout on desktop, stacked on mobile

**Left Column (Select Fitter)**: 50% width desktop
**Right Column (Status & History)**: 50% width desktop

---

## 4. Left Column: Fitter Selection

### 4.1 Search Input
**Component**: Text input field

**Features**:
- **Placeholder**: "Search by name or email..."
- **Functionality**: Real-time search against all users via API (server-side search)
- **Styling**: 
  - Padding: 12px 16px
  - Border: 1px solid #ddd
  - Border-radius: 6px
  - Margin-bottom: 12px
  - Focus state: Blue border with subtle shadow
- **Behavior**: Resets pagination to page 1 on new search

### 4.2 Fitter Table
**Component**: Ant Design Table

**Columns**:
| Column | Width | Content |
|--------|-------|---------|
| Name | 50% | First and last name of fitter |
| Location | 50% | Job location (city and state) |

**Features**:
- **Rows per Page**: 20
- **Scroll Height**: 600px (vertical scroll within table)
- **Pagination**: Centered below table
- **Pagination Style**: Ant Design "More" style (showing page numbers with ellipsis for larger page counts)
- **Row Interaction**:
  - **Left-click**: Selects fitter (no visual highlight)
  - **Right-click**: Opens user detail modal
- **Empty State**: "No fitters found matching your search" or "No fitters available"

**Styling**:
- **Border**: 4px solid primary blue (#1a4d6d)
- **Background**: Transparent
- **Table Header**: Blue text, blue bottom border
- **Rows**: 
  - Padding: 12px 8px
  - Border-bottom: 1px solid #eee
  - Cursor: pointer
  - Hover: Subtle background tint

**Data Source**: 
- **API Endpoint**: https://user-api.builder-io.workers.dev/api/users
- **Query Parameters**: 
  - `page`: current page number
  - `perPage`: 20
  - `search`: search query (optional)
- **Response Format**:
  ```json
  {
    "page": 1,
    "perPage": 20,
    "total": 500,
    "data": [
      {
        "uuid": "user-uuid",
        "login": { "username": "username" },
        "name": { "first": "John", "last": "Doe" },
        "email": "john@example.com",
        "location": { "city": "Boston", "state": "MA", "country": "USA" }
      }
    ]
  }
  ```

---

## 5. Right Column: Clock Controls & Status

### 5.1 Current Status Box
**Component**: Card container

**Content When Fitter Selected**:
- **Selected Fitter Name**: Bold, large text
- **Status Badge**: 
  - Green badge with "✓ Clocked In" if active session
  - Red badge with "○ Clocked Out" if no active session
- **Session Duration**: (only shown if clocked in)
  - Format: HH:MM:SS (monospace font)
  - Updates every second
- **Clock In/Out Button**:
  - Text: "▶ Clock In Now" or "🛑 Clock Out Now"
  - Background: Yellow (#ffc107)
  - Padding: 16px
  - Font: Bold, large
  - Action: 
    - Clock In: Creates new clock record with current time (or test time)
    - Clock Out: Completes active session with current time (or test time)

**Content When No Fitter Selected**:
- Message: "Select a fitter to begin"

**Styling**:
- **Background**: White
- **Border**: 1px solid rgba(0, 0, 0, 0.1)
- **Border-radius**: 8px
- **Shadow**: 0 2px 8px rgba(0, 0, 0, 0.05)
- **Padding**: 24px

### 5.2 Today's Record Box
**Component**: Card container with scrollable list

**Content When Fitter Selected**:
- **List of Clock Records**:
  - Each record shows:
    - In time: "In: HH:MM"
    - Out time (if clocked out): "Out: HH:MM"
    - Duration: "Duration: Xh Ym"
    - Location: "📍 City, State"
  - Styled with subtle borders and spacing
  - Max height: scrollable if many records

**Content When No Fitter Selected**:
- Message: "Select a fitter to view records"

**Content When No Records**:
- Message: "No clock records yet"

**Styling**:
- **Background**: White
- **Border**: 1px solid rgba(0, 0, 0, 0.1)
- **Border-radius**: 8px
- **Shadow**: 0 2px 8px rgba(0, 0, 0, 0.05)
- **Padding**: 24px

---

## 6. Below Main Grid: Active Sessions & Shift History

### 6.1 Currently Clocked In Section
**Component**: Two-column grid (responsive)

**Features**:
- **Title**: "Currently Clocked In"
- **List**: All active (non-completed) clock sessions
- **Each Item Shows**:
  - Fitter name (bold)
  - Job location (📍 emoji prefix)
  - Start time: "Started: HH:MM"
  - Real-time duration counter (updates every second)
  - "Clock Out" button (yellow, clickable)

**Empty State**: "No fitters currently clocked in"

**Styling**:
- **Background**: White
- **Border**: 2px solid primary blue (#1a4d6d)
- **Padding**: 16px
- **Margin**: 12px from bottom
- **Card Styling**: 
  - Border-radius: 8px
  - Layout: Flex with space-between for name/duration alignment

### 6.2 Completed Shifts Section
**Component**: Two-column grid (responsive, next to Currently Clocked In)

**Features**:
- **Title**: "Completed Shifts"
- **List**: All clocked-out sessions (most recent first)
- **Each Item Shows**:
  - Fitter name (bold)
  - Location (📍 emoji prefix)
  - Time range: "HH:MM - HH:MM"
  - Total duration: "⏱ Xh Ym"

**Empty State**: "No completed shifts yet"

**Styling**:
- **Background**: White
- **Border**: 1px solid #e0e0e0
- **Padding**: 12px
- **Border-radius**: 6px
- **Max height**: Scrollable if many records

---

## 7. Test Time Section (Demo Feature)

### 7.1 Test Time Box
**Component**: Card container with controls

**Features**:
- **Title**: "⚙ Test Time (for demo)"
- **Checkbox**: "Use Test Time"
- **When Enabled, Show Inputs**:
  - **Hours**: 0-23 (24-hour format)
  - **Minutes**: 0-59
  - **Seconds**: 0-59
  - Input type: number with min/max validation
  - Labels: "Hours (00-23)", "Minutes (00-59)", "Seconds (00-59)"

**Behavior**:
- When enabled, all clock in/out timestamps use the manually set time instead of current time
- Useful for testing and demonstrations
- The time display at top of page shows test time when enabled

**Styling**:
- **Background**: White
- **Border**: 1px solid rgba(0, 0, 0, 0.1)
- **Padding**: 16px
- **Border-radius**: 8px
- **Label Text**: Small, uppercase, gray color

---

## 8. User Detail Modal (Right-Click)

### 8.1 Modal Trigger
**Behavior**: Right-click on any row in the fitter table opens modal

### 8.2 Modal Content
**Component**: Centered modal overlay

**Content**:
- **Close Button**: Yellow circle button with "✕" in top-right
- **User Photo**: 
  - Source: https://thispersondoesnotexist.com/
  - Size: Full width, 300px height
  - Object-fit: cover
  - Fallback: If photo fails to load, use placeholder URL
- **Information Section**:
  - **Name**: Large, bold text in primary blue
  - **Email**: Label and value
  - **Username**: Label and value
  - **Location**: Label and value (City, State, Country)
- **Action Button**: 
  - Text: "▶ Clock In This Fitter"
  - Background: Yellow (#ffc107)
  - Full width
  - Closes modal on click and clocks in the fitter

**Styling**:
- **Modal Overlay**: Semi-transparent dark background (rgba(0, 0, 0, 0.5))
- **Modal Container**: 
  - Background: White
  - Border-radius: 12px
  - Max-width: 500px
  - Width: 90% on mobile
  - Shadow: 0 10px 40px rgba(0, 0, 0, 0.2)
- **Close Button**: Transitions on hover (rotate effect)

---

## 9. Color Palette & Design System

### 9.1 Primary Colors
| Color Name | Hex Value | Usage |
|-----------|-----------|-------|
| Primary Blue | #1a4d6d | Headers, titles, primary text, borders |
| Primary Yellow | #ffc107 | Action buttons, call-to-action elements |
| Paler Green | #c8e6c9 | Accent borders, secondary elements |
| Dark Navy | #1a3a52 | Hover states, darker text |

### 9.2 Neutral Colors
| Color Name | Hex Value | Usage |
|-----------|-----------|-------|
| White | #ffffff | Backgrounds, card surfaces |
| Light Gray | #f5f5f5 | Secondary backgrounds |
| Gray | #999999 | Secondary text, labels |
| Dark Gray | #333333 | Primary text |
| Border Gray | #ddd or #eee | Borders, dividers |

### 9.3 Status Colors
| Status | Color | Hex Value |
|--------|-------|-----------|
| Clocked In | Green | #4caf50 |
| Clocked Out | Red | #f44336 |

---

## 10. Data Model

### 10.1 User Object
```typescript
interface User {
  uuid?: string;
  login?: {
    username: string;
    password?: string;
  };
  name?: {
    first: string;
    last: string;
    title?: string;
  };
  email?: string;
  location?: {
    city: string;
    state?: string;
    country: string;
  };
}
```

### 10.2 Clock Record Object
```typescript
interface ClockRecord {
  userId: string;           // UUID or username
  userName: string;         // Full name for display
  clockInTime: number;      // Timestamp in milliseconds
  clockOutTime?: number;    // Timestamp in milliseconds (null if still clocked in)
  jobLocation?: string;     // City from user location data
}
```

---

## 11. State Management

### 11.1 React State Variables
- `users`: Array of User objects (current page data)
- `selectedUser`: Currently selected User object
- `clockRecords`: Array of ClockRecord objects (session history)
- `loading`: Boolean for initial load state
- `initialLoading`: Boolean for first-time load (not pagination)
- `error`: Error message string or null
- `currentTime`: Display time string (HH:MM:SS)
- `sessionDuration`: Duration string for selected user (HH:MM:SS)
- `modalOpen`: Boolean for modal visibility
- `modalUser`: User object in modal (with photo URL)
- `modalLoading`: Boolean for modal photo loading
- `searchQuery`: Current search input value
- `testTime`: Object with hours, minutes, seconds
- `useTestTime`: Boolean to enable test time mode
- `currentPage`: Current pagination page
- `totalUsers`: Total user count from API
- `perPage`: Items per page (constant: 20)

---

## 12. API Integration

### 12.1 Base URL
```
https://user-api.builder-io.workers.dev/api
```

### 12.2 Endpoints

#### GET /users
Fetch paginated user list with optional search

**Query Parameters**:
```
page: number (default: 1)
perPage: number (default: 20)
search?: string (optional, searches name/email)
```

**Response**:
```json
{
  "page": 1,
  "perPage": 20,
  "total": 500,
  "data": [{ User objects }]
}
```

#### GET /users/:id
Fetch single user by UUID, username, or email

**Response**:
```json
{ User object }
```

---

## 13. User Interactions & Flows

### 13.1 Clock In Flow
1. User opens application
2. Current time displays at top (updated every second)
3. User searches for their name in "Select Fitter" box
4. User clicks on their row in table (left-click to select)
5. User's name appears in "Current Status" box
6. User clicks "▶ Clock In Now" button
7. New clock record created with current (or test) time
8. Status badge changes to green "✓ Clocked In"
9. Session duration timer appears and starts counting
10. Entry appears in "Currently Clocked In" section
11. Entry also appears in "Today's Record" box

### 13.2 Clock Out Flow
1. User views "Currently Clocked In" section showing active sessions
2. User clicks "Clock Out" button on their session
3. Active session marked as complete with current (or test) time
4. Entry disappears from "Currently Clocked In" and moves to "Completed Shifts"
5. Duration is calculated and displayed
6. If user is still selected, status badge changes to red "○ Clocked Out"

### 13.3 View User Details Flow
1. User right-clicks on a fitter row in the table
2. Modal opens showing user details (name, email, username, location)
3. User photo loads from thispersondoesnotexist.com
4. User can click "Clock In This Fitter" to clock them in
5. User closes modal by clicking "✕" button or clicking outside modal

### 13.4 Search Flow
1. User types in "Search by name or email..." input
2. Search query sent to API (server-side search)
3. Table resets to page 1
4. Results update showing matching fitters
5. Pagination updates based on filtered results

### 13.5 Pagination Flow
1. User clicks page number in pagination controls
2. Table remains visible (no loading overlay)
3. New page of 20 fitters loads into table
4. Scroll position resets to top of table

### 13.6 Test Time Flow
1. User enables "Use Test Time" checkbox in Test Time box
2. Manual time inputs appear (hours, minutes, seconds)
3. User sets desired time (e.g., 14:30:00)
4. Time display at top shows the set time
5. All subsequent clock in/out actions use the test time as timestamp
6. Useful for demos and testing different scenarios

---

## 14. Technical Stack

### 14.1 Framework & Libraries
- **Framework**: Next.js 16.0.1
- **UI Library**: React 19.2.0
- **Component Library**: Ant Design (antd)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5

### 14.2 Key Packages
```json
{
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "next": "16.0.1",
  "antd": "^5.x",
  "tailwindcss": "^4"
}
```

### 14.3 External APIs
- **User Data API**: https://user-api.builder-io.workers.dev/api
- **User Photos**: https://thispersondoesnotexist.com/
- **Logo**: https://www.sageglass.com/themes/custom/sageglass/logo.svg

---

## 15. Responsive Design

### 15.1 Desktop (1024px and above)
- Two-column layout: Select Fitter | Status & Controls
- Full table width with 20 items per page
- Side-by-side sections for Currently Clocked In and Completed Shifts

### 15.2 Tablet (768px - 1023px)
- Stack columns vertically
- Table still shows 20 items per page
- Full width sections

### 15.3 Mobile (below 768px)
- Single column layout
- Full width components
- Touch-friendly button sizes
- Modal width: 90% with proper padding

---

## 16. Performance Considerations

### 16.1 Optimization Strategies
- Server-side search via API (not client-side filtering)
- Pagination to limit data in memory (20 items per page)
- Table scroll instead of loading all items
- Lazy loading of user photos in modal
- Debounced search input (optional enhancement)

### 16.2 Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No legacy browser support required

---

## 17. Accessibility

### 17.1 Requirements
- ARIA labels on interactive elements
- Keyboard navigation support (Tab, Enter)
- Color contrast meets WCAG AA standards
- Screen reader friendly
- Focus indicators on interactive elements

### 17.2 Considerations
- Test time inputs have clear labels
- Status badges have text (not just color)
- Button text is descriptive ("Clock In" vs generic "Submit")
- Modal is dismissible (close button and escape key)

---

## 18. Browser Caching & State

### 18.1 Local Storage (Optional Enhancement)
- Could store clock records locally during session
- Could remember last searched user
- Session data should clear on page reload or end of day

### 18.2 Current Implementation
- State is in-memory only
- Reloading page clears all data
- Data is not persisted to backend (future enhancement)

---

## 19. Future Enhancements

### 19.1 Potential Features
1. **Backend Persistence**: Save clock records to database
2. **User Authentication**: Login system with role-based access
3. **Reports**: Generate PDF reports of shifts by date range
4. **Notifications**: Push notifications for clock in/out reminders
5. **Location Verification**: GPS verification of job site location
6. **Multi-language**: Localization for different languages
7. **Offline Mode**: Work offline with sync when online
8. **Export**: Export shift history to CSV/Excel
9. **Analytics**: Dashboard showing hours worked, productivity metrics
10. **Mobile App**: Native iOS/Android application

---

## 20. Deployment & Hosting

### 20.1 Recommended Platforms
- **Vercel**: Native Next.js support, simple deployment
- **Netlify**: Alternative with good Next.js support
- **AWS**: For enterprise-scale deployment

### 20.2 Environment Variables
- `NEXT_PUBLIC_API_BASE`: https://user-api.builder-io.workers.dev/api
- Any future API keys or secrets should be in .env.local

---

## 21. Testing Strategy

### 21.1 Unit Tests
- Clock calculation logic
- Time formatting functions
- Search filtering logic

### 21.2 Integration Tests
- API call flows
- Clock in/out workflows
- Search and pagination

### 21.3 E2E Tests
- Complete user flows
- Modal interactions
- Time display updates

---

## 22. Known Limitations

1. **No Backend Persistence**: Clock records lost on page refresh
2. **No Authentication**: All users accessible to all fitters
3. **No Location Verification**: Job location is from user profile only
4. **No Offline Support**: Requires internet connection
5. **Manual Photo Loading**: Uses external service, not user uploads
6. **No Role-Based Access**: No supervisor vs fitter distinction

---

## 23. Success Metrics

- Page load time < 2 seconds
- Clock in/out response time < 500ms
- Search results return within 1 second
- 99% uptime
- User satisfaction score > 4.5/5
- Zero data loss incidents

---

## 24. Support & Documentation

### 24.1 User Documentation
- Quick start guide
- FAQ for common issues
- Video tutorials (optional)

### 24.2 Developer Documentation
- API documentation
- Setup instructions
- Code comments and JSDoc
- Architecture overview

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Ready for Implementation
