import { Directive, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
    selector: '[hoverSlide]',
    standalone: true
})
export class HoverSlideDirective implements AfterViewInit, OnDestroy {

    private hoverEnterListener?: () => void;
    private hoverLeaveListener?: () => void;
    private observer?: MutationObserver;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngAfterViewInit(): void {
        const button = this.el.nativeElement as HTMLButtonElement;
        const mainText = button.querySelector('.main-text') as HTMLElement;
        const slideText = button.querySelector('.slide-text') as HTMLElement;

        if (!mainText || !slideText) return;

        // 🔹 Füge Transition direkt beim Start hinzu (für smooth Übergang)
        this.renderer.setStyle(button, 'transition', 'all 0.3s ease');
        this.renderer.setStyle(mainText, 'transition', 'color 0.3s ease');
        this.renderer.setStyle(slideText, 'transition', 'color 0.3s ease');

        const setupAnimation = () => {
            // Entferne alte Hover-Listener (zur Sicherheit)
            this.removeListeners();

            if (button.disabled) {
                // ❌ Deaktivierter Zustand
                this.renderer.setStyle(mainText, 'transform', 'translateX(0)');
                this.renderer.setStyle(mainText, 'color', 'grey');
                this.renderer.setStyle(mainText, 'cursor', 'pointer');
                this.renderer.setStyle(slideText, 'opacity', '0');
                this.renderer.setStyle(slideText, 'color', 'grey');
                this.renderer.setStyle(slideText, 'transform', 'translateX(100%)');
                this.renderer.setStyle(slideText, 'cursor', 'default');
                this.renderer.setStyle(button, 'cursor', 'default');
                this.renderer.setStyle(button, 'background-color', 'transparent');
                this.renderer.setStyle(button, 'border', '1px solid grey');
                return;
            }

            // ✅ Aktivierter Zustand
            this.renderer.setStyle(mainText, 'color', 'white');
            this.renderer.setStyle(slideText, 'color', 'white');
            this.renderer.setStyle(button, 'background-color', 'transparent');
            this.renderer.setStyle(button, 'border', '1px solid white');
            this.renderer.setStyle(button, 'cursor', 'pointer');

            // Hover-Animation aktivieren
            this.initButtonAnimation(button, mainText, slideText);
        };

        // initialen Zustand anwenden
        setupAnimation();

        // 🔹 Beobachte Änderungen am disabled-Attribut
        this.observer = new MutationObserver(() => setupAnimation());
        this.observer.observe(button, { attributes: true, attributeFilter: ['disabled'] });
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
        this.hoverEnterListener = this.renderer.listen(button, 'mouseenter', () => {
            hoverActive = true;

            this.renderer.setStyle(mainText, 'cursor', 'pointer');
            this.renderer.setStyle(mainText, 'transition', 'transform 3s ease, color 1s');
            this.renderer.setStyle(mainText, 'transform', 'translateX(-200%)');
            this.renderer.setStyle(mainText, 'color', '#3DCFB6');
            this.renderer.setStyle(slideText, 'color', '#3DCFB6');
            this.renderer.setStyle(button, 'border', '1px solid #3DCFB6');

            delayTimeout = setTimeout(() => {
                if (!hoverActive) return;

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
        this.hoverLeaveListener = this.renderer.listen(button, 'mouseleave', () => {
            hoverActive = false;
            clearTimeout(delayTimeout);
            if (loopFrame) cancelAnimationFrame(loopFrame);

            this.renderer.setStyle(slideText, 'opacity', '0');
            this.renderer.setStyle(slideText, 'transform', 'translateX(100%)');
            this.renderer.setStyle(mainText, 'transition', 'transform 0.2s ease');
            this.renderer.setStyle(mainText, 'transform', 'translateX(0)');
            this.renderer.setStyle(mainText, 'color', 'white');
            this.renderer.setStyle(button, 'border', '1px solid white');
        });
    }

    private removeListeners(): void {
        if (this.hoverEnterListener) {
            this.hoverEnterListener();
            this.hoverEnterListener = undefined;
        }
        if (this.hoverLeaveListener) {
            this.hoverLeaveListener();
            this.hoverLeaveListener = undefined;
        }
    }

    ngOnDestroy(): void {
        this.removeListeners();
        this.observer?.disconnect();
    }
}
