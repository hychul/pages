export function AnimHolder() {
    let count = 0;
    let frame = 0.0;

    this.behavior = "linear";
    this.duration = 3000;
    this.interval = 18;
    this.min = 0;
    this.max = 1;
    this.fixed = 3;

    let lerp = (start, to, portion) => {
        return bound(start, to, start + ((to - start) * portion));
    };

    let bound = (min, max, value) => {
        if (value < min) {
            return min;
        }

        if (max < value) {
            return max;
        }

        return value;
    }

    this.init = () => {
        count = 0;
        frame = this.min;
    };

    this.isDone = () => {
        return count >= (this.duration / this.interval);
    };

    this.handle = () => {
        count++;
        frame = lerp(this.min, this.max, count / (this.duration / this.interval));
    };

    this.get = () => {
        return frame.toFixed(this.fixed);
    };
}
