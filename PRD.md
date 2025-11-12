# Product Requirements Document: RingGo Parking Zone Management Application

## Executive Summary

A web-based application for managing parking zones with interactive map-based zone creation, visualization, and tariff management. Built exclusively for RingGo, this application enables administrators to define parking zones on a map, view coordinates, and configure parking rates for different time durations with RingGo brand identity.

---

## 1. Overview

### Purpose
Provide a user-friendly interface for RingGo parking administrators to:
- Create and manage parking zones on an interactive map
- View and edit zone coordinates
- Configure and manage tariff structures for each zone
- Visualize zones on a map with color differentiation
- Deliver a consistent RingGo branded experience

### Target Users
RingGo parking administrators and management staff

### Platform
Web application built with Next.js, React, and Leaflet

### Brand
RingGo - www.ringgo.co.uk
Route: `/ringgo1`

---

## 2. Core Features

### 2.1 Interactive Map
- **Map Library**: Leaflet with OpenStreetMap tiles
- **Initial Location**: Birmingham, UK (coordinates: 52.5086, -1.8755)
- **Zoom Level**: Level 12 on load
- **Responsiveness**: Map fills the left side of the screen (flex-1 width)
- **Branding**: RingGo branded header with primary color #882877

### 2.2 Zone Drawing
- Click "Draw Zone" button to activate drawing mode
  - Button background: RingGo primary purple (#882877)
- Click on the map to place points (vertices) for zone polygon
- Points are marked with pink circle markers (#FE52A2) (radius: 6px)
- Lines connect consecutive points in RingGo accent pink (#FE52A2)
- Dashed preview line connects the last point to the first point (when 3+ points)
- Auto-close polygon (last point connects to first point)
- Visual feedback showing current point count during drawing
- "Complete" button (RingGo accent pink background #FE52A2)
- "Cancel" button to discard the drawing (red background)

### 2.3 Zone Management Table
**Location**: Right sidebar (fixed width: 320px)

**Table Columns**:
| Column | Details |
|--------|---------|
| Zone Name | Color indicator square + zone name |
| Points | Number of coordinates in the zone |
| Actions | Delete button (red text) |

**Features**:
- Click a row to select the zone
- Selected zone highlighted with blue background (bg-blue-50)
- Unselected zones show hover effect (hover:bg-gray-50)
- All zones listed in scrollable area

### 2.4 Zone Visualization
**On Map**:
- Each zone rendered as a filled polygon
- Unique color per zone (auto-assigned from predefined color palette)
- Semi-transparent fill (fillOpacity: 0.2 for unselected, 0.35 for selected)
- Stroke weight: 2px
- Zone name displayed as popup at first coordinate

**Highlighting**:
- When a zone is selected:
  - Fill opacity increases to 0.35
  - Stroke opacity increases to 1
  - Purple vertices (radius: 8px, color: #882877) appear at all coordinates
  - Map automatically centers and fits the zone with padding [50, 50]
  - Vertices can be dragged to edit zone shape
  - Dragged vertices are persisted to storage

### 2.5 Tariff Management

**Tariff Display Section**:
- Located above coordinates section in sidebar
- Shows all tariffs for the selected zone
- Displays duration and price (e.g., "Up to 1 hour: £1.00")
- Includes "Edit" button to open tariff modal

**Default Tariffs** (if none configured):
```
- Up to 1 hour: £1.00
- Up to 2 hours: £2.00
- Up to 6 hours: £5.00
- Up to 12 hours: £9.00
- Up to 24 hours: £15.00
```

**Tariff Edit Modal**:
- Opens when clicking "Edit" in tariff section
- Modal displays all tariffs with editable price fields
- Each tariff shows duration and price input field
- Currency symbol: £ (GBP)
- Input accepts decimal values (up to 2 decimal places)
- "Cancel" button closes modal without saving (gray background)
- "Save" button persists changes to storage and closes modal (RingGo purple #882877)

### 2.6 Coordinates Display
**Location**: Bottom of sidebar (below tariffs)

**Details**:
- Shows all coordinates for selected zone
- Format: "Point N: latitude, longitude"
- Displays 6 decimal places for each coordinate
- Scrollable area (max-height: 192px)

---

## 3. User Workflows

### 3.1 Creating a New Zone
1. Click "Draw Zone" button in top-right corner
2. Click on the map to place vertices
3. Display shows current point count
4. After placing 3+ points, dashed line shows closure preview
5. Click "Complete" button to save zone
6. Zone appears in table and on map
7. Zone auto-assigned a unique color
8. Default tariffs initialized for the zone

### 3.2 Selecting a Zone
1. Click on a zone row in the table
2. Zone highlights on map with increased opacity
3. Blue vertices appear on all coordinates
4. Tariff section displays for the selected zone
5. Coordinates section shows all points
6. Map centers and fits the zone view

### 3.3 Editing Zone Shape
1. Select a zone to make vertices visible
2. Click and drag any blue vertex marker
3. Map updates in real-time
4. Release to save the new position
5. Changes persisted to storage

### 3.4 Managing Tariffs
1. Select a zone
2. Tariff section appears above coordinates
3. Click "Edit" button
4. Modal opens showing all tariffs
5. Modify price values as needed
6. Click "Save" to persist changes
7. Click "Cancel" to discard changes
8. Modal closes and tariff section updates

### 3.5 Deleting a Zone
1. Click "Delete" button in the zone's table row
2. Zone removed from table and map
3. If zone was selected, selection cleared
4. All associated data removed from storage

---

## 4. Technical Architecture

### 4.1 Frontend Stack
- **Framework**: Next.js 14+
- **UI Library**: React 18+
- **Map Library**: Leaflet + React-Leaflet
- **Styling**: Tailwind CSS
- **Client-Side**: All components are client-side rendered (`'use client'`)

### 4.2 Backend Stack
- **Runtime**: Node.js via Next.js API Routes
- **Data Storage**: JSON file (`zones.json`)
- **File System**: Node.js fs/promises module

### 4.3 Directory Structure
```
code/
├── app/
│   ├── api/
│   │   └── zones/
│   │       └��─ route.ts          # Zone CRUD endpoints
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main application component
│   └── globals.css               # Global styles
├── public/                       # Static assets
├── package.json
└── next.config.ts
```

---

## 5. Data Models

### 5.1 Zone Interface
```typescript
interface Zone {
  id: string;                    // Unique identifier (timestamp)
  name: string;                  // Zone display name (e.g., "Zone 1")
  coordinates: LatLng[];         // Array of coordinate points
  color: string;                 // Hex color for polygon
  tariffs?: Tariff[];            // Optional tariff structure
}
```

### 5.2 LatLng Interface
```typescript
interface LatLng {
  lat: number;                   // Latitude (decimal)
  lng: number;                   // Longitude (decimal)
}
```

### 5.3 Tariff Interface
```typescript
interface Tariff {
  duration: string;              // Time duration (e.g., "Up to 1 hour")
  price: number;                 // Price in GBP (decimal)
}
```

### 5.4 Color Palette
Zones are assigned colors in sequence from:
```typescript
['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9']
```
Cycles through palette as new zones are created.

---

## 6. API Specification

### 6.1 Base Path
`/api/zones`

### 6.2 Endpoints

#### GET /api/zones
**Purpose**: Retrieve all zones

**Response**:
```json
[
  {
    "id": "1234567890",
    "name": "Zone 1",
    "coordinates": [
      { "lat": 52.523564, "lng": -1.925752 },
      { "lat": 52.493272, "lng": -1.983063 },
      { "lat": 52.478013, "lng": -1.909623 }
    ],
    "color": "#ff6b6b",
    "tariffs": [
      { "duration": "Up to 1 hour", "price": 1.00 },
      { "duration": "Up to 2 hours", "price": 2.00 }
    ]
  }
]
```

**Status**: 200 OK

---

#### POST /api/zones
**Purpose**: Create a new zone

**Request Body**:
```json
{
  "name": "Zone 1",
  "coordinates": [
    { "lat": 52.523564, "lng": -1.925752 },
    { "lat": 52.493272, "lng": -1.983063 },
    { "lat": 52.478013, "lng": -1.909623 }
  ],
  "color": "#ff6b6b"
}
```

**Response**:
```json
{
  "id": "1234567890",
  "name": "Zone 1",
  "coordinates": [...],
  "color": "#ff6b6b",
  "tariffs": null
}
```

**Status**: 201 Created

---

#### PUT /api/zones
**Purpose**: Update an existing zone (coordinates and/or tariffs)

**Request Body**:
```json
{
  "id": "1234567890",
  "name": "Zone 1",
  "coordinates": [
    { "lat": 52.523564, "lng": -1.925752 },
    { "lat": 52.493272, "lng": -1.983063 }
  ],
  "color": "#ff6b6b",
  "tariffs": [
    { "duration": "Up to 1 hour", "price": 1.50 },
    { "duration": "Up to 2 hours", "price": 2.50 }
  ]
}
```

**Response**:
```json
{
  "id": "1234567890",
  "name": "Zone 1",
  "coordinates": [...],
  "color": "#ff6b6b",
  "tariffs": [...]
}
```

**Status**: 200 OK

---

#### DELETE /api/zones
**Purpose**: Delete a zone

**Request Body**:
```json
{
  "id": "1234567890"
}
```

**Response**:
```json
{
  "success": true
}
```

**Status**: 200 OK

---

## 7. UI/UX Specifications

### 7.1 Layout
- **Main Layout**: Flex row layout
  - Left side: Map container (flex-1, full height)
  - Right side: Sidebar (width: 320px, fixed)

### 7.2 Sidebar Sections

**Header**:
- Background: RingGo purple gradient (from #882877 to #6b1d52)
- Text: White, large font (text-lg), bold
- Padding: 16px
- Branding: RingGo color scheme

**Zones Table**:
- Header background: Gray (bg-gray-100)
- Header border: Bottom border
- Rows: Selectable, with hover effect
- Selected row: Purple-tinted background (derived from #882877)
- Scrollable area

**Tariff Section**:
- Background: Gray (bg-gray-50)
- Border: Top border
- Padding: 16px
- Contains tariff display and edit button

**Coordinates Section**:
- Background: Gray (bg-gray-50)
- Border: Top border
- Padding: 16px
- Max height: 192px
- Scrollable content
- Monospace font for coordinates

### 7.3 Colors & Styling
| Element | Color | Details |
|---------|-------|---------|
| Primary Button | RingGo Purple (#882877) | Hover: darker purple |
| Accent/Highlight | RingGo Pink (#FE52A2) | Drawing mode, complete button |
| Delete Button | Red (#dc2626) | Text only, hover darker |
| Edit Button (Tariff) | RingGo Purple (#882877) | Small, inline in section |
| Selected Zone Row | Purple tint (bg-purple-50) | Background highlight |
| Sidebar Header | Purple gradient | From #882877 to #6b1d52 |
| Modal Overlay | Black | 50% opacity |
| Modal Background | White | Rounded corners, shadow |

### 7.4 Buttons

**"Draw Zone" Button**:
- Position: Absolute, top-right (top-4, right-4)
- Background: RingGo Purple (#882877)
- Hover: Darker purple with opacity change
- Text: White, medium weight
- Border-radius: rounded
- Z-index: 9999

**"Complete" / "Cancel" Buttons** (Drawing mode):
- Position: Floating overlay, top-right
- Displayed together in a row
- Complete: RingGo Pink (#FE52A2) with dark purple text
- Cancel: Red background (bg-red-600)
- Both have hover states

**"Delete" Button** (Table):
- Text-based, red color
- Hover: Darker red
- Small font size

**"Edit" Button** (Tariff):
- Small RingGo Purple (#882877) button inline in tariff header
- Rounded, small padding

### 7.5 Modal Styling

**Modal Container**:
- Fixed overlay covering full viewport
- Black background with 50% opacity
- Centered content (flex, items-center, justify-center)
- Z-index: 50

**Modal Dialog**:
- White background
- Rounded corners
- Shadow effect
- Max width: 448px
- Padding: 24px
- Responsive margin on mobile

**Modal Content**:
- Title: Large, bold (text-xl)
- Inputs: Number type, step 0.01, min 0
- Input styling: Border, rounded, small padding
- Currency: £ symbol displayed before input

**Modal Buttons**:
- Two buttons in footer: Cancel and Save
- Cancel: Gray background (bg-gray-300)
- Save: RingGo Purple background (#882877)
- Equal flex distribution
- Gap between buttons: 8px

---

## 8. Key Features & Constraints

### 8.1 Constraints
- Minimum 3 points required to create a zone
- Polygon must be closed (first and last points connected)
- Each zone must have a unique ID
- Coordinates stored with 6 decimal places precision
- Prices stored with 2 decimal places precision

### 8.2 Special Behaviors
- Clicking a selected zone a second time does nothing (no deselection)
- All zones render and persist whenever state changes
- Vertex editing only available when zone is selected
- Tariff modal doesn't close on save button click by default; requires explicit close
- Map automatically fits selected zone with padding on selection

### 8.3 Storage
- All zone data persisted to `zones.json` file
- File operations via Node.js fs/promises
- Auto-create file if it doesn't exist
- Return empty array if file doesn't exist or JSON is invalid

---

## 9. State Management

### 9.1 Component State (useState)
```typescript
zones[]                    // All zones
isDrawing: boolean         // Drawing mode active
currentPolygon[]           // Points being drawn
selectedZoneId: string     // Currently selected zone
editingVertexIndex: number // Index of vertex being dragged
showTariffModal: boolean   // Tariff editor visibility
editingTariffs[]           // Tariffs being edited in modal
```

### 9.2 Refs (useRef)
```typescript
mapContainer               // DOM ref to map element
mapInstance                // Leaflet map instance
drawnItemsRef              // Feature group for all drawn items
polygonMarkersRef          // Drawing mode point markers
editMarkersRef             // Selected zone vertex markers
LRef                       // Leaflet library reference
```

---

## 10. Component Structure

### 10.1 Main Component: MapPage
**File**: `code/app/page.tsx`

**Key Methods**:
- `initMap()` - Initialize Leaflet map
- `fetchZones()` - Load zones from API
- `renderZones()` - Render all zones on map with highlighting
- `handleStartDrawing()` - Enter drawing mode
- `handleCompletePolygon()` - Save drawn zone
- `handleCancelDrawing()` - Discard drawing
- `handleSelectZone()` - Select zone and trigger highlighting
- `handleDeleteZone()` - Remove zone
- `handleOpenTariffModal()` - Open tariff editor
- `handleCloseTariffModal()` - Close tariff editor
- `handleUpdateTariffPrice()` - Update tariff value in modal
- `handleSaveTariffs()` - Persist tariff changes

### 10.2 Sub-components
No sub-components. All UI rendered in single MapPage component.

---

## 11. Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Requires modern JavaScript (ES2020+)

---

## 12. Performance Considerations
- Leaflet rendering optimized for 100+ zones
- Debounce not required (coordinates updated on release, not during drag)
- JSON file in production should be replaced with database
- Consider pagination for 1000+ zones

---

## 13. Future Enhancements (Optional)
- User authentication and role management
- Database backend (replace JSON file)
- Zone import/export (CSV, GeoJSON)
- Bulk tariff editing
- Tariff history/versioning
- Multi-language support
- Advanced filtering and search
- Audit logs for changes
- Real-time collaboration

---

## 14. Dependencies

### 14.1 npm Packages
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "leaflet": "^1.9.0",
  "react-leaflet": "^4.0.0"
}
```

### 14.2 CSS Frameworks
- Tailwind CSS (via Next.js setup)
- Leaflet CSS (imported in component)

---

## 15. Environment Setup

### 15.1 Next.js Configuration
- React 18+ with app router
- CSS modules and global CSS support
- No special build configuration required

### 15.2 Initial Commands
```bash
npm install
npm run dev
```

### 15.3 Dev Server
- Runs on default port (3000)
- Hot module replacement enabled
- Source maps for debugging

---

## 16. Testing Recommendations

### 16.1 Unit Tests
- Zone creation and validation
- Coordinate calculations
- Tariff CRUD operations
- API request/response handling

### 16.2 Integration Tests
- Drawing workflow
- Zone selection and highlighting
- Tariff editing and persistence
- Map rendering with multiple zones

### 16.3 E2E Tests
- Complete zone creation flow
- Zone editing and deletion
- Tariff modification
- UI responsiveness

---

## 17. Known Limitations & Notes

- Polygon self-intersections not validated
- No coordinate validation for impossible positions
- Zone names not editable after creation
- No undo/redo functionality
- Single selection mode (not multi-select)
- No permission-based access control
- No export functionality

---

## 18. Acceptance Criteria

- [ ] Interactive map loads centered on Birmingham, UK
- [ ] User can draw zones by clicking map points
- [ ] Zones display in table with color indicators
- [ ] Clicking zone highlights it on map with purple vertices (#882877)
- [ ] Vertices can be dragged to edit zone shape
- [ ] Tariffs display in section above coordinates
- [ ] Clicking "Edit" opens tariff modal
- [ ] Tariff prices can be modified and saved
- [ ] All data persists to zones.json file
- [ ] Zones can be deleted from table
- [ ] Drawing can be completed or canceled
- [ ] Map centers on selected zone
- [ ] Coordinates display with 6 decimal places
- [ ] Modal is functional and accessible

---

## 19. RingGo Branding Standards

### 19.1 RingGo Color Palette
| Element | Color Code | Purpose |
|---------|-----------|---------|
| Primary Brand Color | #882877 | Buttons, headers, primary UI elements |
| Accent Color | #FE52A2 | Highlights, interactive elements, drawing mode |
| Logo | RingGo Arrive Logo | https://myringgo.co.uk/images/easypark/Ringgo_Arrive.png |
| Success State | #10B981 | Positive actions |
| Error State | #EF4444 | Destructive actions |

### 19.2 Brand Guidelines
- All primary buttons must use RingGo Purple (#882877)
- Interactive elements and accents must use RingGo Pink (#FE52A2)
- Header must display RingGo logo and purple gradient background
- Maintain consistent RingGo branding across all pages and components
- Sidebar header gradient: from #882877 to #6b1d52
- Selected zone rows use purple-tinted background

---

## 20. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2024 | RingGo branded version - Purple/Pink theme with RingGo logo |
| 1.0 | 2024 | Initial PRD - Complete feature set with tariff management |

