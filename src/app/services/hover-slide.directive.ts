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

    /**
    * Creates the component and injects required services.
    */
    constructor(private el: ElementRef, private renderer: Renderer2, private menuState: MenuStateService) { }

    /**
    * Initializes DOM references and sets up all behaviors after view init.
    */
    ngAfterViewInit(): void {
        const button = this.el.nativeElement as HTMLButtonElement;
        const mainText = button.querySelector('.main-text') as HTMLElement;
        const slideText = button.querySelector('.slide-text') as HTMLElement;
        const mobileSlider = button.querySelector('.mobile-slider') as HTMLElement;
        this.initMenuSubscription(button, mainText, slideText, mobileSlider);
        this.applyMode(button, mainText, slideText, mobileSlider);
        this.initTransitions(button, mainText, slideText);
        this.setupAnimation(button, mainText, slideText);
        this.observeDisabled(button, mainText, slideText);
        this.initResizeListener(button, mainText, slideText, mobileSlider);
    }

    /**
    * Applies mobile or desktop mode depending on state and screen size.
    */
    private applyMode(button: HTMLButtonElement, mainText: HTMLElement, slideText: HTMLElement, mobileSlider: HTMLElement) {
        this.removeListeners();
        this.stopMobileLoop?.();
        this.stopMobileLoop = undefined;
        if (button.disabled) return;
        if (this.isMobile && mobileSlider) {
            if (this.menuOpen) {
                this.renderer.setStyle(mobileSlider, 'opacity', '0');
                this.renderer.setStyle(mobileSlider, 'display', 'flex');
                this.renderer.setStyle(mainText, 'opacity', '0');
                this.renderer.setStyle(slideText, 'opacity', '0');
            } else {
                this.setupMobile(button, mainText, slideText, mobileSlider);
            }
        } else {
            this.setupDesktop(button, mainText, slideText, mobileSlider);
        }
    }

    /**
    * Subscribes to menu state changes and updates the mode.
    */
    private initMenuSubscription(button: HTMLButtonElement, mainText: HTMLElement, slideText: HTMLElement, mobileSlider: HTMLElement) {
        this.menuSub = this.menuState.state$().subscribe(isOpen => {
            this.menuOpen = isOpen;
            this.applyMode(button, mainText, slideText, mobileSlider);
        });
    }

    /**
    * Sets CSS transition styles for smooth animations.
    */
    private initTransitions(button: HTMLButtonElement, mainText: HTMLElement, slideText: HTMLElement) {
        if (!mainText || !slideText) return;
        this.renderer.setStyle(button, 'transition', 'all 0.3s ease');
        this.renderer.setStyle(mainText, 'transition', 'color 0.3s ease');
        this.renderer.setStyle(slideText, 'transition', 'color 0.3s ease');
    }

    /**
    * Initializes animation behavior and styles depending on button state.
    */
    private setupAnimation(button: HTMLButtonElement, mainText: HTMLElement, slideText: HTMLElement) {
        this.removeListeners();
        if (button.disabled) {
            this.setDisabledStyles(button, mainText, slideText);
            return;
        }
        this.renderer.setStyle(mainText, 'color', 'white');
        this.renderer.setStyle(slideText, 'color', 'white');
        this.renderer.setStyle(button, 'background-color', 'transparent');
        this.renderer.setStyle(button, 'cursor', 'pointer');
        this.initButtonAnimation(button, mainText, slideText);
    }

    /**
    * Applies styles when the button is disabled.
    */
    private setDisabledStyles(button: HTMLButtonElement, mainText: HTMLElement, slideText: HTMLElement) {
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
    }

    /**
    * Observes disabled attribute changes and updates animations.
    */
    private observeDisabled(button: HTMLButtonElement, mainText: HTMLElement, slideText: HTMLElement) {
        this.observer = new MutationObserver(() => {
            this.setupAnimation(button, mainText, slideText);
        });
        this.observer.observe(button, {
            attributes: true,
            attributeFilter: ['disabled']
        });
    }

    /**
    * Listens to window resize and switches between mobile and desktop mode.
    */
    private initResizeListener(button: HTMLButtonElement, mainText: HTMLElement, slideText: HTMLElement, mobileSlider: HTMLElement) {
        this.resizeListener = this.renderer.listen('window', 'resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                const nextIsMobile = window.innerWidth < 1000;

                if (nextIsMobile !== this.isMobile) {
                    this.isMobile = nextIsMobile;
                    this.applyMode(button, mainText, slideText, mobileSlider);
                }
            }, 0);
        });
    }

    /**
    * Starts a continuous sliding animation loop for mobile.
    * @returns Function to stop the animation loop.
    */
    private startMobileLoop(element: HTMLElement) {
        let loopFrame: number | null = null;
        const animateLoop = () => {
            const start = performance.now();
            loopFrame = requestAnimationFrame((time) =>
                this.step(element, start, time, animateLoop, (id) => loopFrame = id)
            );
        };
        animateLoop();
        return () => {
            if (loopFrame !== null) cancelAnimationFrame(loopFrame);
        };
    }

    /**
    * Performs a single animation step and loops if needed.
    */
    private step(element: HTMLElement, start: number, time: number, animateLoop: () => void, setFrame: (id: number) => void) {
        const duration = 3000;
        const from = 100;
        const to = -200;
        const progress = Math.min((time - start) / duration, 1);
        const value = from + (to - from) * progress;
        this.renderer.setStyle(element, 'transform', `translateX(${value}%)`);
        if (progress < 1) {
            setFrame(requestAnimationFrame((t) =>
                this.step(element, start, t, animateLoop, setFrame)
            ));
        } else {
            setFrame(requestAnimationFrame(animateLoop));
        }
    }

    /**
    * Initializes hover-based button animations.
    */
    private initButtonAnimation(button: HTMLElement, mainText: HTMLElement, slideText: HTMLElement): void {
        let hoverActive = false;
        let loopFrame: number | null = null;
        let delayTimeout: any = null;
        const animateTransform = this.createAnimator(() => hoverActive, (f) => loopFrame = f);
        this.hoverEnterListener = this.renderer.listen(button, 'mouseenter', () =>
            this.onHoverEnter(button, mainText, slideText, () => hoverActive = true, animateTransform, () => hoverActive, (t) => delayTimeout = t)
        );
        this.hoverLeaveListener = this.renderer.listen(button, 'mouseleave', () =>
            this.onHoverLeave(button, mainText, slideText, () => hoverActive = false, delayTimeout, loopFrame)
        );
    }

    /**
    * Creates a reusable animation function using requestAnimationFrame.
    */
    private createAnimator(getHover: () => boolean, setFrame: (f: number) => void) {
        return (element: HTMLElement, from: number, to: number, duration: number, onFinish?: () => void) => {
            const start = performance.now();
            const animate = (time: number) => {
                const progress = Math.min((time - start) / duration, 1);
                const value = from + (to - from) * progress;
                this.renderer.setStyle(element, 'transform', `translateX(${value}%)`);

                if (progress < 1 && getHover()) {
                    setFrame(requestAnimationFrame(animate));
                } else if (getHover() && onFinish) {
                    setFrame(requestAnimationFrame(onFinish));
                }
            };
            setFrame(requestAnimationFrame(animate));
        };
    }

    /**
    * Handles hover enter event and starts animation.
    */
    private onHoverEnter(button: HTMLElement, mainText: HTMLElement, slideText: HTMLElement, setHover: () => void, animateTransform: Function, getHover: () => boolean, setTimeoutRef: (t: any) => void) {
        if (this.isMobile) return;
        setHover();
        this.applyEnterStyles(button, mainText, slideText);
        const timeout = setTimeout(() => {
            if (!getHover()) return;
            this.startSlideAnimation(slideText, animateTransform, getHover);
        }, 600);
        setTimeoutRef(timeout);
    }

    /**
    * Handles hover leave event and resets animation.
    */
    private onHoverLeave(button: HTMLElement, mainText: HTMLElement, slideText: HTMLElement, setHover: () => void, delayTimeout: any, loopFrame: number | null) {
        if (this.isMobile) return;
        setHover();
        clearTimeout(delayTimeout);
        if (loopFrame) cancelAnimationFrame(loopFrame);
        this.applyLeaveStyles(button, mainText, slideText);
    }

    /**
    * Applies styles when hover starts.
    */
    private applyEnterStyles(button: HTMLElement, mainText: HTMLElement, slideText: HTMLElement) {
        this.renderer.setStyle(mainText, 'cursor', 'pointer');
        this.renderer.setStyle(mainText, 'transition', 'transform 3s ease, color 1s');
        this.renderer.setStyle(mainText, 'transform', 'translateX(-200%)');
        this.renderer.setStyle(mainText, 'color', '#3DCFB6');
        this.renderer.setStyle(slideText, 'color', '#3DCFB6');
        this.renderer.setStyle(button, 'border', '1px solid #3DCFB6');
    }

    /**
    * Resets styles when hover ends.
    */
    private applyLeaveStyles(button: HTMLElement, mainText: HTMLElement, slideText: HTMLElement) {
        this.renderer.setStyle(slideText, 'opacity', '0');
        this.renderer.setStyle(slideText, 'transform', 'translateX(100%)');
        this.renderer.setStyle(mainText, 'transition', 'transform 0.2s ease');
        this.renderer.setStyle(mainText, 'transform', 'translateX(0)');
        this.renderer.setStyle(mainText, 'color', 'white');
        this.renderer.setStyle(button, 'border', '1px solid white');
    }

    /**
    * Starts the sliding text animation loop.
    */
    private startSlideAnimation(slideText: HTMLElement, animateTransform: Function, getHover: () => boolean) {
        this.renderer.setStyle(slideText, 'cursor', 'pointer');
        this.renderer.setStyle(slideText, 'opacity', '1');
        this.renderer.setStyle(slideText, 'transform', 'translateX(100%)');
        const loop = () => {
            if (!getHover()) return;
            animateTransform(slideText, 100, -200, 3000, loop);
        };
        loop();
    }

    /**
    * Configures desktop-specific layout and animations.
    */
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

    /**
    * Configures mobile-specific layout and starts loop animation.
    */
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

    /**
    * Removes all registered event listeners.
    */
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

    /**
    * Cleans up subscriptions, observers, and listeners.
    */
    ngOnDestroy(): void {
        this.removeListeners();
        this.stopMobileLoop?.();
        this.menuSub?.unsubscribe();
        this.observer?.disconnect();
        this.resizeListener?.();
    }
}
