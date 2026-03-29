import { Injectable } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
    providedIn: 'root'
})
export class ScrollAnimation {

    constructor() {
        gsap.registerPlugin(ScrollTrigger);
    }

    fadeInUp(element: string) {
        gsap.from(element, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    }

    fadeInOnScroll(element: string) {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 1
        });
    }

    fadeOutOnScroll(element: string) {
        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top center',
                end: 'bottom top',
                scrub: true
            },
            opacity: 0,
            y: 100
        });
    }

    splitReveal(elementLeft: string, elementRight: string) {

        gsap.fromTo(elementLeft,
            {
                x: -150,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: elementLeft,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: true,
                    toggleActions: 'play reverse play reverse'
                }
            }
        );

        gsap.fromTo(elementRight,
            {
                x: 150,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: elementRight,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: true,
                    toggleActions: 'play reverse play reverse'
                }
            }
        );
    }

    slideInFromBottom(element: string) {

        gsap.fromTo(element,
            {
                y: 100,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    scrub: true,
                    toggleActions: 'play none none none'
                }
            }
        );

    }

}