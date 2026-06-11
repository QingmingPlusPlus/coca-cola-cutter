# image-slicing Specification

## Purpose

The image slicing workspace lets users upload one local image, define rectangular source-image regions, use guide lines for alignment, and preview the resulting slices.

## Requirements

### Requirement: Uploading an image initializes a clean workspace

Uploading a new image MUST record the image filename, natural width, natural height, byte size, MIME type, and browser URL for rendering.

#### Scenario: A new image is loaded

- **WHEN** the selected image finishes loading
- **THEN** the app stores its metadata
- **AND** clears all existing slices
- **AND** clears all guide lines
- **AND** clears selection
- **AND** returns to `slice` mode

### Requirement: Canvas coordinates use source-image pixels

Slice and guide-line coordinates MUST be represented in source-image pixel coordinates. Canvas coordinate conversion MUST account for the canvas container's viewport position and scroll offsets.

#### Scenario: A slice is drawn by dragging

- **WHEN** the user drags from one canvas point to another in `slice` mode
- **THEN** the created slice uses the minimum `x/y` as its origin
- **AND** uses the absolute drag distance as `w/h`
- **AND** rounds coordinates and dimensions to whole pixels

#### Scenario: Drag distance is too small

- **WHEN** the drag width or height is 2 pixels or less
- **THEN** no slice is created

### Requirement: Slices are named editable rectangles

Each slice MUST have a stable `id`, a user-editable `name`, `x`, `y`, `w`, and `h`. Users MUST be able to add a default slice, delete a slice, edit numeric slice fields from the slice list, and rename a slice from the preview gallery.

#### Scenario: A default slice is added

- **WHEN** the user adds a slice from the slice list
- **THEN** a new slice is created at `x: 0`, `y: 0`, `w: 64`, `h: 64`
- **AND** the slice receives a default name

#### Scenario: A slice field is edited

- **WHEN** the user changes `x`, `y`, `w`, or `h`
- **THEN** only that field changes for the targeted slice
- **AND** other slices keep their existing values

#### Scenario: A slice is renamed from the preview gallery

- **WHEN** the user clicks the rename control below a preview item
- **AND** enters a new slice name
- **THEN** that slice name is updated
- **AND** the slice coordinates and dimensions are preserved

### Requirement: Guide lines support vertical and horizontal alignment

The workspace MUST support vertical and horizontal guide-line modes. A guide line MUST have a stable `id`, an `orientation`, and a single pixel `position`.

#### Scenario: A vertical guide is placed

- **WHEN** the user clicks the canvas in `verticalGuide` mode
- **THEN** a vertical guide line is created at the clicked `x` coordinate

#### Scenario: A horizontal guide is placed

- **WHEN** the user clicks the canvas in `horizontalGuide` mode
- **THEN** a horizontal guide line is created at the clicked `y` coordinate

#### Scenario: Guides are cleared

- **WHEN** the user clears guide lines
- **THEN** all guide lines are removed
- **AND** guide-line selection is cleared

### Requirement: Selection mode supports moving and deleting selected items

Selection mode MUST allow selecting slices and guide lines, moving the selected item with pointer drag, and deleting the selected item through the keyboard shortcut.

#### Scenario: A selected slice is dragged

- **WHEN** the selected item is a slice
- **AND** the user drags from inside that slice in `select` mode
- **THEN** the slice `x/y` position updates while preserving the pointer offset inside the slice

#### Scenario: A selected guide line is dragged

- **WHEN** the selected item is a guide line
- **AND** the user drags near that guide line in `select` mode
- **THEN** the guide line position updates along its orientation axis

#### Scenario: Delete shortcut is pressed

- **WHEN** the user presses `d` while an item is selected
- **THEN** the selected slice or guide line is removed
- **AND** selection is cleared

### Requirement: Keyboard shortcuts do not interfere with form editing

Global keyboard shortcuts MUST be ignored while an `INPUT` or `TEXTAREA` element is focused.

#### Scenario: Editing a slice number

- **WHEN** focus is inside a numeric slice field
- **AND** the user types `v`, `h`, `s`, `d`, or `Escape`
- **THEN** the global canvas shortcut handler does not change mode or delete items

### Requirement: Preview uses the same source image and slice coordinates

The preview gallery MUST render one preview per slice using the uploaded image as the source and the slice rectangle as the visible region. The preview gallery MUST show the slice name below each preview.

#### Scenario: Slices exist after image upload

- **WHEN** a slice has `x`, `y`, `w`, and `h`
- **THEN** the preview item uses `w/h` for its visible frame
- **AND** offsets the source image by `-x` and `-y`
- **AND** displays the slice name

### Requirement: Slice data can be exported as JSON

The workspace MUST provide a JSON export action next to the add-slice action. The exported JSON MUST include the current image name and all slice names and rectangles. The exported JSON MUST NOT include guide lines, selection state, or the current interaction mode.

#### Scenario: Current slices are exported

- **WHEN** an image is loaded
- **AND** the user exports JSON
- **THEN** the downloaded JSON includes `imageName`
- **AND** each exported slice includes only `name`, `x`, `y`, `w`, and `h`
- **AND** guide lines are omitted

### Requirement: Workspace state can be temporarily saved

The workspace MUST provide a save action that temporarily stores the current uploaded image and all slices in browser storage. Saved slice data MUST include `id`, `name`, `x`, `y`, `w`, and `h`. Saved workspace data MUST NOT include guide lines, selection state, or the current interaction mode.

#### Scenario: The current workspace is saved

- **WHEN** an image is loaded
- **AND** the user saves the workspace
- **THEN** the source image data is stored for later rendering
- **AND** all slice names and rectangles are stored
- **AND** guide lines are omitted

#### Scenario: A saved workspace is restored

- **WHEN** the app starts with a valid saved workspace
- **THEN** the image metadata is restored
- **AND** the slices are restored
- **AND** the app uses `slice` mode
- **AND** guide lines and selection are empty

### Requirement: New persistence or export behavior requires an explicit spec update

Future work MUST NOT introduce saving, loading, downloading, or exporting slice data as an incidental side effect of canvas, list, or preview changes.

#### Scenario: A change adds file output or persistence

- **WHEN** a change stores slice data outside React state or writes output files
- **THEN** the image-slicing spec is updated with the new behavior and acceptance scenarios
