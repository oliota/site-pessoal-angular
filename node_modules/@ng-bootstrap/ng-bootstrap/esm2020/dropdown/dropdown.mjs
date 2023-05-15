import { ContentChild, ContentChildren, Directive, EventEmitter, forwardRef, Inject, Input, Optional, Output, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ngbPositioning } from '../util/positioning';
import { addPopperOffset } from '../util/positioning-util';
import { ngbAutoClose } from '../util/autoclose';
import { Key } from '../util/key';
import { FOCUSABLE_ELEMENTS_SELECTOR } from '../util/focus-trap';
import * as i0 from "@angular/core";
import * as i1 from "./dropdown-config";
export class NgbNavbar {
}
NgbNavbar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbNavbar, deps: [], target: i0.ɵɵFactoryTarget.Directive });
NgbNavbar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbNavbar, isStandalone: true, selector: ".navbar", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbNavbar, decorators: [{
            type: Directive,
            args: [{ selector: '.navbar', standalone: true }]
        }] });
/**
 * A directive you should put on a dropdown item to enable keyboard navigation.
 * Arrow keys will move focus between items marked with this directive.
 *
 * @since 4.1.0
 */
export class NgbDropdownItem {
    constructor(elementRef, _renderer) {
        this.elementRef = elementRef;
        this._renderer = _renderer;
        this._disabled = false;
    }
    set disabled(value) {
        this._disabled = value === '' || value === true; // accept an empty attribute as true
        // note: we don't use a host binding for disabled because when used on links, it fails because links don't have a
        // disabled property
        // setting the property using the renderer, OTOH, works fine in both cases.
        this._renderer.setProperty(this.elementRef.nativeElement, 'disabled', this._disabled);
    }
    get disabled() {
        return this._disabled;
    }
}
NgbDropdownItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownItem, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
NgbDropdownItem.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbDropdownItem, isStandalone: true, selector: "[ngbDropdownItem]", inputs: { disabled: "disabled" }, host: { properties: { "class.disabled": "disabled", "tabIndex": "disabled ? -1 : 0" }, classAttribute: "dropdown-item" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdownItem]',
                    standalone: true,
                    host: { class: 'dropdown-item', '[class.disabled]': 'disabled', '[tabIndex]': 'disabled ? -1 : 0' },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { disabled: [{
                type: Input
            }] } });
/**
 * A directive that wraps dropdown menu content and dropdown items.
 */
export class NgbDropdownMenu {
    constructor(dropdown, _elementRef) {
        this.dropdown = dropdown;
        this.placement = 'bottom';
        this.isOpen = false;
        this.nativeElement = _elementRef.nativeElement;
    }
}
NgbDropdownMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownMenu, deps: [{ token: forwardRef(() => NgbDropdown) }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbDropdownMenu.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbDropdownMenu, isStandalone: true, selector: "[ngbDropdownMenu]", host: { listeners: { "keydown.ArrowUp": "dropdown.onKeyDown($event)", "keydown.ArrowDown": "dropdown.onKeyDown($event)", "keydown.Home": "dropdown.onKeyDown($event)", "keydown.End": "dropdown.onKeyDown($event)", "keydown.Enter": "dropdown.onKeyDown($event)", "keydown.Space": "dropdown.onKeyDown($event)", "keydown.Tab": "dropdown.onKeyDown($event)", "keydown.Shift.Tab": "dropdown.onKeyDown($event)" }, properties: { "class.dropdown-menu": "true", "class.show": "dropdown.isOpen()" } }, queries: [{ propertyName: "menuItems", predicate: NgbDropdownItem }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownMenu, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdownMenu]',
                    standalone: true,
                    host: {
                        '[class.dropdown-menu]': 'true',
                        '[class.show]': 'dropdown.isOpen()',
                        '(keydown.ArrowUp)': 'dropdown.onKeyDown($event)',
                        '(keydown.ArrowDown)': 'dropdown.onKeyDown($event)',
                        '(keydown.Home)': 'dropdown.onKeyDown($event)',
                        '(keydown.End)': 'dropdown.onKeyDown($event)',
                        '(keydown.Enter)': 'dropdown.onKeyDown($event)',
                        '(keydown.Space)': 'dropdown.onKeyDown($event)',
                        '(keydown.Tab)': 'dropdown.onKeyDown($event)',
                        '(keydown.Shift.Tab)': 'dropdown.onKeyDown($event)',
                    },
                }]
        }], ctorParameters: function () { return [{ type: NgbDropdown, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbDropdown)]
                }] }, { type: i0.ElementRef }]; }, propDecorators: { menuItems: [{
                type: ContentChildren,
                args: [NgbDropdownItem]
            }] } });
/**
 * A directive to mark an element to which dropdown menu will be anchored.
 *
 * This is a simple version of the `NgbDropdownToggle` directive.
 * It plays the same role, but doesn't listen to click events to toggle dropdown menu thus enabling support
 * for events other than click.
 *
 * @since 1.1.0
 */
export class NgbDropdownAnchor {
    constructor(dropdown, _elementRef) {
        this.dropdown = dropdown;
        this.nativeElement = _elementRef.nativeElement;
    }
}
NgbDropdownAnchor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownAnchor, deps: [{ token: forwardRef(() => NgbDropdown) }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbDropdownAnchor.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbDropdownAnchor, isStandalone: true, selector: "[ngbDropdownAnchor]", host: { properties: { "attr.aria-expanded": "dropdown.isOpen()" }, classAttribute: "dropdown-toggle" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownAnchor, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdownAnchor]',
                    standalone: true,
                    host: { class: 'dropdown-toggle', '[attr.aria-expanded]': 'dropdown.isOpen()' },
                }]
        }], ctorParameters: function () { return [{ type: NgbDropdown, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbDropdown)]
                }] }, { type: i0.ElementRef }]; } });
/**
 * A directive to mark an element that will toggle dropdown via the `click` event.
 *
 * You can also use `NgbDropdownAnchor` as an alternative.
 */
export class NgbDropdownToggle extends NgbDropdownAnchor {
    constructor(dropdown, elementRef) {
        super(dropdown, elementRef);
    }
}
NgbDropdownToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownToggle, deps: [{ token: forwardRef(() => NgbDropdown) }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbDropdownToggle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbDropdownToggle, isStandalone: true, selector: "[ngbDropdownToggle]", host: { listeners: { "click": "dropdown.toggle()", "keydown.ArrowUp": "dropdown.onKeyDown($event)", "keydown.ArrowDown": "dropdown.onKeyDown($event)", "keydown.Home": "dropdown.onKeyDown($event)", "keydown.End": "dropdown.onKeyDown($event)", "keydown.Tab": "dropdown.onKeyDown($event)", "keydown.Shift.Tab": "dropdown.onKeyDown($event)" }, properties: { "attr.aria-expanded": "dropdown.isOpen()" }, classAttribute: "dropdown-toggle" }, providers: [{ provide: NgbDropdownAnchor, useExisting: forwardRef(() => NgbDropdownToggle) }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdownToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdownToggle]',
                    standalone: true,
                    host: {
                        class: 'dropdown-toggle',
                        '[attr.aria-expanded]': 'dropdown.isOpen()',
                        '(click)': 'dropdown.toggle()',
                        '(keydown.ArrowUp)': 'dropdown.onKeyDown($event)',
                        '(keydown.ArrowDown)': 'dropdown.onKeyDown($event)',
                        '(keydown.Home)': 'dropdown.onKeyDown($event)',
                        '(keydown.End)': 'dropdown.onKeyDown($event)',
                        '(keydown.Tab)': 'dropdown.onKeyDown($event)',
                        '(keydown.Shift.Tab)': 'dropdown.onKeyDown($event)',
                    },
                    providers: [{ provide: NgbDropdownAnchor, useExisting: forwardRef(() => NgbDropdownToggle) }],
                }]
        }], ctorParameters: function () { return [{ type: NgbDropdown, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbDropdown)]
                }] }, { type: i0.ElementRef }]; } });
/**
 * A directive that provides contextual overlays for displaying lists of links and more.
 */
export class NgbDropdown {
    constructor(_changeDetector, config, _document, _ngZone, _elementRef, _renderer, ngbNavbar) {
        this._changeDetector = _changeDetector;
        this._document = _document;
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._destroyCloseHandlers$ = new Subject();
        this._bodyContainer = null;
        /**
         * Defines whether or not the dropdown menu is opened initially.
         */
        this._open = false;
        /**
         * An event fired when the dropdown is opened or closed.
         *
         * The event payload is a `boolean`:
         * * `true` - the dropdown was opened
         * * `false` - the dropdown was closed
         */
        this.openChange = new EventEmitter();
        this.placement = config.placement;
        this.popperOptions = config.popperOptions;
        this.container = config.container;
        this.autoClose = config.autoClose;
        this._positioning = ngbPositioning();
        this.display = ngbNavbar ? 'static' : 'dynamic';
    }
    ngAfterContentInit() {
        this._ngZone.onStable.pipe(take(1)).subscribe(() => {
            this._applyPlacementClasses();
            if (this._open) {
                this._setCloseHandlers();
            }
        });
    }
    ngOnChanges(changes) {
        if (changes.container && this._open) {
            this._applyContainer(this.container);
        }
        if (changes.placement && !changes.placement.firstChange) {
            this._positioning.setOptions({
                hostElement: this._anchor.nativeElement,
                targetElement: this._bodyContainer || this._menu.nativeElement,
                placement: this.placement,
                appendToBody: this.container === 'body',
            });
            this._applyPlacementClasses();
        }
        if (changes.dropdownClass) {
            const { currentValue, previousValue } = changes.dropdownClass;
            this._applyCustomDropdownClass(currentValue, previousValue);
        }
        if (changes.autoClose && this._open) {
            this.autoClose = changes.autoClose.currentValue;
            this._setCloseHandlers();
        }
    }
    /**
     * Checks if the dropdown menu is open.
     */
    isOpen() {
        return this._open;
    }
    /**
     * Opens the dropdown menu.
     */
    open() {
        if (!this._open) {
            this._open = true;
            this._applyContainer(this.container);
            this.openChange.emit(true);
            this._setCloseHandlers();
            if (this._anchor) {
                this._anchor.nativeElement.focus();
                if (this.display === 'dynamic') {
                    this._ngZone.runOutsideAngular(() => {
                        this._positioning.createPopper({
                            hostElement: this._anchor.nativeElement,
                            targetElement: this._bodyContainer || this._menu.nativeElement,
                            placement: this.placement,
                            appendToBody: this.container === 'body',
                            updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 2])(options)),
                        });
                        this._applyPlacementClasses();
                        this._zoneSubscription = this._ngZone.onStable.subscribe(() => this._positionMenu());
                    });
                }
            }
        }
    }
    _setCloseHandlers() {
        this._destroyCloseHandlers$.next(); // destroy any existing close handlers
        ngbAutoClose(this._ngZone, this._document, this.autoClose, (source) => {
            this.close();
            if (source === 0 /* SOURCE.ESCAPE */) {
                this._anchor.nativeElement.focus();
            }
        }, this._destroyCloseHandlers$, this._menu ? [this._menu.nativeElement] : [], this._anchor ? [this._anchor.nativeElement] : [], '.dropdown-item,.dropdown-divider');
    }
    /**
     * Closes the dropdown menu.
     */
    close() {
        if (this._open) {
            this._open = false;
            this._resetContainer();
            this._positioning.destroy();
            this._zoneSubscription?.unsubscribe();
            this._destroyCloseHandlers$.next();
            this.openChange.emit(false);
            this._changeDetector.markForCheck();
        }
    }
    /**
     * Toggles the dropdown menu.
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    ngOnDestroy() {
        this.close();
    }
    onKeyDown(event) {
        /* eslint-disable-next-line deprecation/deprecation */
        const key = event.which;
        const itemElements = this._getMenuElements();
        let position = -1;
        let itemElement = null;
        const isEventFromToggle = this._isEventFromToggle(event);
        if (!isEventFromToggle && itemElements.length) {
            itemElements.forEach((item, index) => {
                if (item.contains(event.target)) {
                    itemElement = item;
                }
                if (item === this._document.activeElement) {
                    position = index;
                }
            });
        }
        // closing on Enter / Space
        if (key === Key.Space || key === Key.Enter) {
            if (itemElement && (this.autoClose === true || this.autoClose === 'inside')) {
                // Item is either a button or a link, so click will be triggered by the browser on Enter or Space.
                // So we have to register a one-time click handler that will fire after any user defined click handlers
                // to close the dropdown
                fromEvent(itemElement, 'click')
                    .pipe(take(1))
                    .subscribe(() => this.close());
            }
            return;
        }
        if (key === Key.Tab) {
            if (event.target && this.isOpen() && this.autoClose) {
                if (this._anchor.nativeElement === event.target) {
                    if (this.container === 'body' && !event.shiftKey) {
                        /* This case is special: user is using [Tab] from the anchor/toggle.
               User expects the next focusable element in the dropdown menu to get focus.
               But the menu is not a sibling to anchor/toggle, it is at the end of the body.
               Trick is to synchronously focus the menu element, and let the [keydown.Tab] go
               so that browser will focus the proper element (first one focusable in the menu) */
                        this._renderer.setAttribute(this._menu.nativeElement, 'tabindex', '0');
                        this._menu.nativeElement.focus();
                        this._renderer.removeAttribute(this._menu.nativeElement, 'tabindex');
                    }
                    else if (event.shiftKey) {
                        this.close();
                    }
                    return;
                }
                else if (this.container === 'body') {
                    const focusableElements = this._menu.nativeElement.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
                    if (event.shiftKey && event.target === focusableElements[0]) {
                        this._anchor.nativeElement.focus();
                        event.preventDefault();
                    }
                    else if (!event.shiftKey && event.target === focusableElements[focusableElements.length - 1]) {
                        this._anchor.nativeElement.focus();
                        this.close();
                    }
                }
                else {
                    fromEvent(event.target, 'focusout')
                        .pipe(take(1))
                        .subscribe(({ relatedTarget }) => {
                        if (!this._elementRef.nativeElement.contains(relatedTarget)) {
                            this.close();
                        }
                    });
                }
            }
            return;
        }
        // opening / navigating
        if (isEventFromToggle || itemElement) {
            this.open();
            if (itemElements.length) {
                switch (key) {
                    case Key.ArrowDown:
                        position = Math.min(position + 1, itemElements.length - 1);
                        break;
                    case Key.ArrowUp:
                        if (this._isDropup() && position === -1) {
                            position = itemElements.length - 1;
                            break;
                        }
                        position = Math.max(position - 1, 0);
                        break;
                    case Key.Home:
                        position = 0;
                        break;
                    case Key.End:
                        position = itemElements.length - 1;
                        break;
                }
                itemElements[position].focus();
            }
            event.preventDefault();
        }
    }
    _isDropup() {
        return this._elementRef.nativeElement.classList.contains('dropup');
    }
    _isEventFromToggle(event) {
        return this._anchor.nativeElement.contains(event.target);
    }
    _getMenuElements() {
        const menu = this._menu;
        if (menu == null) {
            return [];
        }
        return menu.menuItems.filter((item) => !item.disabled).map((item) => item.elementRef.nativeElement);
    }
    _positionMenu() {
        const menu = this._menu;
        if (this.isOpen() && menu) {
            if (this.display === 'dynamic') {
                this._positioning.update();
                this._applyPlacementClasses();
            }
            else {
                this._applyPlacementClasses(this._getFirstPlacement(this.placement));
            }
        }
    }
    _getFirstPlacement(placement) {
        return Array.isArray(placement) ? placement[0] : placement.split(' ')[0];
    }
    _resetContainer() {
        const renderer = this._renderer;
        if (this._menu) {
            const dropdownElement = this._elementRef.nativeElement;
            const dropdownMenuElement = this._menu.nativeElement;
            renderer.appendChild(dropdownElement, dropdownMenuElement);
        }
        if (this._bodyContainer) {
            renderer.removeChild(this._document.body, this._bodyContainer);
            this._bodyContainer = null;
        }
    }
    _applyContainer(container = null) {
        this._resetContainer();
        if (container === 'body') {
            const renderer = this._renderer;
            const dropdownMenuElement = this._menu.nativeElement;
            const bodyContainer = (this._bodyContainer = this._bodyContainer || renderer.createElement('div'));
            // Override some styles to have the positioning working
            renderer.setStyle(bodyContainer, 'position', 'absolute');
            renderer.setStyle(dropdownMenuElement, 'position', 'static');
            renderer.setStyle(bodyContainer, 'z-index', '1055');
            renderer.appendChild(bodyContainer, dropdownMenuElement);
            renderer.appendChild(this._document.body, bodyContainer);
        }
        this._applyCustomDropdownClass(this.dropdownClass);
    }
    _applyCustomDropdownClass(newClass, oldClass) {
        const targetElement = this.container === 'body' ? this._bodyContainer : this._elementRef.nativeElement;
        if (targetElement) {
            if (oldClass) {
                this._renderer.removeClass(targetElement, oldClass);
            }
            if (newClass) {
                this._renderer.addClass(targetElement, newClass);
            }
        }
    }
    _applyPlacementClasses(placement) {
        const menu = this._menu;
        if (menu) {
            if (!placement) {
                placement = this._getFirstPlacement(this.placement);
            }
            const renderer = this._renderer;
            const dropdownElement = this._elementRef.nativeElement;
            // remove the current placement classes
            renderer.removeClass(dropdownElement, 'dropup');
            renderer.removeClass(dropdownElement, 'dropdown');
            const { nativeElement } = menu;
            if (this.display === 'static') {
                menu.placement = null;
                renderer.setAttribute(nativeElement, 'data-bs-popper', 'static');
            }
            else {
                menu.placement = placement;
                renderer.removeAttribute(nativeElement, 'data-bs-popper');
            }
            /*
             * apply the new placement
             * in case of top use up-arrow or down-arrow otherwise
             */
            const dropdownClass = placement.search('^top') !== -1 ? 'dropup' : 'dropdown';
            renderer.addClass(dropdownElement, dropdownClass);
            const bodyContainer = this._bodyContainer;
            if (bodyContainer) {
                renderer.removeClass(bodyContainer, 'dropup');
                renderer.removeClass(bodyContainer, 'dropdown');
                renderer.addClass(bodyContainer, dropdownClass);
            }
        }
    }
}
NgbDropdown.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdown, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.NgbDropdownConfig }, { token: DOCUMENT }, { token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: NgbNavbar, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
NgbDropdown.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbDropdown, isStandalone: true, selector: "[ngbDropdown]", inputs: { autoClose: "autoClose", dropdownClass: "dropdownClass", _open: ["open", "_open"], placement: "placement", popperOptions: "popperOptions", container: "container", display: "display" }, outputs: { openChange: "openChange" }, host: { properties: { "class.show": "isOpen()" } }, queries: [{ propertyName: "_menu", first: true, predicate: NgbDropdownMenu, descendants: true }, { propertyName: "_anchor", first: true, predicate: NgbDropdownAnchor, descendants: true }], exportAs: ["ngbDropdown"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDropdown, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdown]',
                    exportAs: 'ngbDropdown',
                    standalone: true,
                    host: { '[class.show]': 'isOpen()' },
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.NgbDropdownConfig }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: NgbNavbar, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { _menu: [{
                type: ContentChild,
                args: [NgbDropdownMenu, { static: false }]
            }], _anchor: [{
                type: ContentChild,
                args: [NgbDropdownAnchor, { static: false }]
            }], autoClose: [{
                type: Input
            }], dropdownClass: [{
                type: Input
            }], _open: [{
                type: Input,
                args: ['open']
            }], placement: [{
                type: Input
            }], popperOptions: [{
                type: Input
            }], container: [{
                type: Input
            }], display: [{
                type: Input
            }], openChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZHJvcGRvd24vZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdOLFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUVULFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFJTCxRQUFRLEVBQ1IsTUFBTSxHQUlOLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDeEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXRDLE9BQU8sRUFBRSxjQUFjLEVBQTZCLE1BQU0scUJBQXFCLENBQUM7QUFFaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxZQUFZLEVBQVUsTUFBTSxtQkFBbUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBR2xDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7QUFHakUsTUFBTSxPQUFPLFNBQVM7O3NHQUFULFNBQVM7MEZBQVQsU0FBUzsyRkFBVCxTQUFTO2tCQURyQixTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFOztBQUdwRDs7Ozs7R0FLRztBQU1ILE1BQU0sT0FBTyxlQUFlO0lBa0IzQixZQUFtQixVQUFtQyxFQUFVLFNBQW9CO1FBQWpFLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBVztRQWY1RSxjQUFTLEdBQUcsS0FBSyxDQUFDO0lBZTZELENBQUM7SUFieEYsSUFDSSxRQUFRLENBQUMsS0FBYztR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QU0sYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7WUFDMUMsSUFBSSxhQUFhLEVBQUU7Z0JBQ2xCLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5QyxRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDaEQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7YUFDaEQ7U0FDRDtJQUNGLENBQUM7O3dHQWpiVyxXQUFXLG9GQXFGZCxRQUFROzRGQXJGTCxXQUFXLHlZQVFULGVBQWUsMEVBQ2YsaUJBQWlCOzJGQVRuQixXQUFXO2tCQU52QixTQUFTO21CQUFDO29CQUNWLFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsYUFBYTtvQkFDdkIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLElBQUksRUFBRSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUU7aUJBQ3BDOzswQkFzRkUsTUFBTTsyQkFBQyxRQUFROzswQkFJZixRQUFROzRDQWpGZ0QsS0FBSztzQkFBOUQsWUFBWTt1QkFBQyxlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dCQUNZLE9BQU87c0JBQWxFLFlBQVk7dUJBQUMsaUJBQWlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dCQVV6QyxTQUFTO3NCQUFqQixLQUFLO2dCQVlHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBS1MsS0FBSztzQkFBbkIsS0FBSzt1QkFBQyxNQUFNO2dCQVNKLFNBQVM7c0JBQWpCLEtBQUs7Z0JBUUcsYUFBYTtzQkFBckIsS0FBSztnQkFRRyxTQUFTO3NCQUFqQixLQUFLO2dCQVVHLE9BQU87c0JBQWYsS0FBSztnQkFTSSxVQUFVO3NCQUFuQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QWZ0ZXJDb250ZW50SW5pdCxcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbnRlbnRDaGlsZCxcblx0Q29udGVudENoaWxkcmVuLFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0Zm9yd2FyZFJlZixcblx0SW5qZWN0LFxuXHRJbnB1dCxcblx0Tmdab25lLFxuXHRPbkNoYW5nZXMsXG5cdE9uRGVzdHJveSxcblx0T3B0aW9uYWwsXG5cdE91dHB1dCxcblx0UXVlcnlMaXN0LFxuXHRSZW5kZXJlcjIsXG5cdFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IG5nYlBvc2l0aW9uaW5nLCBQbGFjZW1lbnQsIFBsYWNlbWVudEFycmF5IH0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnQHBvcHBlcmpzL2NvcmUnO1xuaW1wb3J0IHsgYWRkUG9wcGVyT2Zmc2V0IH0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZy11dGlsJztcbmltcG9ydCB7IG5nYkF1dG9DbG9zZSwgU09VUkNFIH0gZnJvbSAnLi4vdXRpbC9hdXRvY2xvc2UnO1xuaW1wb3J0IHsgS2V5IH0gZnJvbSAnLi4vdXRpbC9rZXknO1xuXG5pbXBvcnQgeyBOZ2JEcm9wZG93bkNvbmZpZyB9IGZyb20gJy4vZHJvcGRvd24tY29uZmlnJztcbmltcG9ydCB7IEZPQ1VTQUJMRV9FTEVNRU5UU19TRUxFQ1RPUiB9IGZyb20gJy4uL3V0aWwvZm9jdXMtdHJhcCc7XG5cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJy5uYXZiYXInLCBzdGFuZGFsb25lOiB0cnVlIH0pXG5leHBvcnQgY2xhc3MgTmdiTmF2YmFyIHt9XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgeW91IHNob3VsZCBwdXQgb24gYSBkcm9wZG93biBpdGVtIHRvIGVuYWJsZSBrZXlib2FyZCBuYXZpZ2F0aW9uLlxuICogQXJyb3cga2V5cyB3aWxsIG1vdmUgZm9jdXMgYmV0d2VlbiBpdGVtcyBtYXJrZWQgd2l0aCB0aGlzIGRpcmVjdGl2ZS5cbiAqXG4gKiBAc2luY2UgNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duSXRlbV0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7IGNsYXNzOiAnZHJvcGRvd24taXRlbScsICdbY2xhc3MuZGlzYWJsZWRdJzogJ2Rpc2FibGVkJywgJ1t0YWJJbmRleF0nOiAnZGlzYWJsZWQgPyAtMSA6IDAnIH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duSXRlbSB7XG5cdHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogYm9vbGVhbiB8ICcnO1xuXG5cdHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cblx0QElucHV0KClcblx0c2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fZGlzYWJsZWQgPSA8YW55PnZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gdHJ1ZTsgLy8gYWNjZXB0IGFuIGVtcHR5IGF0dHJpYnV0ZSBhcyB0cnVlXG5cdFx0Ly8gbm90ZTogd2UgZG9uJ3QgdXNlIGEgaG9zdCBiaW5kaW5nIGZvciBkaXNhYmxlZCBiZWNhdXNlIHdoZW4gdXNlZCBvbiBsaW5rcywgaXQgZmFpbHMgYmVjYXVzZSBsaW5rcyBkb24ndCBoYXZlIGFcblx0XHQvLyBkaXNhYmxlZCBwcm9wZXJ0eVxuXHRcdC8vIHNldHRpbmcgdGhlIHByb3BlcnR5IHVzaW5nIHRoZSByZW5kZXJlciwgT1RPSCwgd29ya3MgZmluZSBpbiBib3RoIGNhc2VzLlxuXHRcdHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCB0aGlzLl9kaXNhYmxlZCk7XG5cdH1cblxuXHRnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuXHR9XG5cblx0Y29uc3RydWN0b3IocHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgZHJvcGRvd24gbWVudSBjb250ZW50IGFuZCBkcm9wZG93biBpdGVtcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duTWVudV0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7XG5cdFx0J1tjbGFzcy5kcm9wZG93bi1tZW51XSc6ICd0cnVlJyxcblx0XHQnW2NsYXNzLnNob3ddJzogJ2Ryb3Bkb3duLmlzT3BlbigpJyxcblx0XHQnKGtleWRvd24uQXJyb3dVcCknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuXHRcdCcoa2V5ZG93bi5BcnJvd0Rvd24pJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcblx0XHQnKGtleWRvd24uSG9tZSknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuXHRcdCcoa2V5ZG93bi5FbmQpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcblx0XHQnKGtleWRvd24uRW50ZXIpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcblx0XHQnKGtleWRvd24uU3BhY2UpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcblx0XHQnKGtleWRvd24uVGFiKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG5cdFx0JyhrZXlkb3duLlNoaWZ0LlRhYiknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuXHR9LFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bk1lbnUge1xuXHRuYXRpdmVFbGVtZW50OiBIVE1MRWxlbWVudDtcblx0cGxhY2VtZW50OiBQbGFjZW1lbnQgfCBudWxsID0gJ2JvdHRvbSc7XG5cdGlzT3BlbiA9IGZhbHNlO1xuXG5cdEBDb250ZW50Q2hpbGRyZW4oTmdiRHJvcGRvd25JdGVtKSBtZW51SXRlbXM6IFF1ZXJ5TGlzdDxOZ2JEcm9wZG93bkl0ZW0+O1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JEcm9wZG93bikpIHB1YmxpYyBkcm9wZG93bjogTmdiRHJvcGRvd24sXG5cdFx0X2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuXHQpIHtcblx0XHR0aGlzLm5hdGl2ZUVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXHR9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWFyayBhbiBlbGVtZW50IHRvIHdoaWNoIGRyb3Bkb3duIG1lbnUgd2lsbCBiZSBhbmNob3JlZC5cbiAqXG4gKiBUaGlzIGlzIGEgc2ltcGxlIHZlcnNpb24gb2YgdGhlIGBOZ2JEcm9wZG93blRvZ2dsZWAgZGlyZWN0aXZlLlxuICogSXQgcGxheXMgdGhlIHNhbWUgcm9sZSwgYnV0IGRvZXNuJ3QgbGlzdGVuIHRvIGNsaWNrIGV2ZW50cyB0byB0b2dnbGUgZHJvcGRvd24gbWVudSB0aHVzIGVuYWJsaW5nIHN1cHBvcnRcbiAqIGZvciBldmVudHMgb3RoZXIgdGhhbiBjbGljay5cbiAqXG4gKiBAc2luY2UgMS4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duQW5jaG9yXScsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHsgY2xhc3M6ICdkcm9wZG93bi10b2dnbGUnLCAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnZHJvcGRvd24uaXNPcGVuKCknIH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duQW5jaG9yIHtcblx0bmF0aXZlRWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cdGNvbnN0cnVjdG9yKFxuXHRcdEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JEcm9wZG93bikpIHB1YmxpYyBkcm9wZG93bjogTmdiRHJvcGRvd24sXG5cdFx0X2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuXHQpIHtcblx0XHR0aGlzLm5hdGl2ZUVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXHR9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWFyayBhbiBlbGVtZW50IHRoYXQgd2lsbCB0b2dnbGUgZHJvcGRvd24gdmlhIHRoZSBgY2xpY2tgIGV2ZW50LlxuICpcbiAqIFlvdSBjYW4gYWxzbyB1c2UgYE5nYkRyb3Bkb3duQW5jaG9yYCBhcyBhbiBhbHRlcm5hdGl2ZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duVG9nZ2xlXScsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHtcblx0XHRjbGFzczogJ2Ryb3Bkb3duLXRvZ2dsZScsXG5cdFx0J1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2Ryb3Bkb3duLmlzT3BlbigpJyxcblx0XHQnKGNsaWNrKSc6ICdkcm9wZG93bi50b2dnbGUoKScsXG5cdFx0JyhrZXlkb3duLkFycm93VXApJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcblx0XHQnKGtleWRvd24uQXJyb3dEb3duKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG5cdFx0JyhrZXlkb3duLkhvbWUpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcblx0XHQnKGtleWRvd24uRW5kKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG5cdFx0JyhrZXlkb3duLlRhYiknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuXHRcdCcoa2V5ZG93bi5TaGlmdC5UYWIpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcblx0fSxcblx0cHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOZ2JEcm9wZG93bkFuY2hvciwgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiRHJvcGRvd25Ub2dnbGUpIH1dLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93blRvZ2dsZSBleHRlbmRzIE5nYkRyb3Bkb3duQW5jaG9yIHtcblx0Y29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5nYkRyb3Bkb3duKSkgZHJvcGRvd246IE5nYkRyb3Bkb3duLCBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuXHRcdHN1cGVyKGRyb3Bkb3duLCBlbGVtZW50UmVmKTtcblx0fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgcHJvdmlkZXMgY29udGV4dHVhbCBvdmVybGF5cyBmb3IgZGlzcGxheWluZyBsaXN0cyBvZiBsaW5rcyBhbmQgbW9yZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duXScsXG5cdGV4cG9ydEFzOiAnbmdiRHJvcGRvd24nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7ICdbY2xhc3Muc2hvd10nOiAnaXNPcGVuKCknIH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXHRzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfYXV0b0Nsb3NlOiBib29sZWFuIHwgc3RyaW5nO1xuXHRzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzcGxheTogc3RyaW5nO1xuXHRwcml2YXRlIF9kZXN0cm95Q2xvc2VIYW5kbGVycyQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXHRwcml2YXRlIF96b25lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cdHByaXZhdGUgX2JvZHlDb250YWluZXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cdHByaXZhdGUgX3Bvc2l0aW9uaW5nOiBSZXR1cm5UeXBlPHR5cGVvZiBuZ2JQb3NpdGlvbmluZz47XG5cblx0QENvbnRlbnRDaGlsZChOZ2JEcm9wZG93bk1lbnUsIHsgc3RhdGljOiBmYWxzZSB9KSBwcml2YXRlIF9tZW51OiBOZ2JEcm9wZG93bk1lbnU7XG5cdEBDb250ZW50Q2hpbGQoTmdiRHJvcGRvd25BbmNob3IsIHsgc3RhdGljOiBmYWxzZSB9KSBwcml2YXRlIF9hbmNob3I6IE5nYkRyb3Bkb3duQW5jaG9yO1xuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZHJvcGRvd24gc2hvdWxkIGJlIGNsb3NlZCB3aGVuIGNsaWNraW5nIG9uZSBvZiBkcm9wZG93biBpdGVtcyBvciBwcmVzc2luZyBFU0MuXG5cdCAqXG5cdCAqICogYHRydWVgIC0gdGhlIGRyb3Bkb3duIHdpbGwgY2xvc2Ugb24gYm90aCBvdXRzaWRlIGFuZCBpbnNpZGUgKG1lbnUpIGNsaWNrcy5cblx0ICogKiBgZmFsc2VgIC0gdGhlIGRyb3Bkb3duIGNhbiBvbmx5IGJlIGNsb3NlZCBtYW51YWxseSB2aWEgYGNsb3NlKClgIG9yIGB0b2dnbGUoKWAgbWV0aG9kcy5cblx0ICogKiBgXCJpbnNpZGVcImAgLSB0aGUgZHJvcGRvd24gd2lsbCBjbG9zZSBvbiBpbnNpZGUgbWVudSBjbGlja3MsIGJ1dCBub3Qgb3V0c2lkZSBjbGlja3MuXG5cdCAqICogYFwib3V0c2lkZVwiYCAtIHRoZSBkcm9wZG93biB3aWxsIGNsb3NlIG9ubHkgb24gdGhlIG91dHNpZGUgY2xpY2tzIGFuZCBub3Qgb24gbWVudSBjbGlja3MuXG5cdCAqL1xuXHRASW5wdXQoKSBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnb3V0c2lkZScgfCAnaW5zaWRlJztcblxuXHQvKipcblx0ICogQSBjdXN0b20gY2xhc3MgdGhhdCBpcyBhcHBsaWVkIG9ubHkgdG8gdGhlIGBuZ2JEcm9wZG93bk1lbnVgIHBhcmVudCBlbGVtZW50LlxuXHQgKiAqIEluIGNhc2Ugb2YgdGhlIGlubGluZSBkcm9wZG93biBpdCB3aWxsIGJlIHRoZSBgPGRpdiBuZ2JEcm9wZG93bj5gXG5cdCAqICogSW4gY2FzZSBvZiB0aGUgZHJvcGRvd24gd2l0aCAgYGNvbnRhaW5lcj1cImJvZHlcImAgaXQgd2lsbCBiZSB0aGUgYDxkaXYgY2xhc3M9XCJkcm9wZG93blwiPmAgYXR0YWNoZWQgdG8gdGhlIGA8Ym9keT5gXG5cdCAqXG5cdCAqIFVzZWZ1bCBtYWlubHkgd2hlbiBkcm9wZG93biBpcyBhdHRhY2hlZCB0byB0aGUgYm9keS5cblx0ICogSWYgdGhlIGRyb3Bkb3duIGlzIGlubGluZSBqdXN0IHVzZSBgPGRpdiBuZ2JEcm9wZG93biBjbGFzcz1cImN1c3RvbS1jbGFzc1wiPmAgaW5zdGVhZC5cblx0ICpcblx0ICogQHNpbmNlIDkuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSBkcm9wZG93bkNsYXNzOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIERlZmluZXMgd2hldGhlciBvciBub3QgdGhlIGRyb3Bkb3duIG1lbnUgaXMgb3BlbmVkIGluaXRpYWxseS5cblx0ICovXG5cdEBJbnB1dCgnb3BlbicpIF9vcGVuID0gZmFsc2U7XG5cblx0LyoqXG5cdCAqIFRoZSBwcmVmZXJyZWQgcGxhY2VtZW50IG9mIHRoZSBkcm9wZG93biwgYW1vbmcgdGhlIFtwb3NzaWJsZSB2YWx1ZXNdKCMvZ3VpZGVzL3Bvc2l0aW9uaW5nI2FwaSkuXG5cdCAqXG5cdCAqIFRoZSBkZWZhdWx0IG9yZGVyIG9mIHByZWZlcmVuY2UgaXMgYFwiYm90dG9tLXN0YXJ0IGJvdHRvbS1lbmQgdG9wLXN0YXJ0IHRvcC1lbmRcImBcblx0ICpcblx0ICogUGxlYXNlIHNlZSB0aGUgW3Bvc2l0aW9uaW5nIG92ZXJ2aWV3XSgjL3Bvc2l0aW9uaW5nKSBmb3IgbW9yZSBkZXRhaWxzLlxuXHQgKi9cblx0QElucHV0KCkgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheTtcblxuXHQvKipcblx0ICogQWxsb3dzIHRvIGNoYW5nZSBkZWZhdWx0IFBvcHBlciBvcHRpb25zIHdoZW4gcG9zaXRpb25pbmcgdGhlIGRyb3Bkb3duLlxuXHQgKiBSZWNlaXZlcyBjdXJyZW50IHBvcHBlciBvcHRpb25zIGFuZCByZXR1cm5zIG1vZGlmaWVkIG9uZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxMy4xLjBcblx0ICovXG5cdEBJbnB1dCgpIHBvcHBlck9wdGlvbnM6IChvcHRpb25zOiBQYXJ0aWFsPE9wdGlvbnM+KSA9PiBQYXJ0aWFsPE9wdGlvbnM+O1xuXG5cdC8qKlxuXHQgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIGRyb3Bkb3duIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cblx0ICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgXCJib2R5XCIuXG5cdCAqXG5cdCAqIEBzaW5jZSA0LjEuMFxuXHQgKi9cblx0QElucHV0KCkgY29udGFpbmVyOiBudWxsIHwgJ2JvZHknO1xuXG5cdC8qKlxuXHQgKiBFbmFibGUgb3IgZGlzYWJsZSB0aGUgZHluYW1pYyBwb3NpdGlvbmluZy4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgZHluYW1pYyB1bmxlc3MgdGhlIGRyb3Bkb3duIGlzIHVzZWRcblx0ICogaW5zaWRlIGEgQm9vdHN0cmFwIG5hdmJhci4gSWYgeW91IG5lZWQgY3VzdG9tIHBsYWNlbWVudCBmb3IgYSBkcm9wZG93biBpbiBhIG5hdmJhciwgc2V0IGl0IHRvXG5cdCAqIGR5bmFtaWMgZXhwbGljaXRseS4gU2VlIHRoZSBbcG9zaXRpb25pbmcgb2YgZHJvcGRvd25dKCMvcG9zaXRpb25pbmcjZHJvcGRvd24pXG5cdCAqIGFuZCB0aGUgW25hdmJhciBkZW1vXSgvIy9jb21wb25lbnRzL2Ryb3Bkb3duL2V4YW1wbGVzI25hdmJhcikgZm9yIG1vcmUgZGV0YWlscy5cblx0ICpcblx0ICogQHNpbmNlIDQuMi4wXG5cdCAqL1xuXHRASW5wdXQoKSBkaXNwbGF5OiAnZHluYW1pYycgfCAnc3RhdGljJztcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZmlyZWQgd2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlbmVkIG9yIGNsb3NlZC5cblx0ICpcblx0ICogVGhlIGV2ZW50IHBheWxvYWQgaXMgYSBgYm9vbGVhbmA6XG5cdCAqICogYHRydWVgIC0gdGhlIGRyb3Bkb3duIHdhcyBvcGVuZWRcblx0ICogKiBgZmFsc2VgIC0gdGhlIGRyb3Bkb3duIHdhcyBjbG9zZWRcblx0ICovXG5cdEBPdXRwdXQoKSBvcGVuQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcblx0XHRjb25maWc6IE5nYkRyb3Bkb3duQ29uZmlnLFxuXHRcdEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG5cdFx0cHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG5cdFx0cHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG5cdFx0cHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcblx0XHRAT3B0aW9uYWwoKSBuZ2JOYXZiYXI6IE5nYk5hdmJhcixcblx0KSB7XG5cdFx0dGhpcy5wbGFjZW1lbnQgPSBjb25maWcucGxhY2VtZW50O1xuXHRcdHRoaXMucG9wcGVyT3B0aW9ucyA9IGNvbmZpZy5wb3BwZXJPcHRpb25zO1xuXHRcdHRoaXMuY29udGFpbmVyID0gY29uZmlnLmNvbnRhaW5lcjtcblx0XHR0aGlzLmF1dG9DbG9zZSA9IGNvbmZpZy5hdXRvQ2xvc2U7XG5cblx0XHR0aGlzLl9wb3NpdGlvbmluZyA9IG5nYlBvc2l0aW9uaW5nKCk7XG5cdFx0dGhpcy5kaXNwbGF5ID0gbmdiTmF2YmFyID8gJ3N0YXRpYycgOiAnZHluYW1pYyc7XG5cdH1cblxuXHRuZ0FmdGVyQ29udGVudEluaXQoKSB7XG5cdFx0dGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdHRoaXMuX2FwcGx5UGxhY2VtZW50Q2xhc3NlcygpO1xuXHRcdFx0aWYgKHRoaXMuX29wZW4pIHtcblx0XHRcdFx0dGhpcy5fc2V0Q2xvc2VIYW5kbGVycygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0bmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuXHRcdGlmIChjaGFuZ2VzLmNvbnRhaW5lciAmJiB0aGlzLl9vcGVuKSB7XG5cdFx0XHR0aGlzLl9hcHBseUNvbnRhaW5lcih0aGlzLmNvbnRhaW5lcik7XG5cdFx0fVxuXG5cdFx0aWYgKGNoYW5nZXMucGxhY2VtZW50ICYmICFjaGFuZ2VzLnBsYWNlbWVudC5maXJzdENoYW5nZSkge1xuXHRcdFx0dGhpcy5fcG9zaXRpb25pbmcuc2V0T3B0aW9ucyh7XG5cdFx0XHRcdGhvc3RFbGVtZW50OiB0aGlzLl9hbmNob3IubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0dGFyZ2V0RWxlbWVudDogdGhpcy5fYm9keUNvbnRhaW5lciB8fCB0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdHBsYWNlbWVudDogdGhpcy5wbGFjZW1lbnQsXG5cdFx0XHRcdGFwcGVuZFRvQm9keTogdGhpcy5jb250YWluZXIgPT09ICdib2R5Jyxcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fYXBwbHlQbGFjZW1lbnRDbGFzc2VzKCk7XG5cdFx0fVxuXG5cdFx0aWYgKGNoYW5nZXMuZHJvcGRvd25DbGFzcykge1xuXHRcdFx0Y29uc3QgeyBjdXJyZW50VmFsdWUsIHByZXZpb3VzVmFsdWUgfSA9IGNoYW5nZXMuZHJvcGRvd25DbGFzcztcblx0XHRcdHRoaXMuX2FwcGx5Q3VzdG9tRHJvcGRvd25DbGFzcyhjdXJyZW50VmFsdWUsIHByZXZpb3VzVmFsdWUpO1xuXHRcdH1cblxuXHRcdGlmIChjaGFuZ2VzLmF1dG9DbG9zZSAmJiB0aGlzLl9vcGVuKSB7XG5cdFx0XHR0aGlzLmF1dG9DbG9zZSA9IGNoYW5nZXMuYXV0b0Nsb3NlLmN1cnJlbnRWYWx1ZTtcblx0XHRcdHRoaXMuX3NldENsb3NlSGFuZGxlcnMoKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBkcm9wZG93biBtZW51IGlzIG9wZW4uXG5cdCAqL1xuXHRpc09wZW4oKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX29wZW47XG5cdH1cblxuXHQvKipcblx0ICogT3BlbnMgdGhlIGRyb3Bkb3duIG1lbnUuXG5cdCAqL1xuXHRvcGVuKCk6IHZvaWQge1xuXHRcdGlmICghdGhpcy5fb3Blbikge1xuXHRcdFx0dGhpcy5fb3BlbiA9IHRydWU7XG5cdFx0XHR0aGlzLl9hcHBseUNvbnRhaW5lcih0aGlzLmNvbnRhaW5lcik7XG5cdFx0XHR0aGlzLm9wZW5DaGFuZ2UuZW1pdCh0cnVlKTtcblx0XHRcdHRoaXMuX3NldENsb3NlSGFuZGxlcnMoKTtcblx0XHRcdGlmICh0aGlzLl9hbmNob3IpIHtcblx0XHRcdFx0dGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0aWYgKHRoaXMuZGlzcGxheSA9PT0gJ2R5bmFtaWMnKSB7XG5cdFx0XHRcdFx0dGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMuX3Bvc2l0aW9uaW5nLmNyZWF0ZVBvcHBlcih7XG5cdFx0XHRcdFx0XHRcdGhvc3RFbGVtZW50OiB0aGlzLl9hbmNob3IubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XHRcdFx0dGFyZ2V0RWxlbWVudDogdGhpcy5fYm9keUNvbnRhaW5lciB8fCB0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdFx0XHRcdHBsYWNlbWVudDogdGhpcy5wbGFjZW1lbnQsXG5cdFx0XHRcdFx0XHRcdGFwcGVuZFRvQm9keTogdGhpcy5jb250YWluZXIgPT09ICdib2R5Jyxcblx0XHRcdFx0XHRcdFx0dXBkYXRlUG9wcGVyT3B0aW9uczogKG9wdGlvbnMpID0+IHRoaXMucG9wcGVyT3B0aW9ucyhhZGRQb3BwZXJPZmZzZXQoWzAsIDJdKShvcHRpb25zKSksXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHRoaXMuX2FwcGx5UGxhY2VtZW50Q2xhc3NlcygpO1xuXHRcdFx0XHRcdFx0dGhpcy5fem9uZVN1YnNjcmlwdGlvbiA9IHRoaXMuX25nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fcG9zaXRpb25NZW51KCkpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfc2V0Q2xvc2VIYW5kbGVycygpIHtcblx0XHR0aGlzLl9kZXN0cm95Q2xvc2VIYW5kbGVycyQubmV4dCgpOyAvLyBkZXN0cm95IGFueSBleGlzdGluZyBjbG9zZSBoYW5kbGVyc1xuXG5cdFx0bmdiQXV0b0Nsb3NlKFxuXHRcdFx0dGhpcy5fbmdab25lLFxuXHRcdFx0dGhpcy5fZG9jdW1lbnQsXG5cdFx0XHR0aGlzLmF1dG9DbG9zZSxcblx0XHRcdChzb3VyY2U6IFNPVVJDRSkgPT4ge1xuXHRcdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0XHRcdGlmIChzb3VyY2UgPT09IFNPVVJDRS5FU0NBUEUpIHtcblx0XHRcdFx0XHR0aGlzLl9hbmNob3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0dGhpcy5fZGVzdHJveUNsb3NlSGFuZGxlcnMkLFxuXHRcdFx0dGhpcy5fbWVudSA/IFt0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnRdIDogW10sXG5cdFx0XHR0aGlzLl9hbmNob3IgPyBbdGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnRdIDogW10sXG5cdFx0XHQnLmRyb3Bkb3duLWl0ZW0sLmRyb3Bkb3duLWRpdmlkZXInLFxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2VzIHRoZSBkcm9wZG93biBtZW51LlxuXHQgKi9cblx0Y2xvc2UoKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX29wZW4pIHtcblx0XHRcdHRoaXMuX29wZW4gPSBmYWxzZTtcblx0XHRcdHRoaXMuX3Jlc2V0Q29udGFpbmVyKCk7XG5cdFx0XHR0aGlzLl9wb3NpdGlvbmluZy5kZXN0cm95KCk7XG5cdFx0XHR0aGlzLl96b25lU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuXHRcdFx0dGhpcy5fZGVzdHJveUNsb3NlSGFuZGxlcnMkLm5leHQoKTtcblx0XHRcdHRoaXMub3BlbkNoYW5nZS5lbWl0KGZhbHNlKTtcblx0XHRcdHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIHRoZSBkcm9wZG93biBtZW51LlxuXHQgKi9cblx0dG9nZ2xlKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLmlzT3BlbigpKSB7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3BlbigpO1xuXHRcdH1cblx0fVxuXG5cdG5nT25EZXN0cm95KCkge1xuXHRcdHRoaXMuY2xvc2UoKTtcblx0fVxuXG5cdG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuXHRcdC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbiAqL1xuXHRcdGNvbnN0IGtleSA9IGV2ZW50LndoaWNoO1xuXHRcdGNvbnN0IGl0ZW1FbGVtZW50cyA9IHRoaXMuX2dldE1lbnVFbGVtZW50cygpO1xuXG5cdFx0bGV0IHBvc2l0aW9uID0gLTE7XG5cdFx0bGV0IGl0ZW1FbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXHRcdGNvbnN0IGlzRXZlbnRGcm9tVG9nZ2xlID0gdGhpcy5faXNFdmVudEZyb21Ub2dnbGUoZXZlbnQpO1xuXG5cdFx0aWYgKCFpc0V2ZW50RnJvbVRvZ2dsZSAmJiBpdGVtRWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRpdGVtRWxlbWVudHMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcblx0XHRcdFx0aWYgKGl0ZW0uY29udGFpbnMoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KSkge1xuXHRcdFx0XHRcdGl0ZW1FbGVtZW50ID0gaXRlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaXRlbSA9PT0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuXHRcdFx0XHRcdHBvc2l0aW9uID0gaW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIGNsb3Npbmcgb24gRW50ZXIgLyBTcGFjZVxuXHRcdGlmIChrZXkgPT09IEtleS5TcGFjZSB8fCBrZXkgPT09IEtleS5FbnRlcikge1xuXHRcdFx0aWYgKGl0ZW1FbGVtZW50ICYmICh0aGlzLmF1dG9DbG9zZSA9PT0gdHJ1ZSB8fCB0aGlzLmF1dG9DbG9zZSA9PT0gJ2luc2lkZScpKSB7XG5cdFx0XHRcdC8vIEl0ZW0gaXMgZWl0aGVyIGEgYnV0dG9uIG9yIGEgbGluaywgc28gY2xpY2sgd2lsbCBiZSB0cmlnZ2VyZWQgYnkgdGhlIGJyb3dzZXIgb24gRW50ZXIgb3IgU3BhY2UuXG5cdFx0XHRcdC8vIFNvIHdlIGhhdmUgdG8gcmVnaXN0ZXIgYSBvbmUtdGltZSBjbGljayBoYW5kbGVyIHRoYXQgd2lsbCBmaXJlIGFmdGVyIGFueSB1c2VyIGRlZmluZWQgY2xpY2sgaGFuZGxlcnNcblx0XHRcdFx0Ly8gdG8gY2xvc2UgdGhlIGRyb3Bkb3duXG5cdFx0XHRcdGZyb21FdmVudChpdGVtRWxlbWVudCwgJ2NsaWNrJylcblx0XHRcdFx0XHQucGlwZSh0YWtlKDEpKVxuXHRcdFx0XHRcdC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZSgpKTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoa2V5ID09PSBLZXkuVGFiKSB7XG5cdFx0XHRpZiAoZXZlbnQudGFyZ2V0ICYmIHRoaXMuaXNPcGVuKCkgJiYgdGhpcy5hdXRvQ2xvc2UpIHtcblx0XHRcdFx0aWYgKHRoaXMuX2FuY2hvci5uYXRpdmVFbGVtZW50ID09PSBldmVudC50YXJnZXQpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5JyAmJiAhZXZlbnQuc2hpZnRLZXkpIHtcblx0XHRcdFx0XHRcdC8qIFRoaXMgY2FzZSBpcyBzcGVjaWFsOiB1c2VyIGlzIHVzaW5nIFtUYWJdIGZyb20gdGhlIGFuY2hvci90b2dnbGUuXG4gICAgICAgICAgICAgICBVc2VyIGV4cGVjdHMgdGhlIG5leHQgZm9jdXNhYmxlIGVsZW1lbnQgaW4gdGhlIGRyb3Bkb3duIG1lbnUgdG8gZ2V0IGZvY3VzLlxuICAgICAgICAgICAgICAgQnV0IHRoZSBtZW51IGlzIG5vdCBhIHNpYmxpbmcgdG8gYW5jaG9yL3RvZ2dsZSwgaXQgaXMgYXQgdGhlIGVuZCBvZiB0aGUgYm9keS5cbiAgICAgICAgICAgICAgIFRyaWNrIGlzIHRvIHN5bmNocm9ub3VzbHkgZm9jdXMgdGhlIG1lbnUgZWxlbWVudCwgYW5kIGxldCB0aGUgW2tleWRvd24uVGFiXSBnb1xuICAgICAgICAgICAgICAgc28gdGhhdCBicm93c2VyIHdpbGwgZm9jdXMgdGhlIHByb3BlciBlbGVtZW50IChmaXJzdCBvbmUgZm9jdXNhYmxlIGluIHRoZSBtZW51KSAqL1xuXHRcdFx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuX21lbnUubmF0aXZlRWxlbWVudCwgJ3RhYmluZGV4JywgJzAnKTtcblx0XHRcdFx0XHRcdHRoaXMuX21lbnUubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuXHRcdFx0XHRcdFx0dGhpcy5fcmVuZGVyZXIucmVtb3ZlQXR0cmlidXRlKHRoaXMuX21lbnUubmF0aXZlRWxlbWVudCwgJ3RhYmluZGV4Jyk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChldmVudC5zaGlmdEtleSkge1xuXHRcdFx0XHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5Jykge1xuXHRcdFx0XHRcdGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gdGhpcy5fbWVudS5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoRk9DVVNBQkxFX0VMRU1FTlRTX1NFTEVDVE9SKTtcblx0XHRcdFx0XHRpZiAoZXZlbnQuc2hpZnRLZXkgJiYgZXZlbnQudGFyZ2V0ID09PSBmb2N1c2FibGVFbGVtZW50c1swXSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICghZXZlbnQuc2hpZnRLZXkgJiYgZXZlbnQudGFyZ2V0ID09PSBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZnJvbUV2ZW50PEZvY3VzRXZlbnQ+KGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCwgJ2ZvY3Vzb3V0Jylcblx0XHRcdFx0XHRcdC5waXBlKHRha2UoMSkpXG5cdFx0XHRcdFx0XHQuc3Vic2NyaWJlKCh7IHJlbGF0ZWRUYXJnZXQgfSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoIXRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhyZWxhdGVkVGFyZ2V0IGFzIEhUTUxFbGVtZW50KSkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBvcGVuaW5nIC8gbmF2aWdhdGluZ1xuXHRcdGlmIChpc0V2ZW50RnJvbVRvZ2dsZSB8fCBpdGVtRWxlbWVudCkge1xuXHRcdFx0dGhpcy5vcGVuKCk7XG5cblx0XHRcdGlmIChpdGVtRWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHN3aXRjaCAoa2V5KSB7XG5cdFx0XHRcdFx0Y2FzZSBLZXkuQXJyb3dEb3duOlxuXHRcdFx0XHRcdFx0cG9zaXRpb24gPSBNYXRoLm1pbihwb3NpdGlvbiArIDEsIGl0ZW1FbGVtZW50cy5sZW5ndGggLSAxKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgS2V5LkFycm93VXA6XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5faXNEcm9wdXAoKSAmJiBwb3NpdGlvbiA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0cG9zaXRpb24gPSBpdGVtRWxlbWVudHMubGVuZ3RoIC0gMTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRwb3NpdGlvbiA9IE1hdGgubWF4KHBvc2l0aW9uIC0gMSwgMCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEtleS5Ib21lOlxuXHRcdFx0XHRcdFx0cG9zaXRpb24gPSAwO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBLZXkuRW5kOlxuXHRcdFx0XHRcdFx0cG9zaXRpb24gPSBpdGVtRWxlbWVudHMubGVuZ3RoIC0gMTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGl0ZW1FbGVtZW50c1twb3NpdGlvbl0uZm9jdXMoKTtcblx0XHRcdH1cblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfaXNEcm9wdXAoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Ryb3B1cCcpO1xuXHR9XG5cblx0cHJpdmF0ZSBfaXNFdmVudEZyb21Ub2dnbGUoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcblx0XHRyZXR1cm4gdGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KTtcblx0fVxuXG5cdHByaXZhdGUgX2dldE1lbnVFbGVtZW50cygpOiBIVE1MRWxlbWVudFtdIHtcblx0XHRjb25zdCBtZW51ID0gdGhpcy5fbWVudTtcblx0XHRpZiAobWVudSA9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fVxuXHRcdHJldHVybiBtZW51Lm1lbnVJdGVtcy5maWx0ZXIoKGl0ZW0pID0+ICFpdGVtLmRpc2FibGVkKS5tYXAoKGl0ZW0pID0+IGl0ZW0uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcblx0fVxuXG5cdHByaXZhdGUgX3Bvc2l0aW9uTWVudSgpIHtcblx0XHRjb25zdCBtZW51ID0gdGhpcy5fbWVudTtcblx0XHRpZiAodGhpcy5pc09wZW4oKSAmJiBtZW51KSB7XG5cdFx0XHRpZiAodGhpcy5kaXNwbGF5ID09PSAnZHluYW1pYycpIHtcblx0XHRcdFx0dGhpcy5fcG9zaXRpb25pbmcudXBkYXRlKCk7XG5cdFx0XHRcdHRoaXMuX2FwcGx5UGxhY2VtZW50Q2xhc3NlcygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fYXBwbHlQbGFjZW1lbnRDbGFzc2VzKHRoaXMuX2dldEZpcnN0UGxhY2VtZW50KHRoaXMucGxhY2VtZW50KSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfZ2V0Rmlyc3RQbGFjZW1lbnQocGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSk6IFBsYWNlbWVudCB7XG5cdFx0cmV0dXJuIEFycmF5LmlzQXJyYXkocGxhY2VtZW50KSA/IHBsYWNlbWVudFswXSA6IChwbGFjZW1lbnQuc3BsaXQoJyAnKVswXSBhcyBQbGFjZW1lbnQpO1xuXHR9XG5cblx0cHJpdmF0ZSBfcmVzZXRDb250YWluZXIoKSB7XG5cdFx0Y29uc3QgcmVuZGVyZXIgPSB0aGlzLl9yZW5kZXJlcjtcblx0XHRpZiAodGhpcy5fbWVudSkge1xuXHRcdFx0Y29uc3QgZHJvcGRvd25FbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXHRcdFx0Y29uc3QgZHJvcGRvd25NZW51RWxlbWVudCA9IHRoaXMuX21lbnUubmF0aXZlRWxlbWVudDtcblxuXHRcdFx0cmVuZGVyZXIuYXBwZW5kQ2hpbGQoZHJvcGRvd25FbGVtZW50LCBkcm9wZG93bk1lbnVFbGVtZW50KTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuX2JvZHlDb250YWluZXIpIHtcblx0XHRcdHJlbmRlcmVyLnJlbW92ZUNoaWxkKHRoaXMuX2RvY3VtZW50LmJvZHksIHRoaXMuX2JvZHlDb250YWluZXIpO1xuXHRcdFx0dGhpcy5fYm9keUNvbnRhaW5lciA9IG51bGw7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfYXBwbHlDb250YWluZXIoY29udGFpbmVyOiBudWxsIHwgJ2JvZHknID0gbnVsbCkge1xuXHRcdHRoaXMuX3Jlc2V0Q29udGFpbmVyKCk7XG5cdFx0aWYgKGNvbnRhaW5lciA9PT0gJ2JvZHknKSB7XG5cdFx0XHRjb25zdCByZW5kZXJlciA9IHRoaXMuX3JlbmRlcmVyO1xuXHRcdFx0Y29uc3QgZHJvcGRvd25NZW51RWxlbWVudCA9IHRoaXMuX21lbnUubmF0aXZlRWxlbWVudDtcblx0XHRcdGNvbnN0IGJvZHlDb250YWluZXIgPSAodGhpcy5fYm9keUNvbnRhaW5lciA9IHRoaXMuX2JvZHlDb250YWluZXIgfHwgcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuXG5cdFx0XHQvLyBPdmVycmlkZSBzb21lIHN0eWxlcyB0byBoYXZlIHRoZSBwb3NpdGlvbmluZyB3b3JraW5nXG5cdFx0XHRyZW5kZXJlci5zZXRTdHlsZShib2R5Q29udGFpbmVyLCAncG9zaXRpb24nLCAnYWJzb2x1dGUnKTtcblx0XHRcdHJlbmRlcmVyLnNldFN0eWxlKGRyb3Bkb3duTWVudUVsZW1lbnQsICdwb3NpdGlvbicsICdzdGF0aWMnKTtcblx0XHRcdHJlbmRlcmVyLnNldFN0eWxlKGJvZHlDb250YWluZXIsICd6LWluZGV4JywgJzEwNTUnKTtcblxuXHRcdFx0cmVuZGVyZXIuYXBwZW5kQ2hpbGQoYm9keUNvbnRhaW5lciwgZHJvcGRvd25NZW51RWxlbWVudCk7XG5cdFx0XHRyZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLl9kb2N1bWVudC5ib2R5LCBib2R5Q29udGFpbmVyKTtcblx0XHR9XG5cblx0XHR0aGlzLl9hcHBseUN1c3RvbURyb3Bkb3duQ2xhc3ModGhpcy5kcm9wZG93bkNsYXNzKTtcblx0fVxuXG5cdHByaXZhdGUgX2FwcGx5Q3VzdG9tRHJvcGRvd25DbGFzcyhuZXdDbGFzczogc3RyaW5nLCBvbGRDbGFzcz86IHN0cmluZykge1xuXHRcdGNvbnN0IHRhcmdldEVsZW1lbnQgPSB0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknID8gdGhpcy5fYm9keUNvbnRhaW5lciA6IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblx0XHRpZiAodGFyZ2V0RWxlbWVudCkge1xuXHRcdFx0aWYgKG9sZENsYXNzKSB7XG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKHRhcmdldEVsZW1lbnQsIG9sZENsYXNzKTtcblx0XHRcdH1cblx0XHRcdGlmIChuZXdDbGFzcykge1xuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0YXJnZXRFbGVtZW50LCBuZXdDbGFzcyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfYXBwbHlQbGFjZW1lbnRDbGFzc2VzKHBsYWNlbWVudD86IFBsYWNlbWVudCB8IG51bGwpIHtcblx0XHRjb25zdCBtZW51ID0gdGhpcy5fbWVudTtcblx0XHRpZiAobWVudSkge1xuXHRcdFx0aWYgKCFwbGFjZW1lbnQpIHtcblx0XHRcdFx0cGxhY2VtZW50ID0gdGhpcy5fZ2V0Rmlyc3RQbGFjZW1lbnQodGhpcy5wbGFjZW1lbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCByZW5kZXJlciA9IHRoaXMuX3JlbmRlcmVyO1xuXHRcdFx0Y29uc3QgZHJvcGRvd25FbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG5cdFx0XHQvLyByZW1vdmUgdGhlIGN1cnJlbnQgcGxhY2VtZW50IGNsYXNzZXNcblx0XHRcdHJlbmRlcmVyLnJlbW92ZUNsYXNzKGRyb3Bkb3duRWxlbWVudCwgJ2Ryb3B1cCcpO1xuXHRcdFx0cmVuZGVyZXIucmVtb3ZlQ2xhc3MoZHJvcGRvd25FbGVtZW50LCAnZHJvcGRvd24nKTtcblx0XHRcdGNvbnN0IHsgbmF0aXZlRWxlbWVudCB9ID0gbWVudTtcblx0XHRcdGlmICh0aGlzLmRpc3BsYXkgPT09ICdzdGF0aWMnKSB7XG5cdFx0XHRcdG1lbnUucGxhY2VtZW50ID0gbnVsbDtcblx0XHRcdFx0cmVuZGVyZXIuc2V0QXR0cmlidXRlKG5hdGl2ZUVsZW1lbnQsICdkYXRhLWJzLXBvcHBlcicsICdzdGF0aWMnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1lbnUucGxhY2VtZW50ID0gcGxhY2VtZW50O1xuXHRcdFx0XHRyZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUobmF0aXZlRWxlbWVudCwgJ2RhdGEtYnMtcG9wcGVyJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8qXG5cdFx0XHQgKiBhcHBseSB0aGUgbmV3IHBsYWNlbWVudFxuXHRcdFx0ICogaW4gY2FzZSBvZiB0b3AgdXNlIHVwLWFycm93IG9yIGRvd24tYXJyb3cgb3RoZXJ3aXNlXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IGRyb3Bkb3duQ2xhc3MgPSBwbGFjZW1lbnQuc2VhcmNoKCdedG9wJykgIT09IC0xID8gJ2Ryb3B1cCcgOiAnZHJvcGRvd24nO1xuXHRcdFx0cmVuZGVyZXIuYWRkQ2xhc3MoZHJvcGRvd25FbGVtZW50LCBkcm9wZG93bkNsYXNzKTtcblxuXHRcdFx0Y29uc3QgYm9keUNvbnRhaW5lciA9IHRoaXMuX2JvZHlDb250YWluZXI7XG5cdFx0XHRpZiAoYm9keUNvbnRhaW5lcikge1xuXHRcdFx0XHRyZW5kZXJlci5yZW1vdmVDbGFzcyhib2R5Q29udGFpbmVyLCAnZHJvcHVwJyk7XG5cdFx0XHRcdHJlbmRlcmVyLnJlbW92ZUNsYXNzKGJvZHlDb250YWluZXIsICdkcm9wZG93bicpO1xuXHRcdFx0XHRyZW5kZXJlci5hZGRDbGFzcyhib2R5Q29udGFpbmVyLCBkcm9wZG93bkNsYXNzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbiJdfQ==