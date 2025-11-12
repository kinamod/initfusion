# Product Requirements Document: Parkopedia Car Tracking & Enforcement System

## 1. Product Overview

**Product Name:** Parkopedia Car Tracking & Enforcement System  
**Platform:** Web Application  
**Route:** `/parkcar2`  
**Status:** Active Development  
**Brand:** Parkopedia

### 1.1 Purpose
The Parkopedia Car Tracking & Enforcement System is a specialized application designed to track vehicles entering and exiting parking zones, manage ticket purchases, and identify unpaid parking violations in real-time. This system enables parking enforcement officers and administrators to monitor parking compliance and manage revenue collection efficiently.

### 1.2 Target Users
- Parking enforcement administrators
- Zone managers
- Revenue collectors
- Compliance officers

---

## 2. Brand Identity

### 2.1 Visual Branding
- **Primary Brand Color:** `#0A0944` (Dark Navy)
- **Accent/Contrast Color:** `#02FF7F` (Neon Green)
- **Logo:** Parkopedia logo from https://www.parkopedia.com/public/images/header-logo-new@2x.png
- **Typography:** Standard system fonts
- **Header Style:** Dark navy gradient background with neon green accents

### 2.2 Branding Requirements
- All primary buttons must use the primary brand color (#0A0944)
- Interactive elements and highlights must use the accent color (#02FF7F)
- Header navigation bar must display Parkopedia branding
- All cards and sections should maintain visual consistency with the color scheme

---

## 3. Core Features

### 3.1 Vehicle Entry Management
**Description:** Users can add and track vehicles entering parking zones.

**Functionality:**
- Add random vehicle entries (demo functionality)
- Record license plate, zone assignment, and entry time
- Display vehicle status (in-zone or exited)
- Real-time update of vehicle counts per zone

**Acceptance Criteria:**
- ✅ Users can add new vehicle entries via "Add Random Car Entry" button
- ✅ Each entry includes license plate, zone, and timestamp
- ✅ Vehicle count per zone updates in real-time
- ✅ Entries are persisted to the database

### 3.2 Zone Management
**Description:** Display and organize vehicles by parking zones with tabular views.

**Functionality:**
- Display all parking zones in a 3-column grid layout
- Show vehicle count per zone (active vehicles)
- Group vehicles into "In Zone" and "Left" sections
- Zone-specific tariff information

**Acceptance Criteria:**
- ✅ Zones display in a responsive 3-column grid
- ✅ Each zone card shows active vehicle count
- ✅ "In Zone" section shows currently parked vehicles
- ✅ "Left" section shows recently exited vehicles
- ✅ Zone color indicators are visually distinct

### 3.3 Ticket Management
**Description:** Track and manage parking ticket purchases for vehicles.

**Functionality:**
- Display ticket status for each vehicle (Valid Ticket, Expired, Expiring Soon, No Ticket)
- Visual indicators (colored dots) for status
- Edit tariff information per zone
- Support multiple tariff tiers (1 hour, 2 hours, 6 hours, 12 hours, 24 hours)

**Acceptance Criteria:**
- ✅ Ticket status displays correctly for each vehicle
- ✅ Status colors: Green (Valid), Yellow (Expiring Soon), Red (Expired/No Ticket)
- ✅ Modal dialog for editing tariffs
- ✅ Tariff changes persist to database
- ✅ Price display in GBP (£)

### 3.4 Exit Management
**Description:** Record vehicle exits from parking zones.

**Functionality:**
- Exit button for each in-zone vehicle
- Automatic timestamp recording
- Update vehicle status to "Left"
- Track parking duration

**Acceptance Criteria:**
- ✅ Exit button available for each in-zone vehicle
- ✅ Click triggers vehicle exit with current timestamp
- ✅ Vehicle moves to "Left" section after exit
- ✅ Duration calculated and displayed in historical records

### 3.5 Parking Violations & PCN Management
**Description:** Track and identify vehicles with parking violations (Penalty Charge Notices).

**Functionality:**
- PCN flag for vehicles without valid tickets
- Visual indicator (red "PCN" badge)
- Violation status in historical records table
- Integration with exit/ticket status

**Acceptance Criteria:**
- ✅ PCN badge displays for vehicles without tickets
- ✅ PCN status visible in zone tables
- ✅ PCN flag included in historical records
- ✅ Violations identified automatically on vehicle exit

### 3.6 Historical Records & Analytics
**Description:** Comprehensive view of all exited vehicles with detailed tracking information.

**Functionality:**
- Table displaying all vehicles that have left zones
- Columns: License Plate, Zone, Entry Time, Exit Time, Duration, Status, Actions
- Filter and sort capabilities
- Delete functionality for records management

**Acceptance Criteria:**
- ✅ Table displays all historical vehicle records
- ✅ All required columns present and populated
- ✅ Time format: HH:MM (24-hour UK format)
- ✅ Duration displays in human-readable format (minutes/hours)
- ✅ Status badges with appropriate colors
- ✅ Delete button available for each record

### 3.7 Simulation Mode
**Description:** Demo functionality to simulate vehicle activity for testing.

**Functionality:**
- Toggle simulation on/off via header switch
- Automatic vehicle entry generation (90% probability per cycle)
- Automatic ticket purchase simulation (65% probability)
- Automatic vehicle exit simulation (70% probability)
- Simulation cycle: 1 second = 10 simulated minutes

**Acceptance Criteria:**
- ✅ Simulation toggle in header
- ✅ Vehicles generated at specified rates
- ✅ Realistic ticket purchase behavior
- ✅ Exit events generate with appropriate probability
- ✅ All simulated data persists to database

---

## 4. User Interface Components

### 4.1 Header/Navigation
- Parkopedia logo (left-aligned)
- Simulation toggle switch (right-aligned with label)
- Documentation link
- Support link
- Brand color: #0A0944 background with white text

### 4.2 Control Panel
- "Demo Controls" section with gray background
- "Add Random Car Entry" button (brand color background)
- Help text explaining functionality

### 4.3 Zone Cards
- Header: Zone name, color indicator, active vehicle count
- Body: Two tables (In Zone, Left)
- Tables: License Plate, Status, Exit/Delete buttons
- Color-coded rows based on payment status

### 4.4 Tariff Modal
- Modal dialog for editing zone tariffs
- Input fields for each tariff tier price
- Cancel and Save buttons
- Centered overlay with semi-transparent background

### 4.5 Historical Records Table
- Full-width table with horizontal scroll
- Headers: License Plate, Zone, Entry Time, Exit Time, Duration, Status, Actions
- Color-coded status badges
- Delete action per record

---

## 5. Technical Specifications

### 5.1 Technology Stack
- **Framework:** React (Next.js)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with inline styles for Parkopedia colors
- **API:** RESTful endpoints (/api/cars, /api/zones)
- **State Management:** React hooks (useState, useRef, useEffect)

### 5.2 API Endpoints
- `GET /api/zones` - Fetch all parking zones
- `GET /api/cars` - Fetch all vehicle records
- `POST /api/cars` - Create new vehicle entry
- `PUT /api/cars` - Update vehicle record (exit, ticket, PCN status)
- `DELETE /api/cars` - Delete vehicle record

### 5.3 Data Models

#### Zone Model
```typescript
interface Zone {
  id: string;
  name: string;
  coordinates: Array<{ lat: number; lng: number }>;
  color: string;
  tariffs?: Array<{ duration: string; price: number }>;
}
```

#### Car Model
```typescript
interface Car {
  id: string;
  licensePlate: string;
  zoneId: string;
  entryTime: string;
  exitTime: string | null;
  ticketBoughtTime: string | null;
  ticketDuration: number | null;
  ticketPrice: number | null;
  hasPCN?: boolean;
}
```

### 5.4 Component Structure
- Main page component: `app/parkcar2/page.tsx`
- Shared Header component: `app/components/Header.tsx` (configured with Parkopedia props)
- Helper functions for status determination and formatting

---

## 6. Color & Styling Standards

### 6.1 Color Palette
| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| Primary Brand | Navy | #0A0944 | Header, primary buttons, selected states |
| Accent | Neon Green | #02FF7F | Interactive elements, highlights, borders |
| Success | Green | #10B981 | Valid tickets, paid status |
| Warning | Yellow | #F59E0B | Expiring soon status |
| Error | Red | #EF4444 | Expired tickets, unpaid violations |
| Neutral | Gray | #6B7280 | Secondary text, disabled states |
| Background | White | #FFFFFF | Cards, modals, main content |

### 6.2 Typography
- Headings: 600-700 weight, dark gray (#111827)
- Body text: 400 weight, gray (#6B7280)
- Small text: 400 weight, light gray (#9CA3AF)
- Monospace: License plates and technical data

### 6.3 Spacing & Layout
- Grid columns: 3 columns on desktop (lg breakpoint), 2 on tablet (md), 1 on mobile
- Card padding: 16px
- Table cell padding: 8px horizontal, 12px vertical
- Gap between cards: 24px
- Section margins: 32px

---

## 7. Functional Requirements

### 7.1 Real-time Updates
- Vehicle list updates every 3 seconds
- Simulation runs on 1-second cycle (when enabled)
- Status indicators update without page reload

### 7.2 Data Validation
- License plates validated for format
- Zone IDs must exist before car assignment
- Timestamps in ISO 8601 format
- Prices as decimal numbers (2 places)

### 7.3 Error Handling
- API errors logged to console
- User feedback for failed operations
- Graceful degradation if API unavailable
- Empty state messages when no data available

### 7.4 Responsive Design
- Mobile: Single column layout
- Tablet: Two-column zone grid
- Desktop: Three-column zone grid
- Tables: Horizontal scroll on small screens

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Page load: < 2 seconds
- API response time: < 500ms
- Real-time updates: < 100ms latency
- Smooth animations and transitions

### 8.2 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Color contrast ratios meet accessibility standards
- Screen reader friendly

### 8.3 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### 8.4 Security
- No sensitive data exposed in logs
- API authentication (if applicable)
- HTTPS for all communications
- Input sanitization

---

## 9. Success Metrics

### 9.1 Functional Metrics
- ✅ 100% of vehicles tracked accurately
- ✅ Ticket status accuracy: 99%+
- ✅ PCN identification accuracy: 99%+
- ✅ All simulation events persisted

### 9.2 Performance Metrics
- ✅ Page load time < 2 seconds
- ✅ API response time < 500ms
- ✅ Real-time update latency < 100ms
- ✅ Zero missing vehicle entries

### 9.3 User Experience Metrics
- ✅ Intuitive navigation
- ✅ Clear visual feedback for all actions
- ✅ Responsive on all device sizes
- ✅ Consistent Parkopedia branding throughout

---

## 10. Release Plan

### Phase 1: MVP (Current)
- ✅ Core vehicle tracking
- ✅ Zone management
- ✅ Ticket status display
- ✅ Historical records
- ✅ Simulation mode
- ✅ Parkopedia branding

### Phase 2: Enhancements (Future)
- Advanced filtering and search
- Export functionality (CSV, PDF)
- Custom tariff configurations
- User role-based access control
- Enhanced analytics dashboard

### Phase 3: Advanced Features (Future)
- Integration with payment systems
- Mobile app
- Real-time notifications
- Geographic heatmaps
- Predictive analytics

---

## 11. Testing Requirements

### 11.1 Unit Tests
- Status determination logic
- Time formatting functions
- Duration calculations
- Vehicle filtering logic

### 11.2 Integration Tests
- API endpoint functionality
- Data persistence
- Simulation accuracy
- Zone-vehicle relationships

### 11.3 UI Tests
- Form submissions
- Modal interactions
- Table sorting/filtering
- Responsive layouts

### 11.4 Acceptance Criteria
- All core features functional
- No broken links or missing assets
- Consistent Parkopedia branding
- Accessible to users with disabilities

---

## 12. Dependencies & Resources

### 12.1 External Dependencies
- React/Next.js framework
- Tailwind CSS library
- Lucide React icons
- REST API backend

### 12.2 Internal Dependencies
- Header component (shared)
- Zone API
- Car API
- Zone data from `/api/zones`

### 12.3 Design Assets
- Parkopedia logo: https://www.parkopedia.com/public/images/header-logo-new@2x.png
- Color palette: Parkopedia brand colors
- Icon set: Lucide React (Car, MapPin)

---

## 13. Known Limitations & Future Improvements

### 13.1 Current Limitations
- Simulation data overwrites real data
- No user authentication
- No data export functionality
- Limited filtering options
- No real-time push notifications

### 13.2 Future Improvements
- Persistent historical data
- User-based data isolation
- Advanced reporting
- Mobile responsiveness enhancements
- Real-time WebSocket updates
- Integration with parking management systems

---

## 14. Appendix

### 14.1 Glossary
- **PCN:** Penalty Charge Notice (parking violation)
- **Zone:** Defined parking area with specific rules and tariffs
- **Tariff:** Pricing structure for parking duration
- **Entry Time:** Timestamp when vehicle enters zone
- **Exit Time:** Timestamp when vehicle leaves zone
- **Ticket Status:** Current validity of purchased parking ticket

### 14.2 Related Documents
- Parkopedia Zone Manager PRD
- Arrive Car Tracking PRD
- RingGo Car Tracking PRD
- API Documentation

### 14.3 Change Log
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-01 | Initial PRD creation |

---

**Document Version:** 1.0  
**Last Updated:** January 2024  
**Author:** Development Team  
**Status:** Active
