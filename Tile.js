// Define the Tile class to represent an image tile with associated edge values
class Tile {
  // Constructor to initialize a Tile with an image and its corresponding edges
  constructor(img, edges) {
    this.img = img; // The image associated with this tile
    this.edges = edges; // An array representing the tile's edge configuration
  }

  // Method to rotate the tile by a multiple of 90 degrees (num indicates the number of 90° rotations)
  rotate(num) {
    const w = this.img.width; // Get the width of the original image
    const h = this.img.height; // Get the height of the original image
    const newImg = createGraphics(w, h); // Create a new graphics buffer to hold the rotated image
    newImg.imageMode(CENTER); // Set the image mode to center for correct rotation
    newImg.translate(w / 2, h / 2); // Translate the origin to the center of the image
    newImg.rotate(HALF_PI * num); // Rotate the graphics context by num * 90 degrees
    newImg.image(this.img, 0, 0); // Draw the original image onto the rotated context

    // Rotate the edges array to reflect the rotation of the tile
    const newEdges = [];
    let len = this.edges.length;
    for (var i = 0; i < len; i++) {
      // Adjust the index to rotate the edges array; using modulo for wrap-around
      newEdges[i] = this.edges[(i - num + len) % len];
    }

    // Return a new Tile instance with the rotated image and updated edges
    return new Tile(newImg, newEdges);
  }
}
