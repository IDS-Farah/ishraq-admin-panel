import { useEffect, useState } from "react";

const AnimatedNumber = ({ value, duration = 1200 }) => {
  const target = Number(value);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(target)) {
      setCount(0);
      return;
    }

    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Smooth animation
      const currentCount = Math.floor(
        target * progress
      );

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Make sure final value is exact
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default AnimatedNumber;