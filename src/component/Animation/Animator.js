export function Animator(holder) {
    let interval = null;

    this.start = (onUpdated) => {
        if (interval) {
            return;
        }
        
        holder.init();

        this.resume(onUpdated);
    };

    this.resume = (onUpdated) => {
        if (interval) {
            return;
        }

        if (holder.isDone()) {
            return;
        }

        interval = setInterval(() => {
            if (holder.isDone()) {
                this.pause();
                return;
            }

            holder.handle();
            onUpdated(holder.get());
        }, holder.interval);
    }

    this.pause = () => {
        if (!interval) {
            return;
        }

        clearInterval(interval);
        interval = null;
    }
}
