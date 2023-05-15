import { Directive, EventEmitter, forwardRef, Inject, Input, Output, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, fromEvent, of, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ngbAutoClose } from '../util/autoclose';
import { Key } from '../util/key';
import { PopupService } from '../util/popup';
import { ngbPositioning } from '../util/positioning';
import { isDefined, toString } from '../util/util';
import { NgbTypeaheadWindow } from './typeahead-window';
import { addPopperOffset } from '../util/positioning-util';
import * as i0 from "@angular/core";
import * as i1 from "./typeahead-config";
import * as i2 from "../util/accessibility/live";
let nextWindowId = 0;
/**
 * A directive providing a simple way of creating powerful typeaheads from any text input.
 */
export class NgbTypeahead {
    constructor(_elementRef, viewContainerRef, _renderer, injector, config, ngZone, _live, _document, _ngZone, _changeDetector, applicationRef) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._live = _live;
        this._document = _document;
        this._ngZone = _ngZone;
        this._changeDetector = _changeDetector;
        this._subscription = null;
        this._closed$ = new Subject();
        this._inputValueBackup = null;
        this._windowRef = null;
        /**
         * The value for the `autocomplete` attribute for the `<input>` element.
         *
         * Defaults to `"off"` to disable the native browser autocomplete, but you can override it if necessary.
         *
         * @since 2.1.0
         */
        this.autocomplete = 'off';
        /**
         * The preferred placement of the typeahead, among the [possible values](#/guides/positioning#api).
         *
         * The default order of preference is `"bottom-start bottom-end top-start top-end"`
         *
         * Please see the [positioning overview](#/positioning) for more details.
         */
        this.placement = 'bottom-start';
        /**
         * An event emitted right before an item is selected from the result list.
         *
         * Event payload is of type [`NgbTypeaheadSelectItemEvent`](#/components/typeahead/api#NgbTypeaheadSelectItemEvent).
         */
        this.selectItem = new EventEmitter();
        this.activeDescendant = null;
        this.popupId = `ngb-typeahead-${nextWindowId++}`;
        this._onTouched = () => { };
        this._onChange = (_) => { };
        this.container = config.container;
        this.editable = config.editable;
        this.focusFirst = config.focusFirst;
        this.showHint = config.showHint;
        this.placement = config.placement;
        this.popperOptions = config.popperOptions;
        this._valueChanges = fromEvent(_elementRef.nativeElement, 'input').pipe(map(($event) => $event.target.value));
        this._resubscribeTypeahead = new BehaviorSubject(null);
        this._popupService = new PopupService(NgbTypeaheadWindow, injector, viewContainerRef, _renderer, this._ngZone, applicationRef);
        this._positioning = ngbPositioning();
    }
    ngOnInit() {
        this._subscribeToUserInput();
    }
    ngOnChanges({ ngbTypeahead }) {
        if (ngbTypeahead && !ngbTypeahead.firstChange) {
            this._unsubscribeFromUserInput();
            this._subscribeToUserInput();
        }
    }
    ngOnDestroy() {
        this._closePopup();
        this._unsubscribeFromUserInput();
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    writeValue(value) {
        this._writeInputValue(this._formatItemForInput(value));
        if (this.showHint) {
            this._inputValueBackup = value;
        }
    }
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    /**
     * Dismisses typeahead popup window
     */
    dismissPopup() {
        if (this.isPopupOpen()) {
            this._resubscribeTypeahead.next(null);
            this._closePopup();
            if (this.showHint && this._inputValueBackup !== null) {
                this._writeInputValue(this._inputValueBackup);
            }
            this._changeDetector.markForCheck();
        }
    }
    /**
     * Returns true if the typeahead popup window is displayed
     */
    isPopupOpen() {
        return this._windowRef != null;
    }
    handleBlur() {
        this._resubscribeTypeahead.next(null);
        this._onTouched();
    }
    handleKeyDown(event) {
        if (!this.isPopupOpen()) {
            return;
        }
        /* eslint-disable-next-line deprecation/deprecation */
        switch (event.which) {
            case Key.ArrowDown:
                event.preventDefault();
                this._windowRef.instance.next();
                this._showHint();
                break;
            case Key.ArrowUp:
                event.preventDefault();
                this._windowRef.instance.prev();
                this._showHint();
                break;
            case Key.Enter:
            case Key.Tab: {
                const result = this._windowRef.instance.getActive();
                if (isDefined(result)) {
                    event.preventDefault();
                    event.stopPropagation();
                    this._selectResult(result);
                }
                this._closePopup();
                break;
            }
        }
    }
    _openPopup() {
        if (!this.isPopupOpen()) {
            this._inputValueBackup = this._elementRef.nativeElement.value;
            const { windowRef } = this._popupService.open();
            this._windowRef = windowRef;
            this._windowRef.setInput('id', this.popupId);
            this._windowRef.setInput('popupClass', this.popupClass);
            this._windowRef.instance.selectEvent.subscribe((result) => this._selectResultClosePopup(result));
            this._windowRef.instance.activeChangeEvent.subscribe((activeId) => (this.activeDescendant = activeId));
            if (this.container === 'body') {
                this._renderer.setStyle(this._windowRef.location.nativeElement, 'z-index', '1055');
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            this._changeDetector.markForCheck();
            // Setting up popper and scheduling updates when zone is stable
            this._ngZone.runOutsideAngular(() => {
                if (this._windowRef) {
                    this._positioning.createPopper({
                        hostElement: this._elementRef.nativeElement,
                        targetElement: this._windowRef.location.nativeElement,
                        placement: this.placement,
                        appendToBody: this.container === 'body',
                        updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 2])(options)),
                    });
                    this._zoneSubscription = this._ngZone.onStable.subscribe(() => this._positioning.update());
                }
            });
            ngbAutoClose(this._ngZone, this._document, 'outside', () => this.dismissPopup(), this._closed$, [
                this._elementRef.nativeElement,
                this._windowRef.location.nativeElement,
            ]);
        }
    }
    _closePopup() {
        this._popupService.close().subscribe(() => {
            this._positioning.destroy();
            this._zoneSubscription?.unsubscribe();
            this._closed$.next();
            this._windowRef = null;
            this.activeDescendant = null;
        });
    }
    _selectResult(result) {
        let defaultPrevented = false;
        this.selectItem.emit({
            item: result,
            preventDefault: () => {
                defaultPrevented = true;
            },
        });
        this._resubscribeTypeahead.next(null);
        if (!defaultPrevented) {
            this.writeValue(result);
            this._onChange(result);
        }
    }
    _selectResultClosePopup(result) {
        this._selectResult(result);
        this._closePopup();
    }
    _showHint() {
        if (this.showHint && this._windowRef?.instance.hasActive() && this._inputValueBackup != null) {
            const userInputLowerCase = this._inputValueBackup.toLowerCase();
            const formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());
            if (userInputLowerCase === formattedVal.substring(0, this._inputValueBackup.length).toLowerCase()) {
                this._writeInputValue(this._inputValueBackup + formattedVal.substring(this._inputValueBackup.length));
                this._elementRef.nativeElement['setSelectionRange'].apply(this._elementRef.nativeElement, [
                    this._inputValueBackup.length,
                    formattedVal.length,
                ]);
            }
            else {
                this._writeInputValue(formattedVal);
            }
        }
    }
    _formatItemForInput(item) {
        return item != null && this.inputFormatter ? this.inputFormatter(item) : toString(item);
    }
    _writeInputValue(value) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', toString(value));
    }
    _subscribeToUserInput() {
        const results$ = this._valueChanges.pipe(tap((value) => {
            this._inputValueBackup = this.showHint ? value : null;
            this._onChange(this.editable ? value : undefined);
        }), this.ngbTypeahead ? this.ngbTypeahead : () => of([]));
        this._subscription = this._resubscribeTypeahead.pipe(switchMap(() => results$)).subscribe((results) => {
            if (!results || results.length === 0) {
                this._closePopup();
            }
            else {
                this._openPopup();
                this._windowRef.instance.focusFirst = this.focusFirst;
                this._windowRef.instance.results = results;
                this._windowRef.instance.term = this._elementRef.nativeElement.value;
                if (this.resultFormatter) {
                    this._windowRef.instance.formatter = this.resultFormatter;
                }
                if (this.resultTemplate) {
                    this._windowRef.instance.resultTemplate = this.resultTemplate;
                }
                this._windowRef.instance.resetActive();
                // The observable stream we are subscribing to might have async steps
                // and if a component containing typeahead is using the OnPush strategy
                // the change detection turn wouldn't be invoked automatically.
                this._windowRef.changeDetectorRef.detectChanges();
                this._showHint();
            }
            // live announcer
            const count = results ? results.length : 0;
            this._live.say(count === 0 ? 'No results available' : `${count} result${count === 1 ? '' : 's'} available`);
        });
    }
    _unsubscribeFromUserInput() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._subscription = null;
    }
}
NgbTypeahead.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbTypeahead, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }, { token: i0.Injector }, { token: i1.NgbTypeaheadConfig }, { token: i0.NgZone }, { token: i2.Live }, { token: DOCUMENT }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.ApplicationRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbTypeahead.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbTypeahead, isStandalone: true, selector: "input[ngbTypeahead]", inputs: { autocomplete: "autocomplete", container: "container", editable: "editable", focusFirst: "focusFirst", inputFormatter: "inputFormatter", ngbTypeahead: "ngbTypeahead", resultFormatter: "resultFormatter", resultTemplate: "resultTemplate", showHint: "showHint", placement: "placement", popperOptions: "popperOptions", popupClass: "popupClass" }, outputs: { selectItem: "selectItem" }, host: { attributes: { "autocapitalize": "off", "autocorrect": "off", "role": "combobox" }, listeners: { "blur": "handleBlur()", "keydown": "handleKeyDown($event)" }, properties: { "class.open": "isPopupOpen()", "autocomplete": "autocomplete", "attr.aria-autocomplete": "showHint ? \"both\" : \"list\"", "attr.aria-activedescendant": "activeDescendant", "attr.aria-owns": "isPopupOpen() ? popupId : null", "attr.aria-expanded": "isPopupOpen()" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbTypeahead), multi: true }], exportAs: ["ngbTypeahead"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbTypeahead, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[ngbTypeahead]',
                    exportAs: 'ngbTypeahead',
                    standalone: true,
                    host: {
                        '(blur)': 'handleBlur()',
                        '[class.open]': 'isPopupOpen()',
                        '(keydown)': 'handleKeyDown($event)',
                        '[autocomplete]': 'autocomplete',
                        autocapitalize: 'off',
                        autocorrect: 'off',
                        role: 'combobox',
                        '[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
                        '[attr.aria-activedescendant]': 'activeDescendant',
                        '[attr.aria-owns]': 'isPopupOpen() ? popupId : null',
                        '[attr.aria-expanded]': 'isPopupOpen()',
                    },
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbTypeahead), multi: true }],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }, { type: i0.Injector }, { type: i1.NgbTypeaheadConfig }, { type: i0.NgZone }, { type: i2.Live }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.ApplicationRef }]; }, propDecorators: { autocomplete: [{
                type: Input
            }], container: [{
                type: Input
            }], editable: [{
                type: Input
            }], focusFirst: [{
                type: Input
            }], inputFormatter: [{
                type: Input
            }], ngbTypeahead: [{
                type: Input
            }], resultFormatter: [{
                type: Input
            }], resultTemplate: [{
                type: Input
            }], showHint: [{
                type: Input
            }], placement: [{
                type: Input
            }], popperOptions: [{
                type: Input
            }], popupClass: [{
                type: Input
            }], selectItem: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWFoZWFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3R5cGVhaGVhZC90eXBlYWhlYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUlOLFNBQVMsRUFFVCxZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFFTixLQUFLLEVBS0wsTUFBTSxHQUtOLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQWMsRUFBRSxFQUFvQixPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQzNHLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0MsT0FBTyxFQUFFLGNBQWMsRUFBa0IsTUFBTSxxQkFBcUIsQ0FBQztBQUVyRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUduRCxPQUFPLEVBQUUsa0JBQWtCLEVBQXlCLE1BQU0sb0JBQW9CLENBQUM7QUFDL0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7O0FBaUIzRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckI7O0dBRUc7QUFvQkgsTUFBTSxPQUFPLFlBQVk7SUEwSHhCLFlBQ1MsV0FBeUMsRUFDakQsZ0JBQWtDLEVBQzFCLFNBQW9CLEVBQzVCLFFBQWtCLEVBQ2xCLE1BQTBCLEVBQzFCLE1BQWMsRUFD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QkFDeEQsOEJBQThCLEVBQUUsa0JBQWtCO3dCQUNsRCxrQkFBa0IsRUFBRSxnQ0FBZ0M7d0JBQ3BELHNCQUFzQixFQUFFLGVBQWU7cUJBQ3ZDO29CQUNELFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztpQkFDckc7OzBCQW1JRSxNQUFNOzJCQUFDLFFBQVE7OEhBaEhSLFlBQVk7c0JBQXBCLEtBQUs7Z0JBT0csU0FBUztzQkFBakIsS0FBSztnQkFLRyxRQUFRO3NCQUFoQixLQUFLO2dCQUtHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBUUcsY0FBYztzQkFBdEIsS0FBSztnQkFhRyxZQUFZO3NCQUFwQixLQUFLO2dCQVNHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBU0csY0FBYztzQkFBdEIsS0FBSztnQkFLRyxRQUFRO3NCQUFoQixLQUFLO2dCQVNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBUUcsYUFBYTtzQkFBckIsS0FBSztnQkFXRyxVQUFVO3NCQUFsQixLQUFLO2dCQU9JLFVBQVU7c0JBQW5CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRBcHBsaWNhdGlvblJlZixcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbXBvbmVudFJlZixcblx0RGlyZWN0aXZlLFxuXHRFbGVtZW50UmVmLFxuXHRFdmVudEVtaXR0ZXIsXG5cdGZvcndhcmRSZWYsXG5cdEluamVjdCxcblx0SW5qZWN0b3IsXG5cdElucHV0LFxuXHROZ1pvbmUsXG5cdE9uQ2hhbmdlcyxcblx0T25EZXN0cm95LFxuXHRPbkluaXQsXG5cdE91dHB1dCxcblx0UmVuZGVyZXIyLFxuXHRTaW1wbGVDaGFuZ2VzLFxuXHRUZW1wbGF0ZVJlZixcblx0Vmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGZyb21FdmVudCwgT2JzZXJ2YWJsZSwgb2YsIE9wZXJhdG9yRnVuY3Rpb24sIFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBzd2l0Y2hNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgTGl2ZSB9IGZyb20gJy4uL3V0aWwvYWNjZXNzaWJpbGl0eS9saXZlJztcbmltcG9ydCB7IG5nYkF1dG9DbG9zZSB9IGZyb20gJy4uL3V0aWwvYXV0b2Nsb3NlJztcbmltcG9ydCB7IEtleSB9IGZyb20gJy4uL3V0aWwva2V5JztcbmltcG9ydCB7IFBvcHVwU2VydmljZSB9IGZyb20gJy4uL3V0aWwvcG9wdXAnO1xuaW1wb3J0IHsgbmdiUG9zaXRpb25pbmcsIFBsYWNlbWVudEFycmF5IH0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnQHBvcHBlcmpzL2NvcmUnO1xuaW1wb3J0IHsgaXNEZWZpbmVkLCB0b1N0cmluZyB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmltcG9ydCB7IE5nYlR5cGVhaGVhZENvbmZpZyB9IGZyb20gJy4vdHlwZWFoZWFkLWNvbmZpZyc7XG5pbXBvcnQgeyBOZ2JUeXBlYWhlYWRXaW5kb3csIFJlc3VsdFRlbXBsYXRlQ29udGV4dCB9IGZyb20gJy4vdHlwZWFoZWFkLXdpbmRvdyc7XG5pbXBvcnQgeyBhZGRQb3BwZXJPZmZzZXQgfSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nLXV0aWwnO1xuXG4vKipcbiAqIEFuIGV2ZW50IGVtaXR0ZWQgcmlnaHQgYmVmb3JlIGFuIGl0ZW0gaXMgc2VsZWN0ZWQgZnJvbSB0aGUgcmVzdWx0IGxpc3QuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50PFQgPSBhbnk+IHtcblx0LyoqXG5cdCAqIFRoZSBpdGVtIGZyb20gdGhlIHJlc3VsdCBsaXN0IGFib3V0IHRvIGJlIHNlbGVjdGVkLlxuXHQgKi9cblx0aXRlbTogVDtcblxuXHQvKipcblx0ICogQ2FsbGluZyB0aGlzIGZ1bmN0aW9uIHdpbGwgcHJldmVudCBpdGVtIHNlbGVjdGlvbiBmcm9tIGhhcHBlbmluZy5cblx0ICovXG5cdHByZXZlbnREZWZhdWx0OiAoKSA9PiB2b2lkO1xufVxuXG5sZXQgbmV4dFdpbmRvd0lkID0gMDtcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSBwcm92aWRpbmcgYSBzaW1wbGUgd2F5IG9mIGNyZWF0aW5nIHBvd2VyZnVsIHR5cGVhaGVhZHMgZnJvbSBhbnkgdGV4dCBpbnB1dC5cbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnaW5wdXRbbmdiVHlwZWFoZWFkXScsXG5cdGV4cG9ydEFzOiAnbmdiVHlwZWFoZWFkJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDoge1xuXHRcdCcoYmx1ciknOiAnaGFuZGxlQmx1cigpJyxcblx0XHQnW2NsYXNzLm9wZW5dJzogJ2lzUG9wdXBPcGVuKCknLFxuXHRcdCcoa2V5ZG93biknOiAnaGFuZGxlS2V5RG93bigkZXZlbnQpJyxcblx0XHQnW2F1dG9jb21wbGV0ZV0nOiAnYXV0b2NvbXBsZXRlJyxcblx0XHRhdXRvY2FwaXRhbGl6ZTogJ29mZicsXG5cdFx0YXV0b2NvcnJlY3Q6ICdvZmYnLFxuXHRcdHJvbGU6ICdjb21ib2JveCcsXG5cdFx0J1thdHRyLmFyaWEtYXV0b2NvbXBsZXRlXSc6ICdzaG93SGludCA/IFwiYm90aFwiIDogXCJsaXN0XCInLFxuXHRcdCdbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdJzogJ2FjdGl2ZURlc2NlbmRhbnQnLFxuXHRcdCdbYXR0ci5hcmlhLW93bnNdJzogJ2lzUG9wdXBPcGVuKCkgPyBwb3B1cElkIDogbnVsbCcsXG5cdFx0J1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2lzUG9wdXBPcGVuKCknLFxuXHR9LFxuXHRwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JUeXBlYWhlYWQpLCBtdWx0aTogdHJ1ZSB9XSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiVHlwZWFoZWFkIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXHRwcml2YXRlIF9wb3B1cFNlcnZpY2U6IFBvcHVwU2VydmljZTxOZ2JUeXBlYWhlYWRXaW5kb3c+O1xuXHRwcml2YXRlIF9zdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGwgPSBudWxsO1xuXHRwcml2YXRlIF9jbG9zZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblx0cHJpdmF0ZSBfaW5wdXRWYWx1ZUJhY2t1cDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cdHByaXZhdGUgX3ZhbHVlQ2hhbmdlczogT2JzZXJ2YWJsZTxzdHJpbmc+O1xuXHRwcml2YXRlIF9yZXN1YnNjcmliZVR5cGVhaGVhZDogQmVoYXZpb3JTdWJqZWN0PGFueT47XG5cdHByaXZhdGUgX3dpbmRvd1JlZjogQ29tcG9uZW50UmVmPE5nYlR5cGVhaGVhZFdpbmRvdz4gfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBfem9uZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXHRwcml2YXRlIF9wb3NpdGlvbmluZzogUmV0dXJuVHlwZTx0eXBlb2YgbmdiUG9zaXRpb25pbmc+O1xuXG5cdC8qKlxuXHQgKiBUaGUgdmFsdWUgZm9yIHRoZSBgYXV0b2NvbXBsZXRlYCBhdHRyaWJ1dGUgZm9yIHRoZSBgPGlucHV0PmAgZWxlbWVudC5cblx0ICpcblx0ICogRGVmYXVsdHMgdG8gYFwib2ZmXCJgIHRvIGRpc2FibGUgdGhlIG5hdGl2ZSBicm93c2VyIGF1dG9jb21wbGV0ZSwgYnV0IHlvdSBjYW4gb3ZlcnJpZGUgaXQgaWYgbmVjZXNzYXJ5LlxuXHQgKlxuXHQgKiBAc2luY2UgMi4xLjBcblx0ICovXG5cdEBJbnB1dCgpIGF1dG9jb21wbGV0ZSA9ICdvZmYnO1xuXG5cdC8qKlxuXHQgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIHR5cGVhaGVhZCBwb3B1cCB3aWxsIGJlIGFwcGVuZGVkIHRvLlxuXHQgKlxuXHQgKiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyBgXCJib2R5XCJgLlxuXHQgKi9cblx0QElucHV0KCkgY29udGFpbmVyOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgbW9kZWwgdmFsdWVzIHdpbGwgbm90IGJlIHJlc3RyaWN0ZWQgb25seSB0byBpdGVtcyBzZWxlY3RlZCBmcm9tIHRoZSBwb3B1cC5cblx0ICovXG5cdEBJbnB1dCgpIGVkaXRhYmxlOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHRoZSBmaXJzdCBpdGVtIGluIHRoZSByZXN1bHQgbGlzdCB3aWxsIGFsd2F5cyBzdGF5IGZvY3VzZWQgd2hpbGUgdHlwaW5nLlxuXHQgKi9cblx0QElucHV0KCkgZm9jdXNGaXJzdDogYm9vbGVhbjtcblxuXHQvKipcblx0ICogVGhlIGZ1bmN0aW9uIHRoYXQgY29udmVydHMgYW4gaXRlbSBmcm9tIHRoZSByZXN1bHQgbGlzdCB0byBhIGBzdHJpbmdgIHRvIGRpc3BsYXkgaW4gdGhlIGA8aW5wdXQ+YCBmaWVsZC5cblx0ICpcblx0ICogSXQgaXMgY2FsbGVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBzb21ldGhpbmcgaW4gdGhlIHBvcHVwIG9yIHRoZSBtb2RlbCB2YWx1ZSBjaGFuZ2VzLCBzbyB0aGUgaW5wdXQgbmVlZHMgdG9cblx0ICogYmUgdXBkYXRlZC5cblx0ICovXG5cdEBJbnB1dCgpIGlucHV0Rm9ybWF0dGVyOiAoaXRlbTogYW55KSA9PiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGEgc3RyZWFtIG9mIHRleHQgdmFsdWVzIGZyb20gdGhlIGA8aW5wdXQ+YCBlbGVtZW50IHRvIHRoZSBzdHJlYW0gb2YgdGhlIGFycmF5IG9mIGl0ZW1zXG5cdCAqIHRvIGRpc3BsYXkgaW4gdGhlIHR5cGVhaGVhZCBwb3B1cC5cblx0ICpcblx0ICogSWYgdGhlIHJlc3VsdGluZyBvYnNlcnZhYmxlIGVtaXRzIGEgbm9uLWVtcHR5IGFycmF5IC0gdGhlIHBvcHVwIHdpbGwgYmUgc2hvd24uIElmIGl0IGVtaXRzIGFuIGVtcHR5IGFycmF5IC0gdGhlXG5cdCAqIHBvcHVwIHdpbGwgYmUgY2xvc2VkLlxuXHQgKlxuXHQgKiBTZWUgdGhlIFtiYXNpYyBleGFtcGxlXSgjL2NvbXBvbmVudHMvdHlwZWFoZWFkL2V4YW1wbGVzI2Jhc2ljKSBmb3IgbW9yZSBkZXRhaWxzLlxuXHQgKlxuXHQgKiBOb3RlIHRoYXQgdGhlIGB0aGlzYCBhcmd1bWVudCBpcyBgdW5kZWZpbmVkYCBzbyB5b3UgbmVlZCB0byBleHBsaWNpdGx5IGJpbmQgaXQgdG8gYSBkZXNpcmVkIFwidGhpc1wiIHRhcmdldC5cblx0ICovXG5cdEBJbnB1dCgpIG5nYlR5cGVhaGVhZDogT3BlcmF0b3JGdW5jdGlvbjxzdHJpbmcsIHJlYWRvbmx5IGFueVtdPiB8IG51bGwgfCB1bmRlZmluZWQ7XG5cblx0LyoqXG5cdCAqIFRoZSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGFuIGl0ZW0gZnJvbSB0aGUgcmVzdWx0IGxpc3QgdG8gYSBgc3RyaW5nYCB0byBkaXNwbGF5IGluIHRoZSBwb3B1cC5cblx0ICpcblx0ICogTXVzdCBiZSBwcm92aWRlZCwgaWYgeW91ciBgbmdiVHlwZWFoZWFkYCByZXR1cm5zIHNvbWV0aGluZyBvdGhlciB0aGFuIGBPYnNlcnZhYmxlPHN0cmluZ1tdPmAuXG5cdCAqXG5cdCAqIEFsdGVybmF0aXZlbHkgZm9yIG1vcmUgY29tcGxleCBtYXJrdXAgaW4gdGhlIHBvcHVwIHlvdSBzaG91bGQgdXNlIGByZXN1bHRUZW1wbGF0ZWAuXG5cdCAqL1xuXHRASW5wdXQoKSByZXN1bHRGb3JtYXR0ZXI6IChpdGVtOiBhbnkpID0+IHN0cmluZztcblxuXHQvKipcblx0ICogVGhlIHRlbXBsYXRlIHRvIG92ZXJyaWRlIHRoZSB3YXkgcmVzdWx0aW5nIGl0ZW1zIGFyZSBkaXNwbGF5ZWQgaW4gdGhlIHBvcHVwLlxuXHQgKlxuXHQgKiBTZWUgdGhlIFtSZXN1bHRUZW1wbGF0ZUNvbnRleHRdKCMvY29tcG9uZW50cy90eXBlYWhlYWQvYXBpI1Jlc3VsdFRlbXBsYXRlQ29udGV4dCkgZm9yIHRoZSB0ZW1wbGF0ZSBjb250ZXh0LlxuXHQgKlxuXHQgKiBBbHNvIHNlZSB0aGUgW3RlbXBsYXRlIGZvciByZXN1bHRzIGRlbW9dKCMvY29tcG9uZW50cy90eXBlYWhlYWQvZXhhbXBsZXMjdGVtcGxhdGUpIGZvciBtb3JlIGRldGFpbHMuXG5cdCAqL1xuXHRASW5wdXQoKSByZXN1bHRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8UmVzdWx0VGVtcGxhdGVDb250ZXh0PjtcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB3aWxsIHNob3cgdGhlIGhpbnQgaW4gdGhlIGA8aW5wdXQ+YCB3aGVuIGFuIGl0ZW0gaW4gdGhlIHJlc3VsdCBsaXN0IG1hdGNoZXMuXG5cdCAqL1xuXHRASW5wdXQoKSBzaG93SGludDogYm9vbGVhbjtcblxuXHQvKipcblx0ICogVGhlIHByZWZlcnJlZCBwbGFjZW1lbnQgb2YgdGhlIHR5cGVhaGVhZCwgYW1vbmcgdGhlIFtwb3NzaWJsZSB2YWx1ZXNdKCMvZ3VpZGVzL3Bvc2l0aW9uaW5nI2FwaSkuXG5cdCAqXG5cdCAqIFRoZSBkZWZhdWx0IG9yZGVyIG9mIHByZWZlcmVuY2UgaXMgYFwiYm90dG9tLXN0YXJ0IGJvdHRvbS1lbmQgdG9wLXN0YXJ0IHRvcC1lbmRcImBcblx0ICpcblx0ICogUGxlYXNlIHNlZSB0aGUgW3Bvc2l0aW9uaW5nIG92ZXJ2aWV3XSgjL3Bvc2l0aW9uaW5nKSBmb3IgbW9yZSBkZXRhaWxzLlxuXHQgKi9cblx0QElucHV0KCkgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9ICdib3R0b20tc3RhcnQnO1xuXG5cdC8qKlxuXHQgKiBBbGxvd3MgdG8gY2hhbmdlIGRlZmF1bHQgUG9wcGVyIG9wdGlvbnMgd2hlbiBwb3NpdGlvbmluZyB0aGUgdHlwZWFoZWFkLlxuXHQgKiBSZWNlaXZlcyBjdXJyZW50IHBvcHBlciBvcHRpb25zIGFuZCByZXR1cm5zIG1vZGlmaWVkIG9uZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxMy4xLjBcblx0ICovXG5cdEBJbnB1dCgpIHBvcHBlck9wdGlvbnM6IChvcHRpb25zOiBQYXJ0aWFsPE9wdGlvbnM+KSA9PiBQYXJ0aWFsPE9wdGlvbnM+O1xuXG5cdC8qKlxuXHQgKiBBIGN1c3RvbSBjbGFzcyB0byBhcHBlbmQgdG8gdGhlIHR5cGVhaGVhZCBwb3B1cCB3aW5kb3dcblx0ICpcblx0ICogQWNjZXB0cyBhIHN0cmluZyBjb250YWluaW5nIENTUyBjbGFzcyB0byBiZSBhcHBsaWVkIG9uIHRoZSBgbmdiLXR5cGVhaGVhZC13aW5kb3dgLlxuXHQgKlxuXHQgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgaW5zdGFuY2Utc3BlY2lmaWMgc3R5bGluZywgZXguIHlvdSBjYW4gb3ZlcnJpZGUgcG9wdXAgd2luZG93IGB6LWluZGV4YFxuXHQgKlxuXHQgKiBAc2luY2UgOS4xLjBcblx0ICovXG5cdEBJbnB1dCgpIHBvcHVwQ2xhc3M6IHN0cmluZztcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgYW4gaXRlbSBpcyBzZWxlY3RlZCBmcm9tIHRoZSByZXN1bHQgbGlzdC5cblx0ICpcblx0ICogRXZlbnQgcGF5bG9hZCBpcyBvZiB0eXBlIFtgTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50YF0oIy9jb21wb25lbnRzL3R5cGVhaGVhZC9hcGkjTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50KS5cblx0ICovXG5cdEBPdXRwdXQoKSBzZWxlY3RJdGVtID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JUeXBlYWhlYWRTZWxlY3RJdGVtRXZlbnQ+KCk7XG5cblx0YWN0aXZlRGVzY2VuZGFudDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cdHBvcHVwSWQgPSBgbmdiLXR5cGVhaGVhZC0ke25leHRXaW5kb3dJZCsrfWA7XG5cblx0cHJpdmF0ZSBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cdHByaXZhdGUgX29uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50Pixcblx0XHR2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuXHRcdHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG5cdFx0aW5qZWN0b3I6IEluamVjdG9yLFxuXHRcdGNvbmZpZzogTmdiVHlwZWFoZWFkQ29uZmlnLFxuXHRcdG5nWm9uZTogTmdab25lLFxuXHRcdHByaXZhdGUgX2xpdmU6IExpdmUsXG5cdFx0QEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcblx0XHRwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcblx0XHRwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG5cdFx0YXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmLFxuXHQpIHtcblx0XHR0aGlzLmNvbnRhaW5lciA9IGNvbmZpZy5jb250YWluZXI7XG5cdFx0dGhpcy5lZGl0YWJsZSA9IGNvbmZpZy5lZGl0YWJsZTtcblx0XHR0aGlzLmZvY3VzRmlyc3QgPSBjb25maWcuZm9jdXNGaXJzdDtcblx0XHR0aGlzLnNob3dIaW50ID0gY29uZmlnLnNob3dIaW50O1xuXHRcdHRoaXMucGxhY2VtZW50ID0gY29uZmlnLnBsYWNlbWVudDtcblx0XHR0aGlzLnBvcHBlck9wdGlvbnMgPSBjb25maWcucG9wcGVyT3B0aW9ucztcblxuXHRcdHRoaXMuX3ZhbHVlQ2hhbmdlcyA9IGZyb21FdmVudDxFdmVudD4oX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2lucHV0JykucGlwZShcblx0XHRcdG1hcCgoJGV2ZW50KSA9PiAoJGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSksXG5cdFx0KTtcblxuXHRcdHRoaXMuX3Jlc3Vic2NyaWJlVHlwZWFoZWFkID0gbmV3IEJlaGF2aW9yU3ViamVjdChudWxsKTtcblxuXHRcdHRoaXMuX3BvcHVwU2VydmljZSA9IG5ldyBQb3B1cFNlcnZpY2U8TmdiVHlwZWFoZWFkV2luZG93Pihcblx0XHRcdE5nYlR5cGVhaGVhZFdpbmRvdyxcblx0XHRcdGluamVjdG9yLFxuXHRcdFx0dmlld0NvbnRhaW5lclJlZixcblx0XHRcdF9yZW5kZXJlcixcblx0XHRcdHRoaXMuX25nWm9uZSxcblx0XHRcdGFwcGxpY2F0aW9uUmVmLFxuXHRcdCk7XG5cdFx0dGhpcy5fcG9zaXRpb25pbmcgPSBuZ2JQb3NpdGlvbmluZygpO1xuXHR9XG5cblx0bmdPbkluaXQoKTogdm9pZCB7XG5cdFx0dGhpcy5fc3Vic2NyaWJlVG9Vc2VySW5wdXQoKTtcblx0fVxuXG5cdG5nT25DaGFuZ2VzKHsgbmdiVHlwZWFoZWFkIH06IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcblx0XHRpZiAobmdiVHlwZWFoZWFkICYmICFuZ2JUeXBlYWhlYWQuZmlyc3RDaGFuZ2UpIHtcblx0XHRcdHRoaXMuX3Vuc3Vic2NyaWJlRnJvbVVzZXJJbnB1dCgpO1xuXHRcdFx0dGhpcy5fc3Vic2NyaWJlVG9Vc2VySW5wdXQoKTtcblx0XHR9XG5cdH1cblxuXHRuZ09uRGVzdHJveSgpOiB2b2lkIHtcblx0XHR0aGlzLl9jbG9zZVBvcHVwKCk7XG5cdFx0dGhpcy5fdW5zdWJzY3JpYmVGcm9tVXNlcklucHV0KCk7XG5cdH1cblxuXHRyZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7XG5cdFx0dGhpcy5fb25DaGFuZ2UgPSBmbjtcblx0fVxuXG5cdHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHtcblx0XHR0aGlzLl9vblRvdWNoZWQgPSBmbjtcblx0fVxuXG5cdHdyaXRlVmFsdWUodmFsdWUpIHtcblx0XHR0aGlzLl93cml0ZUlucHV0VmFsdWUodGhpcy5fZm9ybWF0SXRlbUZvcklucHV0KHZhbHVlKSk7XG5cdFx0aWYgKHRoaXMuc2hvd0hpbnQpIHtcblx0XHRcdHRoaXMuX2lucHV0VmFsdWVCYWNrdXAgPSB2YWx1ZTtcblx0XHR9XG5cdH1cblxuXHRzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERpc21pc3NlcyB0eXBlYWhlYWQgcG9wdXAgd2luZG93XG5cdCAqL1xuXHRkaXNtaXNzUG9wdXAoKSB7XG5cdFx0aWYgKHRoaXMuaXNQb3B1cE9wZW4oKSkge1xuXHRcdFx0dGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQubmV4dChudWxsKTtcblx0XHRcdHRoaXMuX2Nsb3NlUG9wdXAoKTtcblx0XHRcdGlmICh0aGlzLnNob3dIaW50ICYmIHRoaXMuX2lucHV0VmFsdWVCYWNrdXAgIT09IG51bGwpIHtcblx0XHRcdFx0dGhpcy5fd3JpdGVJbnB1dFZhbHVlKHRoaXMuX2lucHV0VmFsdWVCYWNrdXApO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHlwZWFoZWFkIHBvcHVwIHdpbmRvdyBpcyBkaXNwbGF5ZWRcblx0ICovXG5cdGlzUG9wdXBPcGVuKCkge1xuXHRcdHJldHVybiB0aGlzLl93aW5kb3dSZWYgIT0gbnVsbDtcblx0fVxuXG5cdGhhbmRsZUJsdXIoKSB7XG5cdFx0dGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQubmV4dChudWxsKTtcblx0XHR0aGlzLl9vblRvdWNoZWQoKTtcblx0fVxuXG5cdGhhbmRsZUtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcblx0XHRpZiAoIXRoaXMuaXNQb3B1cE9wZW4oKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbiAqL1xuXHRcdHN3aXRjaCAoZXZlbnQud2hpY2gpIHtcblx0XHRcdGNhc2UgS2V5LkFycm93RG93bjpcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy5fd2luZG93UmVmIS5pbnN0YW5jZS5uZXh0KCk7XG5cdFx0XHRcdHRoaXMuX3Nob3dIaW50KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBLZXkuQXJyb3dVcDpcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy5fd2luZG93UmVmIS5pbnN0YW5jZS5wcmV2KCk7XG5cdFx0XHRcdHRoaXMuX3Nob3dIaW50KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBLZXkuRW50ZXI6XG5cdFx0XHRjYXNlIEtleS5UYWI6IHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdGhpcy5fd2luZG93UmVmIS5pbnN0YW5jZS5nZXRBY3RpdmUoKTtcblx0XHRcdFx0aWYgKGlzRGVmaW5lZChyZXN1bHQpKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHR0aGlzLl9zZWxlY3RSZXN1bHQocmVzdWx0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9jbG9zZVBvcHVwKCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX29wZW5Qb3B1cCgpIHtcblx0XHRpZiAoIXRoaXMuaXNQb3B1cE9wZW4oKSkge1xuXHRcdFx0dGhpcy5faW5wdXRWYWx1ZUJhY2t1cCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZTtcblx0XHRcdGNvbnN0IHsgd2luZG93UmVmIH0gPSB0aGlzLl9wb3B1cFNlcnZpY2Uub3BlbigpO1xuXHRcdFx0dGhpcy5fd2luZG93UmVmID0gd2luZG93UmVmO1xuXHRcdFx0dGhpcy5fd2luZG93UmVmLnNldElucHV0KCdpZCcsIHRoaXMucG9wdXBJZCk7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYuc2V0SW5wdXQoJ3BvcHVwQ2xhc3MnLCB0aGlzLnBvcHVwQ2xhc3MpO1xuXHRcdFx0dGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnNlbGVjdEV2ZW50LnN1YnNjcmliZSgocmVzdWx0OiBhbnkpID0+IHRoaXMuX3NlbGVjdFJlc3VsdENsb3NlUG9wdXAocmVzdWx0KSk7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuYWN0aXZlQ2hhbmdlRXZlbnQuc3Vic2NyaWJlKChhY3RpdmVJZDogc3RyaW5nKSA9PiAodGhpcy5hY3RpdmVEZXNjZW5kYW50ID0gYWN0aXZlSWQpKTtcblxuXHRcdFx0aWYgKHRoaXMuY29udGFpbmVyID09PSAnYm9keScpIHtcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgJzEwNTUnKTtcblx0XHRcdFx0dGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmNvbnRhaW5lcikuYXBwZW5kQ2hpbGQodGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcblxuXHRcdFx0Ly8gU2V0dGluZyB1cCBwb3BwZXIgYW5kIHNjaGVkdWxpbmcgdXBkYXRlcyB3aGVuIHpvbmUgaXMgc3RhYmxlXG5cdFx0XHR0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5fd2luZG93UmVmKSB7XG5cdFx0XHRcdFx0dGhpcy5fcG9zaXRpb25pbmcuY3JlYXRlUG9wcGVyKHtcblx0XHRcdFx0XHRcdGhvc3RFbGVtZW50OiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdFx0XHR0YXJnZXRFbGVtZW50OiB0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XHRcdHBsYWNlbWVudDogdGhpcy5wbGFjZW1lbnQsXG5cdFx0XHRcdFx0XHRhcHBlbmRUb0JvZHk6IHRoaXMuY29udGFpbmVyID09PSAnYm9keScsXG5cdFx0XHRcdFx0XHR1cGRhdGVQb3BwZXJPcHRpb25zOiAob3B0aW9ucykgPT4gdGhpcy5wb3BwZXJPcHRpb25zKGFkZFBvcHBlck9mZnNldChbMCwgMl0pKG9wdGlvbnMpKSxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHRoaXMuX3pvbmVTdWJzY3JpcHRpb24gPSB0aGlzLl9uZ1pvbmUub25TdGFibGUuc3Vic2NyaWJlKCgpID0+IHRoaXMuX3Bvc2l0aW9uaW5nLnVwZGF0ZSgpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdG5nYkF1dG9DbG9zZSh0aGlzLl9uZ1pvbmUsIHRoaXMuX2RvY3VtZW50LCAnb3V0c2lkZScsICgpID0+IHRoaXMuZGlzbWlzc1BvcHVwKCksIHRoaXMuX2Nsb3NlZCQsIFtcblx0XHRcdFx0dGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuXHRcdFx0XHR0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCxcblx0XHRcdF0pO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX2Nsb3NlUG9wdXAoKSB7XG5cdFx0dGhpcy5fcG9wdXBTZXJ2aWNlLmNsb3NlKCkuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdHRoaXMuX3Bvc2l0aW9uaW5nLmRlc3Ryb3koKTtcblx0XHRcdHRoaXMuX3pvbmVTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG5cdFx0XHR0aGlzLl9jbG9zZWQkLm5leHQoKTtcblx0XHRcdHRoaXMuX3dpbmRvd1JlZiA9IG51bGw7XG5cdFx0XHR0aGlzLmFjdGl2ZURlc2NlbmRhbnQgPSBudWxsO1xuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBfc2VsZWN0UmVzdWx0KHJlc3VsdDogYW55KSB7XG5cdFx0bGV0IGRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcblx0XHR0aGlzLnNlbGVjdEl0ZW0uZW1pdCh7XG5cdFx0XHRpdGVtOiByZXN1bHQsXG5cdFx0XHRwcmV2ZW50RGVmYXVsdDogKCkgPT4ge1xuXHRcdFx0XHRkZWZhdWx0UHJldmVudGVkID0gdHJ1ZTtcblx0XHRcdH0sXG5cdFx0fSk7XG5cdFx0dGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQubmV4dChudWxsKTtcblxuXHRcdGlmICghZGVmYXVsdFByZXZlbnRlZCkge1xuXHRcdFx0dGhpcy53cml0ZVZhbHVlKHJlc3VsdCk7XG5cdFx0XHR0aGlzLl9vbkNoYW5nZShyZXN1bHQpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX3NlbGVjdFJlc3VsdENsb3NlUG9wdXAocmVzdWx0OiBhbnkpIHtcblx0XHR0aGlzLl9zZWxlY3RSZXN1bHQocmVzdWx0KTtcblx0XHR0aGlzLl9jbG9zZVBvcHVwKCk7XG5cdH1cblxuXHRwcml2YXRlIF9zaG93SGludCgpIHtcblx0XHRpZiAodGhpcy5zaG93SGludCAmJiB0aGlzLl93aW5kb3dSZWY/Lmluc3RhbmNlLmhhc0FjdGl2ZSgpICYmIHRoaXMuX2lucHV0VmFsdWVCYWNrdXAgIT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgdXNlcklucHV0TG93ZXJDYXNlID0gdGhpcy5faW5wdXRWYWx1ZUJhY2t1cC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0Y29uc3QgZm9ybWF0dGVkVmFsID0gdGhpcy5fZm9ybWF0SXRlbUZvcklucHV0KHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5nZXRBY3RpdmUoKSk7XG5cblx0XHRcdGlmICh1c2VySW5wdXRMb3dlckNhc2UgPT09IGZvcm1hdHRlZFZhbC5zdWJzdHJpbmcoMCwgdGhpcy5faW5wdXRWYWx1ZUJhY2t1cC5sZW5ndGgpLnRvTG93ZXJDYXNlKCkpIHtcblx0XHRcdFx0dGhpcy5fd3JpdGVJbnB1dFZhbHVlKHRoaXMuX2lucHV0VmFsdWVCYWNrdXAgKyBmb3JtYXR0ZWRWYWwuc3Vic3RyaW5nKHRoaXMuX2lucHV0VmFsdWVCYWNrdXAubGVuZ3RoKSk7XG5cdFx0XHRcdHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudFsnc2V0U2VsZWN0aW9uUmFuZ2UnXS5hcHBseSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIFtcblx0XHRcdFx0XHR0aGlzLl9pbnB1dFZhbHVlQmFja3VwLmxlbmd0aCxcblx0XHRcdFx0XHRmb3JtYXR0ZWRWYWwubGVuZ3RoLFxuXHRcdFx0XHRdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX3dyaXRlSW5wdXRWYWx1ZShmb3JtYXR0ZWRWYWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX2Zvcm1hdEl0ZW1Gb3JJbnB1dChpdGVtOiBhbnkpOiBzdHJpbmcge1xuXHRcdHJldHVybiBpdGVtICE9IG51bGwgJiYgdGhpcy5pbnB1dEZvcm1hdHRlciA/IHRoaXMuaW5wdXRGb3JtYXR0ZXIoaXRlbSkgOiB0b1N0cmluZyhpdGVtKTtcblx0fVxuXG5cdHByaXZhdGUgX3dyaXRlSW5wdXRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG5cdFx0dGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB0b1N0cmluZyh2YWx1ZSkpO1xuXHR9XG5cblx0cHJpdmF0ZSBfc3Vic2NyaWJlVG9Vc2VySW5wdXQoKTogdm9pZCB7XG5cdFx0Y29uc3QgcmVzdWx0cyQgPSB0aGlzLl92YWx1ZUNoYW5nZXMucGlwZShcblx0XHRcdHRhcCgodmFsdWUpID0+IHtcblx0XHRcdFx0dGhpcy5faW5wdXRWYWx1ZUJhY2t1cCA9IHRoaXMuc2hvd0hpbnQgPyB2YWx1ZSA6IG51bGw7XG5cdFx0XHRcdHRoaXMuX29uQ2hhbmdlKHRoaXMuZWRpdGFibGUgPyB2YWx1ZSA6IHVuZGVmaW5lZCk7XG5cdFx0XHR9KSxcblx0XHRcdHRoaXMubmdiVHlwZWFoZWFkID8gdGhpcy5uZ2JUeXBlYWhlYWQgOiAoKSA9PiBvZihbXSksXG5cdFx0KTtcblxuXHRcdHRoaXMuX3N1YnNjcmlwdGlvbiA9IHRoaXMuX3Jlc3Vic2NyaWJlVHlwZWFoZWFkLnBpcGUoc3dpdGNoTWFwKCgpID0+IHJlc3VsdHMkKSkuc3Vic2NyaWJlKChyZXN1bHRzKSA9PiB7XG5cdFx0XHRpZiAoIXJlc3VsdHMgfHwgcmVzdWx0cy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0dGhpcy5fY2xvc2VQb3B1cCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fb3BlblBvcHVwKCk7XG5cblx0XHRcdFx0dGhpcy5fd2luZG93UmVmIS5pbnN0YW5jZS5mb2N1c0ZpcnN0ID0gdGhpcy5mb2N1c0ZpcnN0O1xuXHRcdFx0XHR0aGlzLl93aW5kb3dSZWYhLmluc3RhbmNlLnJlc3VsdHMgPSByZXN1bHRzO1xuXHRcdFx0XHR0aGlzLl93aW5kb3dSZWYhLmluc3RhbmNlLnRlcm0gPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG5cdFx0XHRcdGlmICh0aGlzLnJlc3VsdEZvcm1hdHRlcikge1xuXHRcdFx0XHRcdHRoaXMuX3dpbmRvd1JlZiEuaW5zdGFuY2UuZm9ybWF0dGVyID0gdGhpcy5yZXN1bHRGb3JtYXR0ZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMucmVzdWx0VGVtcGxhdGUpIHtcblx0XHRcdFx0XHR0aGlzLl93aW5kb3dSZWYhLmluc3RhbmNlLnJlc3VsdFRlbXBsYXRlID0gdGhpcy5yZXN1bHRUZW1wbGF0ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl93aW5kb3dSZWYhLmluc3RhbmNlLnJlc2V0QWN0aXZlKCk7XG5cblx0XHRcdFx0Ly8gVGhlIG9ic2VydmFibGUgc3RyZWFtIHdlIGFyZSBzdWJzY3JpYmluZyB0byBtaWdodCBoYXZlIGFzeW5jIHN0ZXBzXG5cdFx0XHRcdC8vIGFuZCBpZiBhIGNvbXBvbmVudCBjb250YWluaW5nIHR5cGVhaGVhZCBpcyB1c2luZyB0aGUgT25QdXNoIHN0cmF0ZWd5XG5cdFx0XHRcdC8vIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIHR1cm4gd291bGRuJ3QgYmUgaW52b2tlZCBhdXRvbWF0aWNhbGx5LlxuXHRcdFx0XHR0aGlzLl93aW5kb3dSZWYhLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblxuXHRcdFx0XHR0aGlzLl9zaG93SGludCgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBsaXZlIGFubm91bmNlclxuXHRcdFx0Y29uc3QgY291bnQgPSByZXN1bHRzID8gcmVzdWx0cy5sZW5ndGggOiAwO1xuXHRcdFx0dGhpcy5fbGl2ZS5zYXkoY291bnQgPT09IDAgPyAnTm8gcmVzdWx0cyBhdmFpbGFibGUnIDogYCR7Y291bnR9IHJlc3VsdCR7Y291bnQgPT09IDEgPyAnJyA6ICdzJ30gYXZhaWxhYmxlYCk7XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF91bnN1YnNjcmliZUZyb21Vc2VySW5wdXQoKSB7XG5cdFx0aWYgKHRoaXMuX3N1YnNjcmlwdGlvbikge1xuXHRcdFx0dGhpcy5fc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG5cdFx0fVxuXHRcdHRoaXMuX3N1YnNjcmlwdGlvbiA9IG51bGw7XG5cdH1cbn1cbiJdfQ==