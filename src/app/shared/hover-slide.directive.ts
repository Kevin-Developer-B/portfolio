import { Directive, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuStateService } from '../services/menu-state-service';

@Directive({
    selector: '[hoverSlide]',
    standalone: true
})

export class HoverSlideDirective implements AfterViewInit, OnDestroy {
    private menuSub?: Subscription;
    private menuOpen = false;
    private hoverEnterListener?: () => void;
    private hoverLeaveListener?: () => void;
    private observer?: MutationObserver;
    private isMobile = window.innerWidth < 1000;
    private resizeListener?: () => void;
    private stopMobileLoop?: () => void;
    private resizeTimeout: any = null;


    constructor(private el: ElementRef, private renderer: Renderer2, private menuState: MenuStateService) { }

    ngAfterViewInit(): void {
        const button = this.el.nativeElement as HTMLButtonElement;
        const mainText = button.querySelector('.main-text') as HTMLElement;
        const slideText = button.querySelector('.slide-text') as HTMLElement;
        const mobileSlider = button.querySelector('.mobile-slider') as HTMLElement;

        const applyMode = () => {
            this.removeListeners();
            this.stopMobileLoop?.();
            this.stopMobileLoop = undefined;

            if (button.disabled) return;

            if (this.isMobile && mobileSlider) {
                if (this.menuOpen) {
                    // Menü offen → Animation stoppen
                    this.renderer.setStyle(mobileSlider, 'opacity', '0');
                    this.renderer.setStyle(mobileSlider, 'display', 'flex');
                    this.renderer.setStyle(mainText, 'opacity', '0');
                    this.renderer.setStyle(slideText, 'opacity', '0');
                } else {
                    // Menü geschlossen → Animation starten
                    this.setupMobile(button, mainText, slideText, mobileSlider);
                }
            } else {
                this.setupDesktop(button, mainText, slideText, mobileSlider);
            }
        };

        this.menuSub = this.menuState.state$().subscribe(isOpen => {
            this.menuOpen = isOpen;
            applyMode();
        });


        applyMode();

        if (!mainText || !slideText)
            return; this.renderer.setStyle(button, 'transition', 'all 0.3s ease');
        this.renderer.setStyle(mainText, 'transition', 'color 0.3s ease');
        this.renderer.setStyle(slideText, 'transition', 'color 0.3s ease');
        const setupAnimation = () => {
            this.removeListeners();
            if (button.disabled) {
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

            this.renderer.setStyle(mainText, 'color', 'white');
            this.renderer.setStyle(slideText, 'color', 'white');
            this.renderer.setStyle(button, 'background-color', 'transparent');
            this.renderer.setStyle(button, 'cursor', 'pointer');
            this.initButtonAnimation(button, mainText, slideText);
            
        };

        setupAnimation();

        this.observer = new MutationObserver(() => setupAnimation());
        this.observer.observe(button, { attributes: true, attributeFilter: ['disabled'] });

        this.resizeListener = this.renderer.listen('window', 'resize', () => {
            clearTimeout(this.resizeTimeout);

            this.resizeTimeout = setTimeout(() => {
                const nextIsMobile = window.innerWidth < 1000;

                if (nextIsMobile !== this.isMobile) {
                    this.isMobile = nextIsMobile;
                    applyMode();
                }
            }, 0);
        });
    };


    private startMobileLoop(element: HTMLElement) {
        let loopFrame: number | null = null;

        const animateLoop = () => {
            const start = performance.now();
            const duration = 3000;
            const from = 100;
            const to = -200;

            const step = (time: number) => {
                const progress = Math.min((time - start) / duration, 1);
                const value = from + (to - from) * progress;
                this.renderer.setStyle(element, 'transform', `translateX(${value}%)`);

                if (progress < 1) {
                    loopFrame = requestAnimationFrame(step);
                } else {
                    loopFrame = requestAnimationFrame(animateLoop);
                }
            };
            loopFrame = requestAnimationFrame(step);
        };
        animateLoop();

        return () => {
            if (loopFrame !== null) cancelAnimationFrame(loopFrame);
        };
    }

    private initButtonAnimation(button: HTMLElement, mainText: HTMLElement, slideText: HTMLElement): void {
        let hoverActive = false;
        let loopFrame: number | null = null;
        let delayTimeout: any = null;

        const animateTransform = (element: HTMLElement, from: number, to: number, duration: number,
            onFinish?: () => void) => {
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

        this.hoverEnterListener = this.renderer.listen(button, 'mouseenter', () => {
            if (this.isMobile) return;
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

        this.hoverLeaveListener = this.renderer.listen(button, 'mouseleave', () => {
            if (this.isMobile) return;
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

    private setupDesktop(button: HTMLElement, mainText: HTMLElement, slideText: HTMLElement, mobileSlider: HTMLElement | null) {
        this.stopMobileLoop?.();
        this.stopMobileLoop = undefined;

        this.renderer.setStyle(button, 'border', '1px solid white');
        if (mobileSlider) {
            this.renderer.setStyle(mobileSlider, 'transform', 'translateX(100%)');
            this.renderer.setStyle(mobileSlider, 'opacity', '1');
            this.renderer.setStyle(mobileSlider, 'display', 'none');
        }
        this.renderer.setStyle(mainText, 'opacity', '1');
        this.renderer.setStyle(slideText, 'opacity', '0');
        this.initButtonAnimation(button, mainText, slideText);
    }

    private setupMobile(button: HTMLElement, mainText: HTMLElement, slideText: HTMLElement, mobileSlider: HTMLElement) {
        if (!mobileSlider) return;

        this.removeListeners();

        this.renderer.setStyle(mobileSlider, 'display', 'flex');
        this.renderer.setStyle(mobileSlider, 'transform', 'translateX(100%)');
        this.renderer.setStyle(button, 'border', '1px solid #3DCFB6');
        this.renderer.setStyle(mobileSlider, 'opacity', '1');

        this.renderer.setStyle(mainText, 'opacity', '0');
        this.renderer.setStyle(slideText, 'opacity', '0');

        this.stopMobileLoop?.();

        this.stopMobileLoop = this.startMobileLoop(mobileSlider);
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
        this.stopMobileLoop?.();
        this.menuSub?.unsubscribe();
        this.observer?.disconnect();
        this.resizeListener?.();
    }
}
