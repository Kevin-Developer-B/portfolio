import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[hoverSlide]',
    standalone: true
})
export class HoverSlideDirective implements AfterViewInit {

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngAfterViewInit(): void {
        const button = this.el.nativeElement as HTMLElement;
        const mainText = button.querySelector('.main-text') as HTMLElement;
        const slideText = button.querySelector('.slide-text') as HTMLElement;

        if (!mainText || !slideText) return;

        this.initButtonAnimation(button, mainText, slideText);
    }

    private initButtonAnimation(
        button: HTMLElement,
        mainText: HTMLElement,
        slideText: HTMLElement
    ): void {
        let hoverActive = false;
        let loopFrame: number | null = null;
        let delayTimeout: any = null;

        const animateTransform = (
            element: HTMLElement,
            from: number,
            to: number,
            duration: number,
            onFinish?: () => void
        ) => {
            const start = performance.now();
            const animate = (time: number) => {
                const progress = Math.min((time - start) / duration, 1);
                const value = from + (to - from) * progress;
                this.renderer.setStyle(element, 'transform', `translateX(${value}%)`);

                if (progress < 1 && hoverActive) {
                    loopFrame = requestAnimationFrame(animate);
                } else if (hoverActive && onFinish) {
                    loopFrame = requestAnimationFrame(onFinish);
                }
            };
            loopFrame = requestAnimationFrame(animate);
        };

        // Hover starten
        this.renderer.listen(button, 'mouseenter', () => {
            hoverActive = true;

            // main-text raus
            this.renderer.setStyle(mainText, 'cursor', 'pointer');
            this.renderer.setStyle(mainText, 'transition', 'transform 3s ease, color 1s');
            this.renderer.setStyle(mainText, 'transform', 'translateX(-200%)');
            this.renderer.setStyle(mainText, 'color', '#3DCFB6');

            // Verzögerung, bis slide-text startet
            delayTimeout = setTimeout(() => {
                if (!hoverActive) return; // ❗ Nur starten, wenn wirklich noch hovered

                this.renderer.setStyle(slideText, 'cursor', 'pointer');
                this.renderer.setStyle(slideText, 'opacity', '1');
                this.renderer.setStyle(slideText, 'transform', 'translateX(100%)');

                const loop = () => {
                    if (!hoverActive) return;
                    animateTransform(slideText, 100, -200, 3000, loop);
                };

                loop();
            }, 600);
        });

        // Hover verlassen
        this.renderer.listen(button, 'mouseleave', () => {
            hoverActive = false;
            clearTimeout(delayTimeout);
            if (loopFrame) cancelAnimationFrame(loopFrame);

            // slide-text stoppen & verstecken
            this.renderer.setStyle(slideText, 'opacity', '0');
            this.renderer.setStyle(slideText, 'transform', 'translateX(100%)');

            // main-text zurück
            this.renderer.setStyle(mainText, 'transition', 'transform 0.2s ease');
            this.renderer.setStyle(mainText, 'transform', 'translateX(0)');
            this.renderer.setStyle(mainText, 'color', 'white');
        });
    }
}
