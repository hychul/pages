import { Animator } from "./Animator";
import { AnimHolder } from "./AnimHolder";

export default function Animation() {
    // Only used for static object
}

Animation.Anim = (holder) => {
    return new Animator(holder);
}

Animation.AnimHolder = () => {
    return new AnimHolder();
}
