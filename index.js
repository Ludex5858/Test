import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const git = simpleGit();
const path = "./data.json";

const FONT = {
  A: [" ### ", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
  B: ["#### ", "#   #", "#   #", "#### ", "#   #", "#   #", "#### "],
  C: [" ### ", "#   #", "#    ", "#    ", "#    ", "#   #", " ### "],
  D: ["#### ", "#   #", "#   #", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "#    ", "#### ", "#    ", "#    ", "#####"],
  F: ["#####", "#    ", "#    ", "#### ", "#    ", "#    ", "#    "],
  G: [" ### ", "#   #", "#    ", "# ###", "#   #", "#   #", " ### "],
  H: ["#   #", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
  I: ["#####", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "#####"],
  J: ["#####", "   # ", "   # ", "   # ", "#  # ", "#  # ", " ##  "],
  K: ["#   #", "#  # ", "# #  ", "##   ", "# #  ", "#  # ", "#   #"],
  L: ["#    ", "#    ", "#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #", "#   #", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#   #", "#### ", "#    ", "#    ", "#    "],
  Q: [" ### ", "#   #", "#   #", "#   #", "# # #", "#  # ", " ## #"],
  R: ["#### ", "#   #", "#   #", "#### ", "# #  ", "#  # ", "#   #"],
  S: [" ####", "#    ", "#    ", " ### ", "    #", "    #", "#### "],
  T: ["#####", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  "],
  U: ["#   #", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", "#   #", "#   #", " # # ", "  #  "],
  W: ["#   #", "#   #", "#   #", "# # #", "# # #", "## ##", "#   #"],
  X: ["#   #", "#   #", " # # ", "  #  ", " # # ", "#   #", "#   #"],
  Y: ["#   #", "#   #", " # # ", "  #  ", "  #  ", "  #  ", "  #  "],
  Z: ["#####", "    #", "   # ", "  #  ", " #   ", "#    ", "#####"],

  0: [" ### ", "#   #", "#  ##", "# # #", "##  #", "#   #", " ### "],
  1: ["  #  ", " ##  ", "  #  ", "  #  ", "  #  ", "  #  ", " ### "],
  2: [" ### ", "#   #", "    #", "   # ", "  #  ", " #   ", "#####"],
  3: [" ### ", "#   #", "    #", " ### ", "    #", "#   #", " ### "],
  4: ["#   #", "#   #", "#   #", "#####", "    #", "    #", "    #"],
  5: ["#####", "#    ", "#    ", "#### ", "    #", "    #", "#### "],
  6: [" ### ", "#    ", "#    ", "#### ", "#   #", "#   #", " ### "],
  7: ["#####", "    #", "   # ", "  #  ", " #   ", " #   ", " #   "],
  8: [" ### ", "#   #", "#   #", " ### ", "#   #", "#   #", " ### "],
  9: [" ### ", "#   #", "#   #", " ####", "    #", "    #", " ### "],

  " ": ["     ", "     ", "     ", "     ", "     ", "     ", "     "],
};

function drawGraph(text) {
  const coords = [];
  const chars = text.toUpperCase().split("");
  let offsetX = 0;

  chars.forEach((char) => {
    const pattern = FONT[char];
    if (!pattern) {
      offsetX += 6;
      return;
    }

    pattern.forEach((row, y) => {
      row.split("").forEach((pixel, x) => {
        if (pixel === "#") {
          coords.push({ x: offsetX + x, y });
        }
      });
    });

    offsetX += pattern[0].length + 1;
  });

  return coords;
}

function markCommit(x, y, next, i, total) {
  // Show progress
  process.stdout.write(`\rCommit ${i + 1} of ${total} (x=${x}, y=${y})`);

  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = { date };

  // Write file and commit
  jsonfile.writeFile(path, data, () => {
    git.add([path]).commit(date, { "--date": date }, () => next());
  });
}

function makeCommits(coords, i = 0) {
  if (i >= coords.length) {
    console.log("\nAll commits done! Pushing...");
    git.push();
    return;
  }

  const { x, y } = coords[i];
  markCommit(x, y, () => makeCommits(coords, i + 1), i, coords.length);
}

// ===== Run =====
const coords = drawGraph("ILuvCATs");
makeCommits(coords);
