export const TOOLS = {
  LINE: 'line',
  BLOCK_COLOR: 'block_color',
  STAIRS_UP: 'stairs_up',
  STAIRS_DOWN: 'stairs_down',
  CHEST: 'chest',
  DARK_ZONE: 'dark_zone',
  WARP_POINT: 'warp_point',
  SHUTE: 'shute',
  ELEVATOR: 'elevator',
  STAIRS_UP_SVG: 'stairs_up_svg',
  STAIRS_DOWN_SVG: 'stairs_down_svg',
  CURRENT_POSITION: 'current_position',
  EVENT_MARKER: 'event_marker',
  NOTE: 'note',
  DOOR_OPEN: 'door_open',
  DOOR_CLOSED: 'door_closed',
  DOOR_ITEM: 'door_item', // New door item tool
  LINE_ARROW_NORTH: 'line_arrow_north',
  LINE_ARROW_SOUTH: 'line_arrow_south',
  LINE_ARROW_EAST: 'line_arrow_east',
  LINE_ARROW_WEST: 'line_arrow_west',
  ARROW_NORTH: 'arrow_north',
  ARROW_SOUTH: 'arrow_south',
  ARROW_EAST: 'arrow_east',
  ARROW_WEST: 'arrow_west',
  ARROW_ROTATE: 'arrow_rotate',
  ARROW: 'arrow', // Unified arrow tool
  ERASER: 'eraser'
}

export const COLORS = [
  '#ffffff', // White
  '#000000', // Black
  '#ff0000', // Red
  '#00ff00', // Green
  '#0000ff', // Blue
  '#ffff00', // Yellow
  '#ff00ff', // Magenta
  '#00ffff', // Cyan
  '#ffa500', // Orange
  '#800080', // Purple
  '#a52a2a', // Brown
  '#808080'  // Gray
]

export const GRID_SIZE = 40 // Size of each grid cell in pixels
export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 5
export const MAX_FLOORS = 30
export const MAX_DUNGEONS = 10
export const MAX_FLOORS_LIMIT = 100 // Maximum number of floors (upper limit)
export const DEFAULT_MAX_FLOORS = 20 // Default number of floors for new dungeons