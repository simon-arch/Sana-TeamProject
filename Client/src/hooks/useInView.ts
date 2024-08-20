import React, {useEffect, useState} from 'react';

const UseInView = <T extends HTMLElement>(ref: React.RefObject<T>, options? : IntersectionObserverInit) => {
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setInView(entry.isIntersecting);
        }, options);
        const currentRef = ref.current;

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [options, ref]);
    return inView;
};

export default UseInView;