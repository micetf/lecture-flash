import cheveron_right from "./zondicons/cheveron-right.svg";
export const CHEVERON_RIGHT = cheveron_right;
import heart from "./zondicons/heart.svg";
export const HEART = heart;
import envelope from "./zondicons/envelope.svg";
export const ENVELOPE = envelope;
import search from "./zondicons/search.svg";
export const SEARCH = search;
import edit_pencil from "./zondicons/edit-pencil.svg";
export const EDIT_PENCIL = edit_pencil;
import play from "./zondicons/play.svg";
export const PLAY = play;

const Svg = ({ src, height = "1em" }) => src({ height, fill: "#f8f9fa" });

export default Svg;
